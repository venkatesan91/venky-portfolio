import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Resume, ParseResult } from '../models/resume.interface';
import * as pdfjsLib from 'pdfjs-dist';

import { RESUME_DATA } from '../data/resume-data';

@Injectable({
    providedIn: 'root'
})
export class ResumeService {
    private resumeSubject = new BehaviorSubject<Resume | null>(RESUME_DATA);
    public resume$: Observable<Resume | null> = this.resumeSubject.asObservable();

    private parseResultSubject = new BehaviorSubject<ParseResult>({
        resume: RESUME_DATA,
        confidence: 1,
        errors: [],
        manualMode: true
    });
    public parseResult$: Observable<ParseResult> = this.parseResultSubject.asObservable();

    constructor() {
        // Set up PDF.js worker
        const pdfjsVersion = pdfjsLib.version;
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

        // Auto-load resume on init
        this.loadDefaultResume();
    }

    /**
     * Load the default resume from assets/resume.pdf
     */
    loadDefaultResume(): void {
        // User requested to use JSON data directly instead of PDF parsing
        // Using hardcoded data for reliability
        this.resumeSubject.next(RESUME_DATA);
    }

    /**
     * Parse PDF from URL
     */
    parsePDFFromUrl(url: string): Observable<ParseResult> {
        return from(fetch(url)).pipe(
            switchMap(response => {
                if (!response.ok) {
                    throw new Error('Failed to load PDF');
                }
                return from(response.arrayBuffer());
            }),
            switchMap(arrayBuffer => this.extractTextFromPDF(arrayBuffer)),
            map(text => this.parseResumeText(text)),
            catchError(error => {
                console.warn('PDF parsing failed, falling back to sample JSON:', error);
                return this.loadFallbackData();
            })
        );
    }

    /**
     * Parse uploaded PDF file
     */
    parseUploadedPDF(file: File): Observable<ParseResult> {
        return from(file.arrayBuffer()).pipe(
            switchMap(arrayBuffer => this.extractTextFromPDF(arrayBuffer)),
            map(text => this.parseResumeText(text)),
            catchError(error => {
                console.error('Failed to parse uploaded PDF:', error);
                const result: ParseResult = {
                    resume: null,
                    confidence: 0,
                    errors: [error.message],
                    manualMode: true
                };
                this.parseResultSubject.next(result);
                return of(result);
            })
        );
    }

    /**
     * Extract text from PDF ArrayBuffer
     */
    private extractTextFromPDF(arrayBuffer: ArrayBuffer): Observable<string> {
        return from(pdfjsLib.getDocument({ data: arrayBuffer }).promise).pipe(
            switchMap(pdf => {
                const pagePromises: Promise<string>[] = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    pagePromises.push(
                        pdf.getPage(i).then(page => {
                            return page.getTextContent().then(textContent => {
                                return textContent.items
                                    .map((item: any) => item.str)
                                    .join(' ');
                            });
                        })
                    );
                }
                return from(Promise.all(pagePromises));
            }),
            map(pages => pages.join('\n'))
        );
    }

    /**
     * Parse extracted text into Resume object
     */
    private parseResumeText(text: string): ParseResult {
        const resume: Partial<Resume> = {};
        const errors: string[] = [];
        let confidence = 0;

        try {
            // Parse personal info
            const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
            const phoneMatch = text.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
            const linkedinMatch = text.match(/linkedin\.com\/in\/([\w-]+)/i);
            const githubMatch = text.match(/github\.com\/([\w-]+)/i);

            // Extract name (usually first line or near top)
            const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/m);

            resume.personalInfo = {
                name: nameMatch ? nameMatch[1] : 'Name Not Found',
                title: this.extractTitle(text),
                summary: this.extractSummary(text),
                email: emailMatch ? emailMatch[0] : '',
                phone: phoneMatch ? phoneMatch[0] : '',
                location: this.extractLocation(text),
                avatar: ''
            };

            resume.social = {
                github: githubMatch ? `https://github.com/${githubMatch[1]}` : '',
                linkedin: linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '',
            };

            // Parse experience
            resume.experience = this.extractExperience(text);

            // Parse education
            resume.education = this.extractEducation(text);

            // Parse skills
            resume.skills = this.extractSkills(text);

            // Parse projects
            resume.projects = this.extractProjects(text);

            // Calculate confidence based on extracted fields
            confidence = this.calculateConfidence(resume as Resume);

            if (confidence < 0.5) {
                console.warn('Low confidence in parsed data, using fallback');
                throw new Error('Low confidence parse');
            }

            const result: ParseResult = {
                resume: resume as Resume,
                confidence,
                errors,
                manualMode: false
            };

            this.resumeSubject.next(resume as Resume);
            this.parseResultSubject.next(result);

            return result;

        } catch (error: any) {
            errors.push(error.message);
            // Fall back to sample data
            return {
                resume: null,
                confidence: 0,
                errors,
                manualMode: true
            };
        }
    }

    /**
     * Load fallback data from JSON
     */
    private loadFallbackData(): Observable<ParseResult> {
        return from(fetch('assets/resume-sample.json')).pipe(
            switchMap(response => from(response.json())),
            map((resume: Resume) => {
                console.info('Using fallback resume data');
                const result: ParseResult = {
                    resume,
                    confidence: 1,
                    errors: ['Using manual fallback data'],
                    manualMode: true
                };
                this.resumeSubject.next(resume);
                this.parseResultSubject.next(result);
                return result;
            }),
            catchError(error => {
                console.error('Failed to load fallback data:', error);
                const result: ParseResult = {
                    resume: null,
                    confidence: 0,
                    errors: ['Failed to load any resume data'],
                    manualMode: true
                };
                this.parseResultSubject.next(result);
                return of(result);
            })
        );
    }

    // Helper parsing methods
    private extractTitle(text: string): string {
        const titlePatterns = [
            /(?:^|\n)([A-Z][a-z]+\s+(?:Engineer|Developer|Designer|Architect|Manager|Lead|Analyst|Consultant))/i,
            /Title[:\s]+([^\n]+)/i,
            /Position[:\s]+([^\n]+)/i
        ];

        for (const pattern of titlePatterns) {
            const match = text.match(pattern);
            if (match) return match[1].trim();
        }
        return 'Software Developer';
    }

    private extractSummary(text: string): string {
        const summaryPatterns = [
            /(?:Summary|About|Profile|Overview)[:\s]+([^\n]{50,300})/i,
            /^([A-Z][^.]{100,300}\.)/m
        ];

        for (const pattern of summaryPatterns) {
            const match = text.match(pattern);
            if (match) return match[1].trim();
        }
        return 'Experienced professional with expertise in software development';
    }

    private extractLocation(text: string): string {
        const locationMatch = text.match(/(?:Location|Based in|City)[:\s]+([^\n]+)/i) ||
            text.match(/([A-Z][a-z]+,\s*[A-Z]{2,})/);
        return locationMatch ? locationMatch[1].trim() : '';
    }

    private extractExperience(text: string): any[] {
        // This is a simplified parser - would need more sophisticated logic
        const experiences: any[] = [];
        const expSection = text.match(/(?:EXPERIENCE|WORK HISTORY|EMPLOYMENT)([\s\S]*?)(?:EDUCATION|PROJECTS|SKILLS|$)/i);

        if (!expSection) return [];

        // Basic parsing - would need enhancement based on actual resume format
        const lines = expSection[1].split('\n').filter(line => line.trim());

        return [{
            company: 'Company Name',
            role: 'Role Title',
            startDate: '2020',
            endDate: 'Present',
            responsibilities: ['Parsed responsibilities will appear here'],
            technologies: []
        }];
    }

    private extractEducation(text: string): any[] {
        const eduSection = text.match(/(?:EDUCATION|ACADEMIC)([\s\S]*?)(?:EXPERIENCE|PROJECTS|SKILLS|$)/i);

        if (!eduSection) return [];

        return [{
            institution: 'Institution Name',
            degree: 'Degree',
            field: 'Field of Study',
            startDate: '2016',
            endDate: '2020'
        }];
    }

    private extractSkills(text: string): any[] {
        const skillsSection = text.match(/(?:SKILLS|TECHNOLOGIES|TECHNICAL SKILLS)([\s\S]*?)(?:EXPERIENCE|EDUCATION|PROJECTS|$)/i);

        if (!skillsSection) return [];

        // Extract common technologies
        const commonSkills = [
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
            'Angular', 'React', 'Vue', 'Node.js', 'Express',
            'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
            'Git', 'MongoDB', 'PostgreSQL', 'MySQL'
        ];

        const foundSkills = commonSkills.filter(skill =>
            text.toLowerCase().includes(skill.toLowerCase())
        );

        return [
            {
                category: 'Technologies',
                skills: foundSkills.length > 0 ? foundSkills : ['JavaScript', 'TypeScript']
            }
        ];
    }

    private extractProjects(text: string): any[] {
        return [
            {
                title: 'Project from Resume',
                description: 'Project details extracted from PDF',
                technologies: ['Tech1', 'Tech2'],
                featured: true
            }
        ];
    }

    private calculateConfidence(resume: Resume): number {
        let score = 0;
        if (resume.personalInfo?.name && resume.personalInfo.name !== 'Name Not Found') score += 0.2;
        if (resume.personalInfo?.email) score += 0.2;
        if (resume.experience && resume.experience.length > 0) score += 0.2;
        if (resume.education && resume.education.length > 0) score += 0.2;
        if (resume.skills && resume.skills.length > 0) score += 0.2;
        return score;
    }

    /**
     * Manually set resume data
     */
    setResumeData(resume: Resume): void {
        this.resumeSubject.next(resume);
        const result: ParseResult = {
            resume,
            confidence: 1,
            errors: [],
            manualMode: true
        };
        this.parseResultSubject.next(result);
    }

    /**
     * Get current resume snapshot
     */
    getCurrentResume(): Resume | null {
        return this.resumeSubject.value;
    }
}
