import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-tute',
  templateUrl: './admin-tute.component.html',
  styleUrls: ['./admin-tute.component.scss']
})
export class AdminTuteComponent implements OnInit {
  tute: any[] = [];
  newTuta: any = { nome: '', descrizione: '', immagineFronte: '', immagineRetro: '' };
  selectedFronteFile: File | null = null;
  selectedRetroFile: File | null = null;
  selectedFronteFileUpdate: { [key: number]: File | null } = {};
  selectedRetroFileUpdate: { [key: number]: File | null } = {};
  fronteImagePreview: { [key: number]: string | ArrayBuffer | null } = {};
  retroImagePreview: { [key: number]: string | ArrayBuffer | null } = {};

  @ViewChild('fronteFileInput') fronteFileInput!: ElementRef;
  @ViewChild('retroFileInput') retroFileInput!: ElementRef;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTute();
  }

  loadTute(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>(`${environment.apiUrl}tute_spaziali`, { headers }).subscribe(data => {
      this.tute = data;
    });
  }

  onFronteFileSelected(event: any): void {
    this.selectedFronteFile = event.target.files[0];
    console.log('Selected front file:', this.selectedFronteFile); // Log file for debugging
  }

  onRetroFileSelected(event: any): void {
    this.selectedRetroFile = event.target.files[0];
    console.log('Selected back file:', this.selectedRetroFile); // Log file for debugging
  }

  onFronteFileUpdateSelected(event: any, tutaId: number): void {
    const file = event.target.files[0];
    this.selectedFronteFileUpdate[tutaId] = file;
    console.log(`Selected front file for update (ID: ${tutaId}):`, file); // Log file for debugging

    // Generate a preview of the selected image
    const reader = new FileReader();
    reader.onload = () => {
      this.fronteImagePreview[tutaId] = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onRetroFileUpdateSelected(event: any, tutaId: number): void {
    const file = event.target.files[0];
    this.selectedRetroFileUpdate[tutaId] = file;
    console.log(`Selected back file for update (ID: ${tutaId}):`, file); // Log file for debugging

    // Generate a preview of the selected image
    const reader = new FileReader();
    reader.onload = () => {
      this.retroImagePreview[tutaId] = reader.result;
    };
    reader.readAsDataURL(file);
  }

  uploadFile(id: number, file: File, type: 'front' | 'back'): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    let url = '';
    if (type === 'front') {
      url = `${environment.apiUrl}api/uploadTutaSpazialeImageFront/${id}`;
    } else {
      url = `${environment.apiUrl}api/uploadTutaSpazialeImageBack/${id}`;
    }

    const headers = this.getAuthHeaders();
    console.log('Uploading file to:', url); // Log URL for debugging
    console.log('Headers:', headers); // Log headers for debugging

    return this.http.patch<{ url: string }>(url, formData, { headers });
  }

  async addTuta(): Promise<void> {
    const headers = this.getAuthHeaders();
    const newTuta = await this.http.post<any>(`${environment.apiUrl}tute_spaziali`, this.newTuta, { headers }).toPromise();
    console.log('New tuta created:', newTuta); // Log new tuta for debugging

    if (this.selectedFronteFile) {
      const immagineFronte = await this.uploadFile(newTuta.id, this.selectedFronteFile, 'front').toPromise();
      if (immagineFronte) {
        this.newTuta.immagineFronte = immagineFronte.url;
      }
    }

    if (this.selectedRetroFile) {
      const immagineRetro = await this.uploadFile(newTuta.id, this.selectedRetroFile, 'back').toPromise();
      if (immagineRetro) {
        this.newTuta.immagineRetro = immagineRetro.url;
      }
    }

    this.loadTute();
    this.resetForm();
  }

  async updateTuta(tuta: any): Promise<void> {
    const headers = this.getAuthHeaders();

    if (this.selectedFronteFileUpdate[tuta.id]) {
      const immagineFronte = await this.uploadFile(tuta.id, this.selectedFronteFileUpdate[tuta.id] as File, 'front').toPromise();
      if (immagineFronte) {
        tuta.immagineFronte = immagineFronte.url;
      }
    }

    if (this.selectedRetroFileUpdate[tuta.id]) {
      const immagineRetro = await this.uploadFile(tuta.id, this.selectedRetroFileUpdate[tuta.id] as File, 'back').toPromise();
      if (immagineRetro) {
        tuta.immagineRetro = immagineRetro.url;
      }
    }

    await this.http.patch(`${environment.apiUrl}tute_spaziali/${tuta.id}`, tuta, { headers }).toPromise();
    this.loadTute();
  }

  deleteTuta(id: number): void {
    const headers = this.getAuthHeaders();
    this.http.delete(`${environment.apiUrl}tute_spaziali/${id}`, { headers }).subscribe(() => {
      this.loadTute();
    });
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  resetForm(): void {
    this.newTuta = { nome: '', descrizione: '', immagineFronte: '', immagineRetro: '' };
    this.selectedFronteFile = null;
    this.selectedRetroFile = null;
    if (this.fronteFileInput) {
      this.fronteFileInput.nativeElement.value = '';
    }
    if (this.retroFileInput) {
      this.retroFileInput.nativeElement.value = '';
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
