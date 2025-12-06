export interface PersonalInfo {
    name: string;
    title: string;
    summary: string;
    email: string;
    phone?: string;
    location: string;
    website?: string;
    avatar?: string;
}

export interface SocialLinks {
    github?: string;
    linkedin?: string;
    twitter?: string;
    medium?: string;
    stackoverflow?: string;
}

export interface Experience {
    company: string;
    role: string;
    startDate: string;
    endDate: string; // Use "Present" for current roles
    location?: string;
    description?: string;
    responsibilities: string[];
    technologies?: string[];
    logo?: string;
}

export interface Project {
    title: string;
    description: string;
    longDescription?: string;
    technologies: string[];
    image?: string;
    githubUrl?: string;
    liveUrl?: string;
    featured?: boolean;
    startDate?: string;
    endDate?: string;
}

export interface Education {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    location?: string;
    gpa?: string;
    achievements?: string[];
    logo?: string;
}

export interface SkillCategory {
    category: string;
    skills: string[];
}

export interface Certification {
    name: string;
    issuer: string;
    date: string;
    url?: string;
}

export interface Resume {
    personalInfo: PersonalInfo;
    social: SocialLinks;
    experience: Experience[];
    projects: Project[];
    education: Education[];
    skills: SkillCategory[];
    certifications?: Certification[];
    languages?: string[];
    interests?: string[];
}

export interface ParseResult {
    resume: Resume | null;
    confidence: number; // 0-1 scale
    errors: string[];
    manualMode: boolean;
}
