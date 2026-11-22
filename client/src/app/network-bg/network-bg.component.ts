import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * Fond animé : réseau de points reliés par des lignes (style "constellation").
 * Les couleurs viennent des variables CSS --net-node / --net-line (styles.css),
 * donc elles changent toutes seules avec le mode jour / nuit.
 */
@Component({
  selector: 'app-network-bg',
  standalone: true,
  template: '<canvas #cv></canvas>',
  styles: [
    `
      canvas {
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
        display: block;
      }
    `,
  ],
})
export class NetworkBgComponent implements OnInit, OnDestroy {
  @ViewChild('cv', { static: true }) cv!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private nodes: Node[] = [];
  private w = 0;
  private h = 0;
  private raf = 0;
  private frame = 0;
  private nodeRgb = '94, 234, 212';
  private lineRgb = '94, 234, 212';
  private reduced = false;
  private onResize = () => this.resize();

  // Réglages (tu peux les modifier)
  private readonly LINK_DIST = 150; // distance max pour relier deux points
  private readonly SPEED = 0.25; // vitesse de déplacement
  private readonly DENSITY = 14000; // plus grand = moins de points

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.ctx = this.cv.nativeElement.getContext('2d')!;
    try {
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {}
    this.resize();
    window.addEventListener('resize', this.onResize);
    // hors zone Angular : l'animation ne déclenche pas de détection de changements
    this.zone.runOutsideAngular(() => this.loop());
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
  }

  private resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    const c = this.cv.nativeElement;
    c.width = this.w * dpr;
    c.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(Math.round((this.w * this.h) / this.DENSITY), 110);
    this.nodes = Array.from({ length: count }, () => ({
      x: Math.random() * this.w,
      y: Math.random() * this.h,
      vx: (Math.random() - 0.5) * this.SPEED * 2,
      vy: (Math.random() - 0.5) * this.SPEED * 2,
      r: 1.4 + Math.random() * 1.6,
    }));
    if (this.reduced) this.draw();
  }

  private readColors() {
    const cs = getComputedStyle(document.documentElement);
    this.nodeRgb = cs.getPropertyValue('--net-node').trim() || this.nodeRgb;
    this.lineRgb = cs.getPropertyValue('--net-line').trim() || this.lineRgb;
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    if (this.reduced) return;
    this.step();
    this.draw();
  };

  private step() {
    for (const n of this.nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > this.w) n.vx *= -1;
      if (n.y < 0 || n.y > this.h) n.vy *= -1;
    }
  }

  private draw() {
    if (this.frame++ % 30 === 0) this.readColors();
    const { ctx, nodes, w, h } = this;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.hypot(dx, dy);
        if (d < this.LINK_DIST) {
          ctx.strokeStyle = `rgba(${this.lineRgb}, ${(1 - d / this.LINK_DIST) * 0.28})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = `rgba(${this.nodeRgb}, 0.85)`;
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
