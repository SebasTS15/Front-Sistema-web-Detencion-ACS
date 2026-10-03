import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BrandLogoComponent } from './shared/brand-logo/brand-logo.component';
import { ToastComponent } from './shared/toast/toast.component';
import { ApneaApiService } from './services/apnea-api.service';
import { routeAnimation } from './animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, BrandLogoComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [routeAnimation]
})
export class AppComponent {
  private readonly api = inject(ApneaApiService);
  private readonly router = inject(Router);

  readonly currentYear = new Date().getFullYear();

  get isLoggedIn(): boolean {
    return this.api.isLoggedIn();
  }

  get routeKey(): string {
    return this.router.url;
  }

  logout(): void {
    this.api.logout();
    this.router.navigateByUrl('/');
  }
}
