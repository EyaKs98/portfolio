import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CodeCardComponent } from '../code-card/code-card.component';
import { ExperienceComponent } from '../experience/experience.component';
import { API_URL, IS_LOCAL, WEB3FORMS_KEY } from '../env';

interface Project {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  imageUrl: string;
  demoUrl: string;
  category: string;
}

interface Skill {
  name: string;
  icon: string;
  en?: string; // nom anglais (si différent)
  note?: { fr: string; en: string }; // petite mention affichée à côté (ex. en apprentissage)
  light?: boolean; // true = logo sombre, nécessite un fond clair pour rester visible
}

interface SkillGroup {
  label: Record<Lang, string>;
  desc: Record<Lang, string>;
  items: Skill[];
}

const dev = (name: string, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-${variant}.svg`;

type Lang = 'fr' | 'en';

const TEXT: Record<Lang, any> = {
  fr: {
    navHome: 'Accueil',
    navSkills: 'Compétences',
    navExperience: 'Expérience',
    navProjects: 'Projets',
    navEducation: 'Formation',
    educationTitle: 'Formation',
    educationSubtitle: 'Mon parcours académique.',
    navAbout: 'À propos',
    aboutTitle: 'À propos de moi',
    aboutP1:
      "Ingénieure en informatique diplômée de l'ESPRIT, spécialisée en développement Full Stack, je développe des applications web performantes, sécurisées et intuitives, de la conception au déploiement.",
    aboutP2:
      "À travers mes projets académiques, mes stages et mes missions freelance, j'ai acquis une expérience pratique en développement front-end et back-end, notamment avec Angular, Node.js, Express.js et .NET Core. Ces expériences m'ont permis de développer des fonctionnalités concrètes, de mettre en place des API REST et de contribuer à la qualité des applications développées.",
    aboutP3:
      "Curieuse des nouvelles technologies, je m'intéresse également à l'intelligence artificielle et à son intégration dans les applications web. Je continue à découvrir et à apprendre les technologies de l'IA afin d'explorer leurs possibilités et de les appliquer progressivement à des projets concrets.",
    briefTitle: 'En bref',
    basedLabel: 'Basée à',
    basedValue: 'Tunis, Tunisie',
    availLabel: 'Disponibilité',
    availValue: 'Remote, sur site & freelance — ouverte',
    langLabel: 'Langues',
    langValue: 'Français B2 · Anglais B1 · Arabe langue maternelle',
    statYears: "Années d'expérience",
    statProducts: 'Produits livrés',
    statClients: 'Entreprises & clients',
    badgeSite: 'Sur site',
    badgeRemote: '+ remote',
    navAcademic: 'Projets académiques',
    navContact: 'Contact',
    availability: 'Disponible pour des missions',
    roles: ['Développeuse Fullstack'],
    heroBio:
      "Ingénieure informatique passionnée par le développement web, je conçois des applications modernes et j’explore aujourd’hui l’intégration de l’IA pour créer des solutions toujours plus intelligentes et utiles.",
    viewWork: 'Voir mes projets',
    downloadCV: 'Télécharger mon CV',
    skillsTitle: 'Compétences',
    skillsSubtitle: 'Ce que je pratique, ce que j\'apprends.',
    projectsMain: 'Projets',
    projectsTitle: 'Projets personnels',
    projectsSubtitle: 'Une sélection de mes réalisations, orientées IA.',
    demo: 'Démo',
    viewDetails: 'Détails',
    totalProjects: 'projets au total',
    noProjects: 'Aucun projet pour le moment.',
    loading: 'Chargement des projets...',
    academicTitle: 'Projets académiques',
    academicSubtitle: 'Projets réalisés durant mon parcours de formation.',
    readMore: 'Voir plus',
    viewProject: 'Voir le projet',
    projectWord: 'Projet',
    academicKind: 'Projet académique',
    contactTitle: 'Me contacter',
    contactSubtitle: 'Un projet, une question, une opportunité ? Écrivez-moi.',
    contactHeading: 'Restons en contact',
    contactText: "Je suis toujours ouverte à discuter de nouveaux projets ou d'opportunités.",
    openTo: 'Ouverte au remote & sur site',
    responseTime: 'Réponse généralement sous 24–48 h',
    writeMe: "M'écrire",
    copied: 'Email copié !',
    reachMe: 'Me joindre',
    basedIn: 'Basée à Tunis, Tunisie',
    cvTitle: 'Curriculum vitae',
    cvSoon: 'bientôt disponible',
    cardTitle: 'Ma carte de visite',
    cardHint: 'Cliquer pour retourner la carte',
    cardFront: 'Carte de visite, recto',
    cardBack: 'Carte de visite, verso',
    formTitle: 'Envoyez-moi un message',
    formSub: 'Je reçois votre message directement par email et je vous réponds rapidement.',
    formSubject: 'Objet (optionnel)',
    sendAnother: 'Envoyer un autre message',
    location: 'Tunisie 🇹🇳',
    formName: 'Votre nom',
    formEmail: 'Votre email',
    formMessage: 'Votre message',
    formSubmit: 'Envoyer le message',
    formSending: 'Envoi...',
    formSuccess: 'Merci, votre message a bien été envoyé !',
    formError: 'Une erreur est survenue, réessayez.',
    errName: 'Merci d’indiquer votre nom (2 caractères minimum).',
    errEmailEmpty: 'Merci d’indiquer votre email.',
    errEmail: 'Adresse email invalide (ex. nom@domaine.com).',
    errMessage: 'Votre message est trop court (10 caractères minimum).',
    footerTagline: 'Construire des expériences numériques utiles.',
    footerBio: "Développeuse Fullstack passionnée par la création d'applications web fonctionnelles et élégantes, avec un intérêt grandissant pour l'IA.",
    footerSocialTitle: 'Réseaux sociaux',
    footerNavTitle: 'Liens rapides',
    footerContactTitle: 'Contact',
    rights: 'Tous droits réservés.',
  },
  en: {
    navHome: 'Home',
    navSkills: 'Skills',
    navExperience: 'Experience',
    navProjects: 'Projects',
    navEducation: 'Education',
    educationTitle: 'Education',
    educationSubtitle: 'My academic background.',
    navAbout: 'About',
    aboutTitle: 'About me',
    aboutP1:
      "Computer engineer graduated from ESPRIT, specialized in Full Stack development, I build high-performing, secure and intuitive web applications, from design to deployment.",
    aboutP2:
      "Through my academic projects, internships and freelance missions, I've gained hands-on experience in front-end and back-end development, notably with Angular, Node.js, Express.js and .NET Core. These experiences allowed me to deliver real features, set up REST APIs and contribute to the quality of the software I worked on.",
    aboutP3:
      "Curious about new technologies, I'm also interested in artificial intelligence and its integration into web applications. I keep learning about AI to explore what it makes possible and gradually apply it to concrete projects.",
    briefTitle: 'At a glance',
    basedLabel: 'Based in',
    basedValue: 'Tunis, Tunisia',
    availLabel: 'Availability',
    availValue: 'Remote, on site & freelance — open',
    langLabel: 'Languages',
    langValue: 'French B2 · English B1 · Arabic native',
    statYears: 'Years of experience',
    statProducts: 'Products delivered',
    statClients: 'Companies & clients',
    badgeSite: 'On site',
    badgeRemote: '+ remote',
    navAcademic: 'Academic Projects',
    navContact: 'Contact',
    availability: 'Available for work',
    roles: ['Fullstack Developer'],
    heroBio:
      "As a software engineer passionate about web development, I build modern applications and I’m now exploring AI integration to create smarter and more useful solutions.",
    viewWork: 'View My Work',
    downloadCV: 'Download CV',
    skillsTitle: 'Skills',
    skillsSubtitle: 'What I work with, what I\'m learning.',
    projectsMain: 'Projects',
    projectsTitle: 'Personal projects',
    projectsSubtitle: 'A selection of my work, focused on AI.',
    demo: 'Demo',
    viewDetails: 'Details',
    totalProjects: 'projects total',
    noProjects: 'No projects yet.',
    loading: 'Loading projects...',
    academicTitle: 'Academic Projects',
    academicSubtitle: 'Projects completed during my studies.',
    readMore: 'View more',
    viewProject: 'View project',
    projectWord: 'Project',
    academicKind: 'Academic project',
    contactTitle: 'Get In Touch',
    contactSubtitle: 'A project, a question, an opportunity? Reach out.',
    contactHeading: "Let's Connect",
    contactText: "I'm always open to discussing new projects or opportunities.",
    openTo: 'Open to remote & on-site',
    responseTime: 'Usually replies within 24–48h',
    writeMe: 'Write me',
    copied: 'Email copied!',
    reachMe: 'Reach me',
    basedIn: 'Based in Tunis, Tunisia',
    cvTitle: 'Curriculum vitae',
    cvSoon: 'coming soon',
    cardTitle: 'My business card',
    cardHint: 'Click to flip the card',
    cardFront: 'Business card, front',
    cardBack: 'Business card, back',
    formTitle: 'Send me a message',
    formSub: 'Your message reaches me directly by email and I reply quickly.',
    formSubject: 'Subject (optional)',
    sendAnother: 'Send another message',
    location: 'Tunisia 🇹🇳',
    formName: 'Your Name',
    formEmail: 'Your Email',
    formMessage: 'Your Message',
    formSubmit: 'Send Message',
    formSending: 'Sending...',
    formSuccess: 'Thanks, your message has been sent!',
    formError: 'Something went wrong, please try again.',
    errName: 'Please enter your name (at least 2 characters).',
    errEmailEmpty: 'Please enter your email.',
    errEmail: 'Invalid email address (e.g. name@domain.com).',
    errMessage: 'Your message is too short (at least 10 characters).',
    footerTagline: 'Building exceptional digital experiences.',
    footerBio: 'Fullstack developer passionate about building functional, elegant web applications, with a growing interest in AI.',
    footerSocialTitle: 'Social',
    footerNavTitle: 'Quick links',
    footerContactTitle: 'Contact',
    rights: 'All rights reserved.',
  },
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CodeCardComponent, ExperienceComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  private apiUrl = API_URL;

  lang: Lang = 'fr';

  theme: 'dark' | 'light' = 'dark';

  // Bouton « retour en haut » : visible dès qu'on a un peu défilé, avec un anneau de progression
  showTop = false;
  scrollPct = 0;
  readonly ringLen = 2 * Math.PI * 26;

  @HostListener('window:scroll')
  onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollPct = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
    this.showTop = y > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
    try { sessionStorage.setItem('theme', this.theme); } catch {}
  }
  get t() {
    return TEXT[this.lang];
  }

  setLang(l: Lang) {
    this.lang = l;
    this.roleIndex = 0;
    this.charIndex = 0;
    this.deleting = false;
    clearTimeout(this.timer);
    this.type();
  }

  projects: Project[] = [];
  loadingProjects = true;

  readonly education = [
    {
      degree: { fr: "Cycle d'Ingénieur en Développement Web", en: 'Engineering Degree in Web Development' },
      school: { fr: "ESPRIT – École Supérieure Privée d'Ingénierie et de Technologies", en: 'ESPRIT – Private Higher School of Engineering and Technology' },
      place: { fr: 'El Ghazala, Tunisie', en: 'El Ghazala, Tunisia' },
      period: '2018 – 2023',
    },
    {
      degree: { fr: 'Diplôme du baccalauréat, section sciences expérimentales', en: 'Baccalaureate, Experimental Sciences' },
      school: { fr: 'Lycée Ennasr', en: 'Ennasr High School' },
      place: { fr: '', en: '' },
      period: '2016 – 2017',
    },
  ];
  byIndex(i: number) { return i; }

  get proProjects() {
    return this.projects.filter((p) => p.category !== 'academic');
  }

  // Période de chaque projet académique (le titre sert de clé)
  private readonly ACADEMIC_PERIODS: Record<string, { fr: string; en: string }> = {
    'Smart Delivery': { fr: 'Février 2021 – Juin 2021', en: 'February 2021 – June 2021' },
    'My School': { fr: 'Janvier 2020 – Juin 2020', en: 'January 2020 – June 2020' },
    Wapi: { fr: 'Janvier 2019 – Mai 2019', en: 'January 2019 – May 2019' },
  };

  periodOf(p: { title: string }): string {
    const x = this.ACADEMIC_PERIODS[p.title];
    return x ? x[this.lang] : '';
  }

  get academicProjects() {
    return this.projects.filter((p) => p.category === 'academic');
  }

  contactForm = { name: '', email: '', subject: '', message: '', website: '' };
  contactError = '';
  cardFlipped = false;
  copied = false;
  readonly cvLangs = ['fr', 'en'] as const;
  cvOk: Record<string, boolean> = { fr: true, en: true };
  contactStatus: 'idle' | 'sending' | 'sent' | 'error' = 'idle';

  photoOk = true;
  year = new Date().getFullYear();

  // Compétences regroupées par catégorie (onglets cliquables dans la section Compétences)
  activeGroup = 0;
  skillGroups: SkillGroup[] = [
    {
      label: { fr: 'Langages', en: 'Languages' },
      desc: { fr: 'Les langages dans lesquels je développe.', en: 'The languages I build with.' },
      items: [
        { name: 'JavaScript', icon: dev('javascript') },
        { name: 'TypeScript', icon: dev('typescript') },
        { name: 'C#', icon: dev('csharp') },
        { name: 'Java', icon: dev('java') },
        { name: 'Python', icon: dev('python'), note: { fr: 'en apprentissage', en: 'learning' } },
      ],
    },
    {
      label: { fr: 'Frameworks', en: 'Frameworks' },
      desc: { fr: 'Les frameworks que j\'utilise pour construire mes applications.', en: 'The frameworks I use to build my applications.' },
      items: [
        { name: 'Angular', icon: dev('angular') },
        { name: 'Node.js', icon: dev('nodejs') },
        { name: 'Express', icon: dev('express'), light: true },
        { name: '.NET Core', icon: dev('dotnetcore') },
      ],
    },
    {
      label: { fr: 'Bases de données', en: 'Databases' },
      desc: { fr: 'Relationnel ou NoSQL : stocker et structurer les données.', en: 'Relational or NoSQL: storing and structuring data.' },
      items: [
        { name: 'MySQL', icon: dev('mysql') },
        { name: 'MongoDB', icon: dev('mongodb') },
        { name: 'SQL Server', icon: dev('microsoftsqlserver', 'plain') },
      ],
    },
    {
      label: { fr: 'Outils & environnements', en: 'Tools & environments' },
      desc: { fr: 'Versionner, tester les API et conteneuriser.', en: 'Versioning, testing APIs and containerizing.' },
      items: [
        { name: 'Git', icon: dev('git') },
        { name: 'GitHub', icon: dev('github'), light: true },
        { name: 'Postman', icon: dev('postman') },
        { name: 'Docker', icon: dev('docker') },
      ],
    },
    {
      label: { fr: 'Tests', en: 'Testing' },
      desc: { fr: 'Un code fiable, vérifié à chaque étape.', en: 'Reliable code, verified at every step.' },
      items: [
        { name: 'Tests unitaires', en: 'Unit tests', icon: '🧪' },
        { name: 'Tests end-to-end', en: 'End-to-end tests', icon: '🎯' },
        { name: 'Taux de couverture de code', en: 'Code coverage', icon: '📊' },
      ],
    },
    {
      label: { fr: 'Méthodologies & DevOps', en: 'Methodologies & DevOps' },
      desc: { fr: 'Une façon de travailler en équipe, du sprint à la mise en production.', en: 'A way of working as a team, from sprint to production.' },
      items: [
        { name: 'Agile / Scrum', icon: '🔄' },
        { name: 'DevOps', icon: '♾️' },
        { name: 'CI/CD', icon: '🚀' },
      ],
    },
  ];

  // Sélection utilisée pour l'orbite autour de la photo : 4 icônes sur le cercle
  // intérieur, 4 sur le cercle extérieur (positions pos-1 à pos-8 en CSS).
  orbitSkills: Skill[] = [
    { name: 'Angular', icon: dev('angular') },
    { name: 'TypeScript', icon: dev('typescript') },
    { name: 'MongoDB', icon: dev('mongodb') },
    { name: 'SQL Server', icon: dev('microsoftsqlserver', 'plain') },
    { name: 'Node.js', icon: dev('nodejs') },
    { name: 'Express', icon: dev('express'), light: true },
    { name: '.NET Core', icon: dev('dotnetcore') },
    { name: 'IA / OpenAI', icon: '🤖' },
  ];

  typedRole = '';
  private roleIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private timer: any;

  // --- Chiffres de la section À propos (calculés par le backend : /api/stats) ---
  // TODO : valeurs fixes pour l'instant. Pour les calculer côté serveur plus tard,
  // passer USE_BACKEND_STATS à true (la route /api/stats existe déjà dans le backend).
  private readonly USE_BACKEND_STATS = false;
  stats: { years: number; products: number; clients: number } | null = { years: 2, products: 7, clients: 4 };
  shown = { years: 0, products: 0, clients: 0 };
  private statsStarted = false;
  private aboutVisible = false;
  private observer?: IntersectionObserver;

  @ViewChild('frame') frameRef?: ElementRef<HTMLElement>;

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    const target = document.getElementById('apropos');
    if (target && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            this.aboutVisible = true;
            this.startCounters();
            this.observer?.disconnect();
          }
        },
        { threshold: 0.25 }
      );
      this.observer.observe(target);
    } else {
      this.aboutVisible = true;
    }
  }

  // Compte de 0 jusqu'à la vraie valeur, une seule fois, quand la section apparaît
  private startCounters() {
    if (this.statsStarted || !this.stats || !this.aboutVisible) return;
    this.statsStarted = true;
    const target = this.stats;
    const duration = 1400;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      this.shown = {
        years: Math.round(target.years * e),
        products: Math.round(target.products * e),
        clients: Math.round(target.clients * e),
      };
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Petit effet de profondeur : les cadres de la photo suivent le curseur
  onPhotoMove(ev: MouseEvent) {
    const frame = this.frameRef?.nativeElement;
    if (!frame) return;
    const r = frame.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((ev.clientX - r.left) / r.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((ev.clientY - r.top) / r.height - 0.5) * 2));
    frame.classList.add('tilting');
    frame.style.setProperty('--rx', x.toFixed(3));
    frame.style.setProperty('--ry', y.toFixed(3));
  }

  // Curseur sorti de la photo : tout revient à la position normale
  onPhotoLeave() {
    const frame = this.frameRef?.nativeElement;
    if (!frame) return;
    frame.classList.remove('tilting');
    frame.style.setProperty('--rx', '0');
    frame.style.setProperty('--ry', '0');
  }

  ngOnInit() {
    this.checkCv();
    this.theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    this.type();

    if (this.USE_BACKEND_STATS) {
      this.http.get<{ years: number; products: number; clients: number }>(`${this.apiUrl}/stats`).subscribe({
        next: (data) => {
          this.stats = data;
          this.statsStarted = false;
          this.startCounters();
        },
        error: () => {},
      });
    }

    // En local : API Node/SQL. En ligne (ou si l'API ne répond pas) : fichier statique assets/projects.json.
    const fromFile = () =>
      this.http.get<Project[]>('assets/projects.json').subscribe({
        next: (data) => {
          this.projects = data;
          this.loadingProjects = false;
        },
        error: () => {
          this.loadingProjects = false;
        },
      });

    if (!IS_LOCAL) {
      fromFile();
    } else {
      this.http.get<Project[]>(`${this.apiUrl}/projects`).subscribe({
        next: (data) => {
          this.projects = data;
          this.loadingProjects = false;
        },
        error: () => fromFile(),
      });
    }
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
    this.observer?.disconnect();
  }

  private type() {
    const roles = this.t.roles as string[];
    const full = roles[this.roleIndex];
    this.typedRole = full.substring(0, this.charIndex);
    let delay = this.deleting ? 40 : 80;

    if (!this.deleting && this.charIndex === full.length) {
      this.deleting = true;
      delay = 1600;
    } else if (this.deleting && this.charIndex === 0) {
      this.deleting = false;
      this.roleIndex = (this.roleIndex + 1) % roles.length;
      delay = 400;
    } else {
      this.charIndex += this.deleting ? -1 : 1;
    }

    this.timer = setTimeout(() => this.type(), delay);
  }

  hideImg(event: Event) {
    (event.target as HTMLElement).style.display = 'none';
  }

  touched: Record<string, boolean> = {};
  submitted = false;

  touch(f: string) { this.touched[f] = true; }

  fieldError(f: 'name' | 'email' | 'message'): string {
    if (!this.submitted && !this.touched[f]) return '';
    const v = (this.contactForm[f] || '').trim();
    if (f === 'name') return v.length < 2 ? this.t.errName : '';
    if (f === 'email') {
      if (!v) return this.t.errEmailEmpty;
      return /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/.test(v) && !v.includes('..') ? '' : this.t.errEmail;
    }
    return v.length < 10 ? this.t.errMessage : '';
  }

  submitContact() {
    this.submitted = true;
    if (this.fieldError('name') || this.fieldError('email') || this.fieldError('message')) return;

    this.contactStatus = 'sending';
    this.contactError = '';
    const onSuccess = () => {
      this.contactStatus = 'sent';
      this.contactForm = { name: '', email: '', subject: '', message: '', website: '' };
      this.touched = {};
      this.submitted = false;
    };
    const onError = (msg = '') => {
      this.contactStatus = 'error';
      this.contactError = msg;
    };

    if (IS_LOCAL) {
      // En local : ton serveur Node envoie l'e-mail via Gmail (nodemailer).
      this.http.post(`${this.apiUrl}/contact`, this.contactForm).subscribe({
        next: onSuccess,
        error: (err) => onError(err?.error?.error || ''),
      });
      return;
    }

    // En ligne : Web3Forms envoie le message sur ta boîte mail (sans serveur).
    if (this.contactForm.website) { onSuccess(); return; } // piège anti-robots
    if (!WEB3FORMS_KEY || WEB3FORMS_KEY.startsWith('COLLE_')) {
      onError('Formulaire non configuré (clé Web3Forms manquante).');
      return;
    }
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        name: this.contactForm.name,
        email: this.contactForm.email,
        subject: this.contactForm.subject || 'Nouveau message depuis le portfolio',
        message: this.contactForm.message,
        from_name: 'Portfolio Eya Ksouri',
      }),
    })
      .then((r) => r.json())
      .then((d) => (d && d.success ? onSuccess() : onError(d?.message || '')))
      .catch(() => onError());
  }

  copyEmail() {
    const email = 'ksourieya01@gmail.com';
    const done = () => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2200);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(done, done);
    } else {
      done();
    }
  }

  /** Désactive les boutons CV si le fichier PDF n'est pas encore dans src/assets. */
  private checkCv() {
    for (const l of this.cvLangs) {
      fetch(`assets/CV_EyaKsouri_${l.toUpperCase()}.pdf`, { method: 'HEAD' })
        .then((r) => {
          this.cvOk[l] = r.ok && (r.headers.get('content-type') || '').includes('pdf');
        })
        .catch(() => (this.cvOk[l] = false));
    }
  }
}
