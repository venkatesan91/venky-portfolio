import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfo, SocialLinks } from '../../models/resume.interface';

@Component({
  selector: 'app-introduction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './introduction.component.html',
  styleUrl: './introduction.component.css'
})
export class IntroductionComponent {
  @Input() personalInfo: PersonalInfo | null = null;
  @Input() social: SocialLinks | null = null;

  downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/resume.pdf';
    link.download = 'Resume.pdf';
    link.click();
  }

  scrollToProjects() {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
