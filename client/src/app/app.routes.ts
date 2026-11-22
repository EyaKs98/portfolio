import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { IS_LOCAL } from './env';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects/:id', component: ProjectDetailComponent },
  // L'espace admin n'existe qu'en local (il a besoin du serveur Node).
  ...(IS_LOCAL ? [{ path: 'admin', component: AdminComponent }] : []),
  { path: '**', redirectTo: '' },
];
