import { Component } from '@angular/core';

/**
 * Fond de page sobre et fixe : deux halos doux. L'élément "informatique"
 * est la carte de code, reliée par des pistes de circuit (voir code-card).
 * Couleurs : variables CSS --glow-a et --glow-b dans styles.css.
 */
@Component({
  selector: 'app-tech-bg',
  standalone: true,
  template: `
    <div class="tech-bg" aria-hidden="true">
      <span class="glow glow-a"></span>
      <span class="glow glow-b"></span>
    </div>
  `,
  styles: [
    `
      .tech-bg {
        position: fixed;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        overflow: hidden;
      }

      .glow {
        position: absolute;
        width: 760px;
        height: 760px;
        border-radius: 50%;
      }
      .glow-a {
        right: -120px;
        top: -260px;
        background: radial-gradient(circle, var(--glow-a), transparent 65%);
      }
      .glow-b {
        left: -300px;
        bottom: -420px;
        background: radial-gradient(circle, var(--glow-b), transparent 65%);
      }
    `,
  ],
})
export class TechBgComponent {}
