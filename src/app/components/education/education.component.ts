import { Component, Input, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Education } from '../../models/resume.interface';

@Component({
    selector: 'app-education',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './education.component.html',
    styles: []
})
export class EducationComponent implements AfterViewInit {
    @Input() education: Education[] = [];

    ngAfterViewInit() {
        this.setupScrollReveal();
    }

    private setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
}
