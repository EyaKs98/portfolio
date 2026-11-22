import { Component, HostListener, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

type Lang = 'fr' | 'en';
type Kind = 'freelance' | 'stage';
type L = Record<Lang, string>;

interface Experience {
  id: string;
  kind: Kind;
  title: L;
  org: L; // sous-titre dans la liste de gauche
  period: L;
  role: L;
  desc: L;
  cards: L[]; // 3 fonctionnalités principales
  tech: string[];
  tag: L; // type affiché dans l'étiquette (ex. Freelance, Stage de fin d'études)
  images?: { src: string; caption: L }[]; // captures d'écran (carrousel)
  link?: { url: string; label: L };
  company?: { name: string; url: string };
}

// ---------------------------------------------------------------------------
// Les expériences : freelance d'abord, puis les stages (du plus récent au plus ancien).
// Pour ajouter un stage ou une mission, copier un bloc ci-dessous et l'adapter.
// Les captures d'écran (champ « images ») sont dans src/assets/experience/ et
// défilent dans un carrousel à droite ; sans images, un visuel turquoise est utilisé.
// ---------------------------------------------------------------------------
const EXPERIENCES: Experience[] = [
  {
    id: 'ecommerce',
    kind: 'freelance',
    title: { fr: 'Application e‑commerce', en: 'E‑commerce application' },
    org: { fr: 'Freelance', en: 'Freelance' },
    tag: { fr: 'Freelance', en: 'Freelance' },
    period: { fr: '2023 – Présent · À distance', en: '2023 – Present · Remote' },
    role: { fr: '', en: '' },
    desc: {
      fr: "Développement d'une application web de vente en ligne : les clients parcourent le catalogue, remplissent leur panier et passent commande, pendant qu'un espace administrateur permet de gérer les produits. L'accès est sécurisé par authentification JWT, avec des droits différents selon le rôle.",
      en: 'Development of an online shopping web app: customers browse the catalog, fill their cart and place orders, while an admin area lets staff manage products. Access is secured with JWT authentication and role-based permissions.',
    },
    cards: [],
    tech: ['Angular', 'Node.js', 'Express', 'SQL Server'],
    images: [
      { src: 'assets/experience/ecommerce-1.jpg', caption: { fr: 'Catalogue', en: 'Catalog' } },
      { src: 'assets/experience/ecommerce-3.jpg', caption: { fr: 'Panier & commande', en: 'Cart & checkout' } },
      { src: 'assets/experience/ecommerce-4.jpg', caption: { fr: 'Gestion des produits (administrateur)', en: 'Product management (admin)' } },
    ],
  },
  {
    id: 'avis',
    kind: 'freelance',
    title: { fr: "Plateforme d'avis et d'évaluations", en: 'Reviews & ratings platform' },
    org: { fr: 'Freelance', en: 'Freelance' },
    tag: { fr: 'Freelance', en: 'Freelance' },
    period: { fr: '2023 – Présent · À distance', en: '2023 – Present · Remote' },
    role: { fr: '', en: '' },
    desc: {
      fr: "Développement d'une plateforme communautaire où chacun peut découvrir des lieux, produits et services, les noter et laisser un commentaire. Chaque utilisateur gère son profil et ses contributions, depuis une interface responsive aux formulaires validés.",
      en: 'Development of a community platform where anyone can discover places, products and services, rate them and leave a comment. Each user manages their profile and contributions through a responsive interface with validated forms.',
    },
    cards: [],
    images: [
      { src: 'assets/experience/avis-1.jpg', caption: { fr: 'Explorer les avis', en: 'Browse reviews' } },
      { src: 'assets/experience/avis-2.jpg', caption: { fr: 'Fiche et notes détaillées', en: 'Item page & rating breakdown' } },
      { src: 'assets/experience/avis-3.jpg', caption: { fr: 'Laisser un avis', en: 'Leave a review' } },
      { src: 'assets/experience/avis-4.jpg', caption: { fr: 'Ajouter un élément', en: 'Add an item' } },
      { src: 'assets/experience/avis-5.jpg', caption: { fr: 'Profil et contributions', en: 'Profile & contributions' } },
    ],
    tech: ['Angular', 'Express', 'MongoDB'],
  },
  {
    id: 'dashboard',
    kind: 'freelance',
    title: { fr: 'Tableau de bord de gestion', en: 'Management dashboard' },
    org: { fr: 'Freelance', en: 'Freelance' },
    tag: { fr: 'Freelance', en: 'Freelance' },
    period: { fr: '2023 – Présent · À distance', en: '2023 – Present · Remote' },
    role: { fr: '', en: '' },
    desc: {
      fr: "Développement d'un tableau de bord de gestion des commandes : indicateurs clés, statistiques par statut et par catégorie, et filtres par client, statut, catégorie et période. L'accès aux fonctionnalités dépend du rôle de l'utilisateur, et des tests end-to-end automatisés ont permis de détecter et corriger les anomalies.",
      en: 'Development of an order management dashboard: key indicators, statistics by status and category, and filters by customer, status, category and period. Access to features depends on the user role, and automated end-to-end tests helped detect and fix defects.',
    },
    cards: [],
    images: [
      { src: 'assets/experience/dashboard-1.jpg', caption: { fr: "Vue d'ensemble et statistiques", en: 'Overview & statistics' } },
      { src: 'assets/experience/dashboard-2.jpg', caption: { fr: 'Filtres (client, statut, catégorie, période)', en: 'Filters (customer, status, category, period)' } },
      { src: 'assets/experience/dashboard-3.jpg', caption: { fr: 'Résultats filtrés par catégorie', en: 'Results filtered by category' } },
      { src: 'assets/experience/dashboard-4.jpg', caption: { fr: 'Gestion des commandes (rôle administrateur)', en: 'Order management (admin role)' } },
    ],
    tech: ['Angular', 'Node.js', 'API REST', 'SQL Server', 'Tests automatisés'],
  },
  {
    id: 'archimed',
    kind: 'stage',
    title: { fr: 'Santefy', en: 'Santefy' },
    org: { fr: 'Archimed · PFE', en: 'Archimed · Final-year project' },
    tag: { fr: "Stage de fin d'études", en: 'Final-year internship' },
    period: { fr: 'Février 2022 – Septembre 2022 · À distance', en: 'February 2022 – September 2022 · Remote' },
    role: { fr: 'Stagiaire Développeuse Full Stack', en: 'Full Stack Developer Intern' },
    desc: {
      fr: "Conception d'une solution cloud de dropshipping destinée aux parapharmacies : les pharmaciens vendent en ligne les produits de leurs fournisseurs, sans gérer de stock. Une plateforme fluide, sécurisée et performante, avec des espaces dédiés aux clients, aux pharmaciens et aux fournisseurs.",
      en: 'Design of a cloud dropshipping solution for parapharmacies: pharmacists sell their suppliers\' products online without holding stock. A smooth, secure and high-performing platform, with dedicated areas for customers, pharmacists and suppliers.',
    },
    cards: [],
    images: [
      { src: 'assets/experience/santefy-1.jpg', caption: { fr: 'Page d\'accueil', en: 'Home page' } },
      { src: 'assets/experience/santefy-2.jpg', caption: { fr: 'Catalogue de produits', en: 'Product catalog' } },
      { src: 'assets/experience/santefy-3.jpg', caption: { fr: 'Fiche produit', en: 'Product page' } },
      { src: 'assets/experience/santefy-4.jpg', caption: { fr: 'Panier et paiement', en: 'Cart & payment' } },
      { src: 'assets/experience/santefy-5.jpg', caption: { fr: 'Facture générée', en: 'Generated invoice' } },
      { src: 'assets/experience/santefy-6.jpg', caption: { fr: 'Espace pharmacien', en: 'Pharmacist area' } },
      { src: 'assets/experience/santefy-7.jpg', caption: { fr: "Produits d'un fournisseur", en: "A supplier's products" } },
      { src: 'assets/experience/santefy-8.jpg', caption: { fr: 'Commandes clients', en: 'Customer orders' } },
    ],
    tech: ['Angular', '.NET Core', 'SQL Server', 'Serilog', 'Stripe', 'PayPal'],
    company: { name: 'Archimed', url: 'https://www.archimed.fr/' },
  },
  {
    id: 'webessor',
    kind: 'stage',
    title: { fr: 'Site web WordPress', en: 'WordPress website' },
    org: { fr: 'Webessor', en: 'Webessor' },
    tag: { fr: 'Stage', en: 'Internship' },
    period: { fr: 'Juillet 2021 – Septembre 2021 · Tunis', en: 'July 2021 – September 2021 · Tunis' },
    role: { fr: 'Stagiaire en développement Web', en: 'Web Development Intern' },
    desc: {
      fr: "Stage de 3 mois au sein de Webessor, consacré au développement d'un site web avec WordPress.",
      en: 'Three-month internship at Webessor, focused on developing a website with WordPress.',
    },
    cards: [],
    tech: ['WordPress'],
    images: [
      { src: 'assets/experience/webessor-1.jpg', caption: { fr: "Page d'accueil du site", en: 'Website home page' } },
      { src: 'assets/experience/webessor-2.jpg', caption: { fr: 'Page « Contactez-nous »', en: '“Contact us” page' } },
      { src: 'assets/experience/webessor-3.jpg', caption: { fr: "Tableau de bord d'administration WordPress", en: 'WordPress admin dashboard' } },
    ],
    company: { name: 'Webessor', url: 'https://webessor-digital.com/' },
  },
  {
    id: 'sscf',
    kind: 'stage',
    title: { fr: 'Site web pour organismes de formation', en: 'Website for training organizations' },
    org: { fr: 'SSCF Holding', en: 'SSCF Holding' },
    tag: { fr: 'Stage', en: 'Internship' },
    period: { fr: 'Juillet 2020 – Septembre 2020', en: 'July 2020 – September 2020' },
    role: { fr: 'Stagiaire développeuse Full Stack', en: 'Full Stack Developer Intern' },
    desc: {
      fr: "Stage de 3 mois au sein de SSCF Holding, consacré au développement d'un site web pour des organismes de formation.",
      en: 'Three-month internship at SSCF Holding, focused on developing a website for training organizations.',
    },
    cards: [],
    tech: ['Spring Boot', 'Angular'],
    company: { name: 'SSCF Holding', url: 'https://www.facebook.com/sscf.IoT/?locale=fr_FR' },
  },
  {
    id: 'smartup',
    kind: 'stage',
    title: { fr: 'Application de pharmacie intelligente', en: 'Smart pharmacy application' },
    org: { fr: 'SmartUP', en: 'SmartUP' },
    tag: { fr: 'Stage', en: 'Internship' },
    period: { fr: 'Juillet 2019 – Août 2019 · Tunis', en: 'July 2019 – August 2019 · Tunis' },
    role: { fr: 'Stagiaire développeuse Web', en: 'Web Development Intern' },
    desc: {
      fr: "Stage de 2 mois au sein de SmartUP, consacré au développement d'une application de pharmacie intelligente.",
      en: 'Two-month internship at SmartUP, focused on developing a smart pharmacy application.',
    },
    cards: [],
    tech: ['C++'],
    company: { name: 'SmartUP', url: 'https://www.smartup.tn/' },
  },
];

const TEXT = {
  fr: {
    title: 'Expérience professionnelle',
    subtitle: 'Mes missions freelance et mes stages.',
    list: 'Expérience',
    all: 'Tout',
    freelance: 'Freelance',
    stages: 'Stages',
    mission: 'Mission',
    stage: 'Stage',
    prev: 'Précédent',
    next: 'Suivant',
    play: 'Lecture automatique',
    pause: 'Pause',
    highlights: 'Ce que j’ai réalisé',
    kindFreelance: 'Freelance',
    kindStage: 'Stage',
    company: 'Réalisé chez',
  },
  en: {
    title: 'Professional experience',
    subtitle: 'My freelance missions and internships.',
    list: 'Experience',
    all: 'All',
    freelance: 'Freelance',
    stages: 'Internships',
    mission: 'Mission',
    stage: 'Internship',
    prev: 'Previous',
    next: 'Next',
    play: 'Autoplay',
    pause: 'Pause',
    highlights: 'What I built',
    kindFreelance: 'Freelance',
    kindStage: 'Internship',
    company: 'Completed at',
  },
};

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="experience" class="exp-wrap">
      <div class="exp-inner">
        <h2 class="exp-title">{{ t.title }}</h2>
        <p class="exp-subtitle">{{ t.subtitle }}</p>

        <!-- Filtres -->
        <div class="exp-filters" role="tablist" [style.--i]="filterIdx">
          <span class="pill-ind" aria-hidden="true"></span>
          <button type="button" class="pill" *ngFor="let f of filters; trackBy: byKey" [class.active]="filter === f.key" (click)="setFilter(f.key)">
            <span>{{ f.label }}</span><span class="count">{{ f.count }}</span>
          </button>
        </div>

        <div class="exp-grid">
          <!-- Liste de gauche -->
          <aside class="exp-list">
            <div class="list-head"><span>{{ t.list }}</span><span>{{ pad(index + 1) }} / {{ pad(items.length) }}</span></div>
            <button type="button" class="item" *ngFor="let e of items; let i = index" [class.active]="i === index" (click)="select(i)">
              <span class="num">{{ pad(i + 1) }}</span>
              <span class="item-txt">
                <strong>{{ e.title[lang] }}</strong>
                <small>{{ labelOf(e) }} · {{ e.org[lang] }}</small>
              </span>
              <span class="dot" [class.stage]="e.kind === 'stage'"></span>
            </button>
          </aside>

          <!-- Détail de droite -->
          <div class="exp-detail" [class.sparse]="!(e.images && e.images.length)" *ngFor="let e of [cur]; trackBy: byId">
            <div class="detail-body">
              <div class="tags">
                <span class="tag live"><i class="dot-s" [class.stage]="e.kind === 'stage'"></i>{{ labelOf(e) }} · {{ e.tag[lang] }}</span>
                <span class="tag">{{ e.period[lang] }}</span>
              </div>
              <p class="company" *ngIf="e.company">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M14 9h5a1 1 0 0 1 1 1v11M3 21h18M8 8h2M8 12h2M8 16h2M16 13h1M16 17h1"/></svg>
                {{ t.company }} : <a [href]="e.company.url" target="_blank" rel="noopener">{{ e.company.name }}</a>
              </p>
              <h3>{{ e.title[lang] }}</h3>
              <p class="role" *ngIf="e.role[lang]">{{ e.role[lang] }}</p>
              <p class="desc">{{ e.desc[lang] }}</p>
            </div>

            <div class="visual" (mouseenter)="hover = true" (mouseleave)="hover = false">
              <ng-container *ngIf="e.images && e.images.length; else fallback">
                <div class="slides" [style.transform]="'translateX(-' + slideOf(e) * 100 + '%)'">
                  <div class="slide" *ngFor="let im of e.images" (click)="openZoom(e)"><img [src]="im.src" [alt]="im.caption[lang]" loading="lazy"></div>
                </div>
                <div class="cap">{{ e.images[slideOf(e)].caption[lang] }}</div>
                <ng-container *ngIf="e.images.length > 1">
                  <button type="button" class="nav l" (click)="slide(e, -1)" [attr.aria-label]="t.prev">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
                  </button>
                  <button type="button" class="nav r" (click)="slide(e, 1)" [attr.aria-label]="t.next">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
                  </button>
                  <div class="sdots">
                    <span *ngFor="let im of e.images; let k = index" [class.active]="k === slideOf(e)" (click)="goSlide(e, k)"></span>
                  </div>
                </ng-container>
              </ng-container>
              <ng-template #fallback>
                <div class="visual-fallback">
                  <span class="fb-label">{{ labelOf(e) }}</span>
                  <span class="fb-org">{{ e.org[lang] }}</span>
                  <span class="fb-period">{{ e.period[lang] }}</span>
                  <div class="fb-chips"><span *ngFor="let tk of e.tech">{{ tk }}</span></div>
                </div>
              </ng-template>
            </div>

            <div class="detail-foot">
              <div class="cards" *ngIf="e.cards.length">
                <div class="card" *ngFor="let c of e.cards">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15z"/></svg>
                  <span>{{ c[lang] }}</span>
                </div>
              </div>

              <div class="chips">
                <span class="chip" *ngFor="let tk of e.tech">{{ tk }}</span>
              </div>

              <a *ngIf="e.link" class="btn" [href]="e.link.url" target="_blank" rel="noopener">
                {{ e.link.label[lang] }}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>
              </a>
            </div>

            <div class="badge"><span>{{ e.kind === 'stage' ? t.stage : t.mission }}</span><b>{{ kindIndex(e) }}</b></div>
          </div>
        </div>

        <!-- Commandes -->
        <div class="controls">
          <button type="button" class="round" (click)="prev()" [attr.aria-label]="t.prev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
          </button>
          <div class="progress">
            <span class="d" *ngFor="let e of items; let i = index" [class.active]="i === index" (click)="select(i)"></span>
            <span class="cnt">{{ pad(index + 1) }} / {{ pad(items.length) }}</span>
          </div>
          <div class="right">
            
            <button type="button" class="round" (click)="next()" [attr.aria-label]="t.next">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Agrandissement d'une capture -->
      <div class="zoom" *ngIf="zoom" (click)="closeZoom()">
        <button type="button" class="zoom-close" (click)="closeZoom()" aria-label="Fermer">×</button>
        <button type="button" class="zoom-nav l" *ngIf="zoom.images!.length > 1" (click)="zoomStep(-1); $event.stopPropagation()" [attr.aria-label]="t.prev">‹</button>
        <figure (click)="$event.stopPropagation()">
          <img [src]="zoom.images![slideOf(zoom)].src" [alt]="zoom.images![slideOf(zoom)].caption[lang]">
          <figcaption>{{ zoom.images![slideOf(zoom)].caption[lang] }} · {{ slideOf(zoom) + 1 }} / {{ zoom.images!.length }}</figcaption>
        </figure>
        <button type="button" class="zoom-nav r" *ngIf="zoom.images!.length > 1" (click)="zoomStep(1); $event.stopPropagation()" [attr.aria-label]="t.next">›</button>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .exp-wrap { background: var(--bg-alt-glass); }
    .exp-inner { max-width: 1080px; margin: 0 auto; padding: 70px 24px; }
    .exp-title { font-size: 2.1rem; margin-bottom: 8px; text-align: center; }
    .exp-title::after { content: ''; display: block; width: 56px; height: 4px; margin: 14px auto 0; border-radius: 4px; background: linear-gradient(90deg, var(--accent), var(--accent-strong)); }
    .exp-subtitle { color: var(--text-dim); margin: 14px auto 36px; text-align: center; max-width: 640px; }

    /* Filtres */
    .exp-filters { position: relative; display: inline-grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 0; padding: 6px; margin-bottom: 26px; border-radius: 999px; background: var(--card); border: 1px solid var(--border); }
    .pill-ind { position: absolute; top: 6px; bottom: 6px; left: 6px; width: calc((100% - 12px) / 3); border-radius: 999px; background: linear-gradient(135deg, var(--accent), var(--accent-strong)); box-shadow: 0 8px 22px var(--accent-glow); transform: translateX(calc(var(--i, 0) * 100%)); transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .pill { position: relative; z-index: 1; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 9px 22px; border: none; border-radius: 999px; background: transparent; color: var(--text-dim); font: inherit; font-weight: 600; cursor: pointer; white-space: nowrap; transition: color 0.3s; }
    .pill:hover { color: var(--text); }
    .pill.active { color: var(--accent-contrast); }
    .count { min-width: 20px; padding: 1px 7px; border-radius: 999px; background: var(--accent-soft); font-size: 0.74rem; text-align: center; }
    .pill.active .count { background: rgba(255, 255, 255, 0.25); color: inherit; }

    .exp-grid { display: grid; grid-template-columns: 290px 1fr; gap: 28px; align-items: start; }

    /* Liste */
    .list-head { display: flex; justify-content: space-between; padding: 0 4px 12px; margin-bottom: 8px; border-bottom: 1px solid var(--border); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-dim); }
    .item { position: relative; display: flex; align-items: center; gap: 14px; width: 100%; padding: 14px 16px; margin-bottom: 4px; border: none; border-radius: 14px; background: transparent; color: inherit; font: inherit; text-align: left; cursor: pointer; transition: background 0.25s, transform 0.25s; }
    .item:hover { background: var(--accent-soft); }
    .item.active { background: var(--card); box-shadow: 0 10px 26px var(--shadow); }
    .item.active::before { content: ''; position: absolute; left: 0; top: 18%; bottom: 18%; width: 4px; border-radius: 4px; background: var(--accent); }
    .num { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.74rem; color: var(--text-dim); }
    .item.active .num { color: var(--accent); }
    .item-txt { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .item-txt strong { font-size: 1rem; font-weight: 600; }
    .item-txt small { color: var(--text-dim); font-size: 0.82rem; }
    .dot, .dot-s { display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); flex: none; }
    .dot.stage, .dot-s.stage { background: #8b7cf6; }

    /* Détail */
    .exp-detail { min-height: 620px; position: relative; display: grid; grid-template-columns: 1fr 1.3fr; gap: 8px 30px; padding: 34px 34px 80px; border-radius: 28px; background: var(--card); border: 1px solid var(--border); box-shadow: 0 24px 60px var(--shadow); animation: swap 0.45s cubic-bezier(0.2, 0.8, 0.2, 1); overflow: hidden; }
    @keyframes swap { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
    .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
    .tag { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; background: var(--bg-alt); border: 1px solid var(--border); font-size: 0.82rem; color: var(--text-dim); }
    .tag.live { color: var(--text); }
    h3 { font-size: 1.7rem; margin-bottom: 14px; }
    .company { display: flex; align-items: center; gap: 8px; margin: 0 0 10px; color: var(--text-dim); font-size: 0.95rem; }
    .company svg { width: 18px; height: 18px; color: var(--accent); flex: none; }
    .company a { color: var(--accent); font-weight: 700; text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s; }
    .company a:hover { border-bottom-color: var(--accent); }
    .role { color: var(--accent); font-weight: 600; margin-bottom: 14px; }
    .desc { color: var(--text-dim); line-height: 1.75; margin-bottom: 14px; }

    .detail-foot { grid-column: 1 / -1; }
    /* fiches sans captures : la hauteur du cadre suit le texte (photo/visuel inchangé) */
    .exp-detail.sparse { min-height: 0; align-self: start; }
    .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
    .card { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; border-radius: 14px; background: var(--bg-alt); border: 1px solid var(--border); font-size: 0.86rem; line-height: 1.35; }
    .card svg { width: 18px; height: 18px; color: var(--accent); }

    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
    .chip { padding: 7px 14px; border-radius: 999px; background: var(--accent-soft); border: 1px solid var(--border); color: var(--text); font-size: 0.85rem; font-weight: 500; }

    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border-radius: 12px; background: linear-gradient(135deg, var(--accent), var(--accent-strong)); color: var(--accent-contrast); font-weight: 600; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px var(--accent-glow); }
    .btn svg { width: 16px; height: 16px; }

    /* Visuel de droite */
    .visual { position: relative; align-self: start; aspect-ratio: 16 / 10; border-radius: 20px; overflow: hidden; background: linear-gradient(150deg, var(--img-from), var(--img-to)); border: 1px solid var(--border); }
    .slides { display: flex; height: 100%; transition: transform 0.55s cubic-bezier(0.2, 0.8, 0.2, 1); }
    .slide { flex: 0 0 100%; height: 100%; display: grid; place-items: center; background: #f4f2ee; }
    .slide img { max-width: 100%; max-height: 100%; display: block; object-fit: contain; }
    .cap { position: absolute; left: 14px; bottom: 14px; padding: 6px 14px; border-radius: 999px; background: rgba(6, 16, 28, 0.78); color: #fff; font-size: 0.78rem; backdrop-filter: blur(6px); }
    .nav { position: absolute; top: 50%; width: 38px; height: 38px; margin-top: -19px; display: grid; place-items: center; border: none; border-radius: 50%; background: rgba(6, 16, 28, 0.72); color: #fff; cursor: pointer; opacity: 0; transition: opacity 0.25s, background 0.2s; }
    .visual:hover .nav { opacity: 1; }
    .nav:hover { background: var(--accent); color: var(--accent-contrast); }
    .nav svg { width: 18px; height: 18px; }
    .nav.l { left: 12px; }
    .nav.r { right: 12px; }
    .sdots { position: absolute; right: 14px; bottom: 18px; display: flex; gap: 6px; }
    .sdots span { width: 8px; height: 8px; border-radius: 999px; background: rgba(6, 16, 28, 0.35); border: 1px solid rgba(255, 255, 255, 0.7); cursor: pointer; transition: width 0.3s, background 0.3s; }
    .sdots span.active { width: 24px; background: var(--accent); border-color: var(--accent); }
    .visual-fallback { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; background: radial-gradient(var(--dots) 1px, transparent 1.4px) 0 0 / 18px 18px; }
    .fb-label { padding: 4px 12px; border-radius: 999px; background: var(--accent-soft); border: 1px solid var(--border); color: var(--accent); font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.74rem; letter-spacing: 0.14em; text-transform: uppercase; }
    .fb-org { font-size: 1.9rem; font-weight: 800; line-height: 1.1; text-align: center; padding: 0 16px; }
    .fb-period { color: var(--text-dim); font-size: 0.88rem; }
    .fb-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 6px; padding: 0 16px; }
    .fb-chips span { padding: 6px 14px; border-radius: 999px; background: var(--card); border: 1px solid var(--border); font-size: 0.82rem; font-weight: 500; }
    .big { font-size: 4.5rem; font-weight: 800; color: var(--accent); line-height: 1; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.8rem; color: var(--text-dim); }

    .badge { position: absolute; right: 22px; bottom: 20px; display: inline-flex; align-items: baseline; gap: 10px; padding: 10px 18px; border-radius: 16px; background: var(--card); border: 1px solid var(--border); box-shadow: 0 10px 24px var(--shadow); }
    .badge b { font-size: 1.15rem; color: var(--accent); }
    .badge span { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-dim); }

    .slide { cursor: zoom-in; }
    .zoom { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; gap: 16px; padding: 24px; background: rgba(3, 8, 16, 0.88); backdrop-filter: blur(6px); animation: swap 0.25s ease; }
    .zoom figure { margin: 0; max-width: min(1100px, 86vw); text-align: center; }
    .zoom img { max-width: 100%; max-height: 80vh; border-radius: 14px; box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6); background: #f4f2ee; }
    .zoom figcaption { margin-top: 12px; color: #dbe7ee; font-size: 0.9rem; }
    .zoom-close { position: absolute; top: 18px; right: 22px; width: 44px; height: 44px; border: none; border-radius: 50%; background: rgba(255, 255, 255, 0.12); color: #fff; font-size: 1.8rem; line-height: 1; cursor: pointer; }
    .zoom-nav { width: 48px; height: 48px; border: none; border-radius: 50%; background: rgba(255, 255, 255, 0.12); color: #fff; font-size: 2rem; line-height: 1; cursor: pointer; flex: none; }
    .zoom-close:hover, .zoom-nav:hover { background: var(--accent); color: var(--accent-contrast); }

    /* Commandes */
    .controls { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 26px; }
    .right { display: flex; gap: 10px; }
    .round { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--border); background: var(--card); color: var(--text); cursor: pointer; transition: border-color 0.2s, color 0.2s, transform 0.2s; }
    .round:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }
    .round svg { width: 20px; height: 20px; }
    .progress { display: flex; align-items: center; gap: 8px; }
    .d { position: relative; width: 10px; height: 10px; border-radius: 999px; background: var(--border); cursor: pointer; transition: width 0.3s, background 0.3s; }
    .d::after { content: ''; position: absolute; inset: -12px -4px; }
    .d.active { width: 36px; background: var(--accent); }
    .cnt { margin-left: 10px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.78rem; color: var(--text-dim); }

    @media (max-width: 900px) {
      .exp-grid { grid-template-columns: 1fr; }
      .exp-list { display: block; }
      .exp-detail { grid-template-columns: 1fr; padding: 24px; }
      .visual { order: -1; }
      .nav { opacity: 1; }
      .badge { display: none; }
    }
    @media (max-width: 560px) {
      .cards { grid-template-columns: 1fr; }
      .exp-filters { display: grid; width: 100%; }
      .pill { padding: 9px 8px; }
    }
    @media (prefers-reduced-motion: reduce) { .exp-detail { animation: none; } }
  `],
})
export class ExperienceComponent implements OnDestroy {
  @Input() lang: Lang = 'fr';

  filter: 'all' | Kind = 'all';
  index = 0;
  playing = false;
  hover = false;
  zoom: Experience | null = null;
  private slideIdx: Record<string, number> = {};
  private timer: any;
  private slideTimer: any;

  constructor() {
    // les captures défilent toutes seules (sauf quand la souris est dessus)
    this.slideTimer = setInterval(() => {
      const e = this.cur;
      if (!this.hover && e && e.images && e.images.length > 1) this.slide(e, 1);
    }, 4500);
  }

  get t() {
    return TEXT[this.lang];
  }

  get items(): Experience[] {
    return this.filter === 'all' ? EXPERIENCES : EXPERIENCES.filter((e) => e.kind === this.filter);
  }

  get cur(): Experience {
    return this.items[Math.min(this.index, this.items.length - 1)];
  }

  get filterIdx(): number {
    return this.filter === 'all' ? 0 : this.filter === 'freelance' ? 1 : 2;
  }

  get filters() {
    const count = (k: Kind) => EXPERIENCES.filter((e) => e.kind === k).length;
    return [
      { key: 'all' as const, label: this.t.all, count: EXPERIENCES.length },
      { key: 'freelance' as const, label: this.t.freelance, count: count('freelance') },
      { key: 'stage' as const, label: this.t.stages, count: count('stage') },
    ];
  }

  byId = (_: number, e: Experience) => e.id;
  byKey = (_: number, f: { key: string }) => f.key;

  // « Mission 1 », « Stage 1 » : numéro dans sa catégorie, pour ne pas se tromper
  kindIndex(e: Experience): number {
    return EXPERIENCES.filter((x) => x.kind === e.kind).indexOf(e) + 1;
  }

  labelOf(e: Experience): string {
    return (e.kind === 'stage' ? this.t.stage : this.t.mission) + ' ' + this.kindIndex(e);
  }

  slideOf(e: Experience): number {
    return this.slideIdx[e.id] || 0;
  }

  slide(e: Experience, d: number) {
    const n = (e.images || []).length;
    if (n) this.slideIdx[e.id] = (this.slideOf(e) + d + n) % n;
  }

  openZoom(e: Experience) {
    this.zoom = e;
  }

  closeZoom() {
    this.zoom = null;
  }

  zoomStep(d: number) {
    if (this.zoom) this.slide(this.zoom, d);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(ev: KeyboardEvent) {
    if (!this.zoom) return;
    if (ev.key === 'Escape') this.closeZoom();
    if (ev.key === 'ArrowLeft') this.zoomStep(-1);
    if (ev.key === 'ArrowRight') this.zoomStep(1);
  }

  goSlide(e: Experience, k: number) {
    this.slideIdx[e.id] = k;
  }

  pad(n: number) {
    return n < 10 ? '0' + n : String(n);
  }

  setFilter(f: 'all' | Kind) {
    this.filter = f;
    this.index = 0;
  }

  select(i: number) {
    this.index = i;
  }

  next() {
    this.index = (this.index + 1) % this.items.length;
  }

  prev() {
    this.index = (this.index - 1 + this.items.length) % this.items.length;
  }

  togglePlay() {
    this.playing = !this.playing;
    clearInterval(this.timer);
    if (this.playing) {
      this.timer = setInterval(() => this.next(), 6000);
    }
  }

  ngOnDestroy() {
    clearInterval(this.timer);
    clearInterval(this.slideTimer);
  }
}
