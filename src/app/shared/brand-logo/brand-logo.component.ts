import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  templateUrl: './brand-logo.component.html',
  styleUrl: './brand-logo.component.scss'
})
export class BrandLogoComponent {
  @Input() size: 'normal' | 'small' = 'normal';
}
