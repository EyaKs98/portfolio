import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tok {
  c: string; // classe de couleur : k, s, p, t, d, c, n, f
  t: string; // texte
}
type Line = Tok[];
interface Tab {
  name: string;
  lines: Line[];
}

const T = (c: string, t: string): Tok => ({ c, t });

/**
 * Carte "éditeur de code" interactive affichée à côté du titre de l'accueil.
 * - le code se tape tout seul (effet machine à écrire),
 * - 3 onglets cliquables (profile.ts, portfolio.component.ts, Terminal),
 * - les onglets défilent automatiquement jusqu'au premier clic.
 * Pour changer le contenu : modifie la fonction buildTabs() ci-dessous.
 */
@Component({
  selector: 'app-code-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="win">
      <div class="bar">
        <span class="dots"><i class="r"></i><i class="y"></i><i class="g"></i></span>
        <div class="tabs">
          <button *ngFor="let tb of tabs; let i = index" [class.on]="i === active" (click)="select(i, true)">
            {{ tb.name }}
          </button>
        </div>
      </div>

      <div class="code">
        <div class="ln" *ngFor="let l of view; let i = index">
          <span class="no">{{ i + 1 }}</span>
          <span class="tx"
            ><span *ngFor="let k of l" [class]="k.c">{{ k.t }}</span
            ><span class="cursor" *ngIf="i === view.length - 1">&#9613;</span></span
          >
        </div>
      </div>

      <div class="status">
        <span class="ok"><i></i> ng serve · {{ lang === 'fr' ? 'compilé avec succès' : 'compiled successfully' }}</span>
        <span>TypeScript · Angular 17</span>
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; width: 100%; position: relative; }

      .win { position: relative; z-index: 1; }

      .win {
        background: #0a1424;
        border: 1px solid #22425a;
        border-radius: 14px;
        overflow: hidden;
        box-shadow: 0 30px 70px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(45, 212, 191, 0.08), 0 0 60px rgba(45, 212, 191, 0.10);
        font-family: 'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace;
      }

      .bar {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 0 14px;
        background: #0e1c30;
        border-bottom: 1px solid #1d3850;
      }
      .dots { display: flex; gap: 7px; }
      .dots i { width: 11px; height: 11px; border-radius: 50%; display: block; }
      .dots .r { background: #ff5f57; }
      .dots .y { background: #febc2e; }
      .dots .g { background: #28c840; }

      .tabs { display: flex; overflow-x: auto; }
      .tabs button {
        font: inherit;
        font-size: 0.78rem;
        color: #7c98ad;
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        padding: 12px 14px;
        cursor: pointer;
        white-space: nowrap;
        transition: color 0.15s, border-color 0.15s, background 0.15s;
      }
      .tabs button:hover { color: #e6f4f1; }
      .tabs button.on {
        color: #e6f4f1;
        background: #0a1424;
        border-bottom-color: #2dd4bf;
      }

      .code {
        padding: 16px 0;
        height: 292px;
        overflow: hidden;
        font-size: 0.82rem;
        line-height: 1.75;
      }
      .ln { display: flex; padding-right: 16px; }
      .no {
        flex: 0 0 44px;
        text-align: right;
        padding-right: 16px;
        color: #3d5a70;
        user-select: none;
      }
      .tx { white-space: pre; color: #e6f4f1; }

      .k { color: #c4a7ff; }
      .s { color: #86efac; }
      .p { color: #5eead4; }
      .t { color: #fcd34d; }
      .d { color: #f9a8d4; }
      .c { color: #5b7a8c; font-style: italic; }
      .n { color: #8fb3c4; }
      .f { color: #e6f4f1; }
      .o { color: #38bdf8; }

      .cursor {
        color: #2dd4bf;
        animation: blink 1s steps(1) infinite;
      }
      @keyframes blink { 50% { opacity: 0; } }

      .status {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 9px 16px;
        font-size: 0.72rem;
        color: #7c98ad;
        background: #0e1c30;
        border-top: 1px solid #1d3850;
      }
      .ok { display: inline-flex; align-items: center; gap: 8px; color: #86efac; }
      .ok i { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; display: block; }

      @media (max-width: 520px) {
        .code { font-size: 0.7rem; height: 260px; }
        .status span:last-child { display: none; }
      }
    `,
  ],
})
export class CodeCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() lang: 'fr' | 'en' = 'fr';

  tabs: Tab[] = [];
  active = 0;
  view: Line[] = [[]];

  private shown = 0;
  private total = 0;
  private typing?: ReturnType<typeof setInterval>;
  private next?: ReturnType<typeof setTimeout>;
  private auto = true;
  private reduced = false;

  ngOnInit() {
    try {
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {}
    this.tabs = this.buildTabs();
    this.start();
  }

  ngOnChanges() {
    // changement de langue FR <-> EN : on reconstruit le contenu
    if (this.tabs.length) {
      this.tabs = this.buildTabs();
      this.start();
    }
  }

  ngOnDestroy() {
    this.stop();
  }

  select(i: number, manual = false) {
    if (manual) this.auto = false;
    this.active = i;
    this.start();
  }

  private stop() {
    clearInterval(this.typing);
    clearTimeout(this.next);
  }

  private start() {
    this.stop();
    const lines = this.tabs[this.active].lines;
    this.total = lines.reduce((n, l) => n + l.reduce((m, k) => m + k.t.length, 0), 0);
    this.shown = this.reduced ? this.total : 0;
    this.render();
    if (this.reduced) return;

    this.typing = setInterval(() => {
      this.shown += 2;
      this.render();
      if (this.shown >= this.total) {
        clearInterval(this.typing);
        if (this.auto) {
          this.next = setTimeout(() => this.select((this.active + 1) % this.tabs.length), 3800);
        }
      }
    }, 18);
  }

  /** Construit la partie visible (les `shown` premiers caractères). */
  private render() {
    let left = this.shown;
    const out: Line[] = [];
    for (const line of this.tabs[this.active].lines) {
      if (left <= 0 && out.length) break;
      const vis: Line = [];
      for (const k of line) {
        if (left <= 0) break;
        vis.push(left >= k.t.length ? k : { c: k.c, t: k.t.slice(0, left) });
        left -= k.t.length;
      }
      out.push(vis);
    }
    this.view = out.length ? out : [[]];
  }

  private buildTabs(): Tab[] {
    const fr = this.lang === 'fr';
    return [
      {
        name: 'profile.ts',
        lines: [
          [T('c', fr ? '// Développeuse Fullstack' : '// Fullstack Developer')],
          [T('k', 'const '), T('f', 'eya'), T('n', ': '), T('t', fr ? 'Développeuse' : 'Developer'), T('n', ' = {')],
          [T('n', '  '), T('p', 'name'), T('n', ': '), T('s', "'Eya Ksouri'"), T('n', ',')],
          [T('n', '  '), T('p', 'role'), T('n', ': '), T('s', fr ? "'Développeuse Fullstack'" : "'Fullstack Developer'"), T('n', ',')],
          [T('n', '  '), T('p', 'degree'), T('n', ': '), T('s', fr ? "'Ingénieure informatique'" : "'Software Engineer'"), T('n', ',')],
          [T('n', '  '), T('p', 'focus'), T('n', ': '), T('s', fr ? "'Applications web & IA'" : "'Web apps & AI'"), T('n', ',')],
          [T('n', '  '), T('p', 'openToWork'), T('n', ': '), T('o', 'true'), T('n', ',')],
          [T('n', '};')],
        ],
      },
      {
        name: 'portfolio.component.ts',
        lines: [
          [T('d', '@Component'), T('n', '({')],
          [T('n', '  '), T('p', 'selector'), T('n', ': '), T('s', "'app-portfolio'"), T('n', ',')],
          [T('n', '  '), T('p', 'standalone'), T('n', ': '), T('o', 'true'), T('n', ',')],
          [T('n', '  '), T('p', 'template'), T('n', ': '), T('s', fr ? '`<h1>Bienvenue</h1>`' : '`<h1>Welcome</h1>`'), T('n', ',')],
          [T('n', '})')],
          [T('k', 'export class '), T('t', 'Portfolio'), T('n', ' {')],
          [T('n', '  '), T('p', 'projects'), T('n', ' = ['), T('s', "'IA'"), T('n', ', '), T('s', "'Fullstack'"), T('n', ', '), T('s', "'Data'"), T('n', '];')],
          [T('n', '}')],
        ],
      },
      {
        name: 'Terminal',
        lines: [
          [T('o', '$ '), T('f', 'ng serve')],
          [T('s', '✔ '), T('f', fr ? 'Compilation réussie' : 'Compiled successfully')],
          [T('p', '➜ '), T('n', 'Local:   '), T('o', 'http://localhost:4200')],
          [T('n', ' ')],
          [T('o', '$ '), T('f', 'git status')],
          [T('s', '✔ '), T('f', fr ? 'Disponible pour des missions' : 'Available for work')],
        ],
      },
    ];
  }
}
