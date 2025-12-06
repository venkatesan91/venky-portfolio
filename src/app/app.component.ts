import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ResumeService } from './services/resume.service';
import { Resume } from './models/resume.interface';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { IntroductionComponent } from './components/introduction/introduction.component';
import { AboutComponent } from './components/about/about.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SkillsComponent } from './components/skills/skills.component';
import { EducationComponent } from './components/education/education.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    IntroductionComponent,
    AboutComponent,
    ExperienceComponent,
    ProjectsComponent,
    SkillsComponent,
    EducationComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular-portfolio';
  resume: Resume | null = null;
  isLoading = true;
  parseError = false;

  constructor(private resumeService: ResumeService) { }

  ngOnInit() {
    // Subscribe to resume data
    this.resumeService.resume$.subscribe(resume => {
      this.resume = resume;
      this.isLoading = false;
    });

    // Subscribe to parse results for error handling
    this.resumeService.parseResult$.subscribe(result => {
      if (result.errors.length > 0 && result.confidence < 0.5) {
        this.parseError = true;
        console.warn('Resume parsing errors:', result.errors);
      }
    });
  }
}
