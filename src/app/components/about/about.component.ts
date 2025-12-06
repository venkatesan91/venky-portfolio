import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfo } from '../../models/resume.interface';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit {
  @Input() personalInfo: PersonalInfo | null = null;

  stats = [
    { label: 'Years Experience', value: '10+' },
    { label: 'Projects Completed', value: '20+' },
    { label: 'Technologies', value: '15+' }
  ];

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
