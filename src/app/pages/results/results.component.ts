import { DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApneaResult } from '../../models/medical-record.model';
import { ApneaApiService } from '../../services/apnea-api.service';
import { EcgLineComponent } from '../../shared/ecg-line/ecg-line.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink, EcgLineComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  private readonly api = inject(ApneaApiService);

  query = '';
  results: ApneaResult[] = [];
  selectedResult: ApneaResult | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.isLoading = true;
    this.api.getResults(this.query).subscribe({
      next: (results) => {
        this.results = results;
        this.selectedResult = results[0] ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.results = [];
        this.selectedResult = null;
        this.isLoading = false;
      }
    });
  }

  selectResult(result: ApneaResult): void {
    this.selectedResult = result;
  }

  badgeClass(result: ApneaResult): string {
    return result.prediction === 'Apnea Central' ? 'danger' : result.prediction === 'No detectada' ? 'success' : 'pending';
  }
}
