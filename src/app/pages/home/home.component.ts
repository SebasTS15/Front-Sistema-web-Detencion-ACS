import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EcgLineComponent } from '../../shared/ecg-line/ecg-line.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, EcgLineComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly featureCards = [
    {
      icon: '▣',
      title: 'Análisis avanzado',
      text: 'Evaluamos patrones de frecuencia cardiaca, oxigenación y flujo respiratorio con modelos de Deep Learning.'
    },
    {
      icon: '✓',
      title: 'Detección temprana',
      text: 'Identificamos riesgos potenciales para favorecer una intervención médica oportuna.'
    },
    {
      icon: '▤',
      title: 'Resultados claros',
      text: 'Obtén un informe comprensible con tu nivel de riesgo y recomendaciones.'
    },
    {
      icon: '🔒',
      title: 'Privacidad primero',
      text: 'Tu información es confidencial y está protegida bajo altos estándares de seguridad.'
    }
  ];

  readonly infoCards = [
    {
      icon: 'lungs',
      title: '¿Qué es la Apnea Central?',
      text: 'Ocurre cuando el cerebro no envía señales adecuadas a los músculos respiratorios, provocando pausas en la respiración durante el sueño.'
    },
    {
      icon: '!',
      title: 'Síntomas comunes',
      text: 'Fatiga diurna, dificultad para concentrarse, despertares nocturnos y falta de aire durante el sueño.'
    },
    {
      icon: '🩺',
      title: '¿Por qué es importante detectarla?',
      text: 'La detección temprana puede mejorar la calidad de vida y prevenir complicaciones cardiovasculares.'
    }
  ];
}
