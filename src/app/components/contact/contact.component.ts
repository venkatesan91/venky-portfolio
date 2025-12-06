import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfo, SocialLinks } from '../../models/resume.interface';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  @Input() personalInfo: PersonalInfo | null = null;
  @Input() social: SocialLinks | null = null;
}
