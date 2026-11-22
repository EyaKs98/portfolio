import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL, IS_LOCAL } from '../env';

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

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
})
export class ProjectDetailComponent implements OnInit {
  private apiUrl = API_URL;

  project: Project | null = null;
  loading = true;
  notFound = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const fromFile = () =>
      this.http.get<Project[]>('assets/projects.json').subscribe({
        next: (list) => {
          this.project = list.find((p) => String(p._id) === String(id)) || null;
          this.notFound = !this.project;
          this.loading = false;
        },
        error: () => {
          this.notFound = true;
          this.loading = false;
        },
      });

    if (!IS_LOCAL) {
      fromFile();
      return;
    }
    this.http.get<Project>(`${this.apiUrl}/projects/${id}`).subscribe({
      next: (data) => {
        this.project = data;
        this.loading = false;
      },
      error: () => fromFile(),
    });
  }
}
