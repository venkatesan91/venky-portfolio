import { Component, Input, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience } from '../../models/resume.interface';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent implements AfterViewInit {
  @Input() experiences: Experience[] = [];

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

  formatDate(date: string): string {
    if (date.toLowerCase() === 'present') return 'Present';
    // Basic date formatting - enhance as needed
    return date;
  }
}
