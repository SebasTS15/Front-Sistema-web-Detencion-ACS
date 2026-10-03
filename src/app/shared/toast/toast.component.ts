import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgClass, AsyncPipe],
  template: `
    <div class="toast-container">
      @for (toast of (toastService.toasts | async); track toast.id) {
        <div class="toast" [ngClass]="toast.type" (click)="toastService.dismiss(toast.id)">
          <span class="toast-icon">
            @switch (toast.type) {
              @case ('success') { ✓ }
              @case ('error') { ✕ }
              @default { ℹ }
            }
          </span>
          <span>{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 5.5rem;
      right: 1.5rem;
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      max-width: 22rem;
    }
    .toast {
      align-items: center;
      background: white;
      border-radius: 0.75rem;
      border-left: 4px solid var(--blue);
      box-shadow: 0 8px 24px rgba(6, 31, 114, 0.15);
      color: var(--navy);
      cursor: pointer;
      display: flex;
      font-size: 0.9rem;
      font-weight: 600;
      gap: 0.7rem;
      padding: 0.9rem 1.2rem;
      animation: slideIn 0.3s ease;
    }
    .toast.success { border-left-color: #087d44; }
    .toast.error { border-left-color: #c82232; }
    .toast.info { border-left-color: var(--blue); }
    .toast-icon {
      display: grid;
      flex: 0 0 1.6rem;
      font-size: 0.85rem;
      font-weight: 900;
      height: 1.6rem;
      place-items: center;
      width: 1.6rem;
    }
    .toast.success .toast-icon { background: #e7f8ef; color: #087d44; border-radius: 50%; }
    .toast.error .toast-icon { background: #ffe8ec; color: #c82232; border-radius: 50%; }
    .toast.info .toast-icon { background: #e9f2ff; color: var(--blue); border-radius: 50%; }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(2rem); }
      to { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
