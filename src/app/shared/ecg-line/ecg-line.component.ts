import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ecg-line',
  standalone: true,
  templateUrl: './ecg-line.component.html',
  styleUrl: './ecg-line.component.scss'
})
export class EcgLineComponent {
  @Input() variant: 'flow' | 'oxygen' | 'heart' = 'flow';
  @Input() label = '';

  get path(): string {
    const paths = {
      flow: 'M2 54 C14 54, 14 20, 24 20 C33 20, 28 65, 42 65 C52 65, 48 44, 58 44 C66 44, 65 56, 72 56 C82 56, 80 52, 88 52 C98 52, 93 34, 104 34 C114 34, 110 60, 122 60 C134 60, 130 52, 142 52 C154 52, 152 56, 166 56',
      oxygen: 'M2 42 C18 18, 29 64, 45 50 C60 36, 67 64, 84 52 C101 39, 112 63, 130 52 C145 42, 142 18, 158 18 C174 18, 171 56, 190 52',
      heart: 'M2 52 L16 52 L20 44 L25 60 L31 28 L38 55 L58 55 L63 35 L70 70 L76 47 L94 47 L99 28 L106 57 L132 57 L137 42 L144 65 L149 47 L166 47'
    };

    return paths[this.variant];
  }
}
