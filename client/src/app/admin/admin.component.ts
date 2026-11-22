import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics?: string[];
  fork: boolean;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  private apiUrl = 'http://localhost:4000/api';
  private githubUser = 'EyaKs98';

  adminKey = '';
  unlocked = false;
  loginError = '';

  projects: Project[] = [];
  messages: ContactMessage[] = [];

  newProject = { title: '', description: '', tags: '', githubUrl: '', imageUrl: '', demoUrl: '', category: 'pro' };

  repos: GithubRepo[] = [];
  loadingRepos = false;
  reposLoaded = false;
  reposError = '';

  constructor(private http: HttpClient) {}

  private headers() {
    return new HttpHeaders({ 'x-admin-key': this.adminKey });
  }

  unlock() {
    this.http.get<ContactMessage[]>(`${this.apiUrl}/contact`, { headers: this.headers() }).subscribe({
      next: (data) => {
        this.messages = data;
        this.unlocked = true;
        this.loginError = '';
        this.loadProjects();
      },
      error: () => {
        this.loginError = 'Mot de passe incorrect.';
      },
    });
  }

  loadProjects() {
    this.http.get<Project[]>(`${this.apiUrl}/projects`).subscribe((data) => (this.projects = data));
  }

  addProject() {
    const body = {
      ...this.newProject,
      tags: this.newProject.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    this.http.post<Project>(`${this.apiUrl}/projects`, body, { headers: this.headers() }).subscribe(() => {
      this.newProject = { title: '', description: '', tags: '', githubUrl: '', imageUrl: '', demoUrl: '', category: 'pro' };
      this.loadProjects();
    });
  }

  deleteProject(id: string) {
    this.http.delete(`${this.apiUrl}/projects/${id}`, { headers: this.headers() }).subscribe(() => {
      this.loadProjects();
    });
  }

  loadRepos() {
    this.loadingRepos = true;
    this.reposError = '';
    this.http
      .get<GithubRepo[]>(`https://api.github.com/users/${this.githubUser}/repos?sort=updated&per_page=50`)
      .subscribe({
        next: (data) => {
          this.repos = data.filter((r) => !r.fork);
          this.loadingRepos = false;
          this.reposLoaded = true;
        },
        error: () => {
          this.reposError = 'Impossible de contacter GitHub (connexion ou limite atteinte). Réessaie dans quelques minutes.';
          this.loadingRepos = false;
        },
      });
  }

  isAdded(repo: GithubRepo): boolean {
    return this.projects.some((p) => p.githubUrl.toLowerCase() === repo.html_url.toLowerCase());
  }

  useRepo(repo: GithubRepo) {
    const tags = [...(repo.topics ?? []), ...(repo.language ? [repo.language] : [])];
    this.newProject = {
      title: this.prettify(repo.name),
      description: repo.description ?? '',
      tags: [...new Set(tags)].join(', '),
      githubUrl: repo.html_url,
      imageUrl: '',
      demoUrl: '',
      category: 'pro',
    };
    document.getElementById('project-form')?.scrollIntoView({ behavior: 'smooth' });
  }

  private prettify(name: string): string {
    const s = name.replace(/[-_]+/g, ' ').trim();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
