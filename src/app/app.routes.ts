import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { UploadRecordComponent } from './pages/upload-record/upload-record.component';
import { ResultsComponent } from './pages/results/results.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'ApneaCare | Inicio' },
  { path: 'login', component: LoginComponent, title: 'ApneaCare | Iniciar sesión' },
  { path: 'cargar-registro', component: UploadRecordComponent, title: 'ApneaCare | Cargar registro' },
  { path: 'resultados', component: ResultsComponent, title: 'ApneaCare | Resultados' },
  { path: '**', redirectTo: '' }
];
