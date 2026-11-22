import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TechBgComponent } from './tech-bg/tech-bg.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TechBgComponent],
  template: '<app-tech-bg></app-tech-bg><router-outlet></router-outlet>',
})
export class AppComponent {}
