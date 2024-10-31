import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-navicelle',
  templateUrl: './admin-navicelle.component.html',
  styleUrls: ['./admin-navicelle.component.scss']
})
export class AdminNavicelleComponent implements OnInit {
  navicelle: any[] = [];
  newNavicella: any = { nome: '', descrizione: '', immagineUrl: '' };
  selectedFile: File | null = null;
  selectedFileUpdate: { [key: number]: File | null } = {};
  imagePreview: { [key: number]: string | ArrayBuffer | null } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadNavicelle();
  }

  loadNavicelle(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>(`${environment.apiUrl}navi_spaziali`, { headers }).subscribe(data => {
      this.navicelle = data;
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    console.log('Selected file:', this.selectedFile); // Log file for debugging
  }

  onFileUpdateSelected(event: any, navicellaId: number): void {
    const file = event.target.files[0];
    this.selectedFileUpdate[navicellaId] = file;
    console.log(`Selected file for update (ID: ${navicellaId}):`, file); // Log file for debugging

    // Generate a preview of the selected image
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview[navicellaId] = reader.result;
    };
    reader.readAsDataURL(file);
  }

  uploadFile(id: number, file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${environment.apiUrl}api/uploadNaveSpazialeImage/${id}`;

    const headers = this.getAuthHeaders();
    console.log('Uploading file to:', url); // Log URL for debugging
    console.log('Headers:', headers); // Log headers for debugging

    return this.http.patch<{ url: string }>(url, formData, { headers });
  }

  async addNavicella(): Promise<void> {
    try {
      const headers = this.getAuthHeaders();
      const newNavicella = await this.http.post<any>(`${environment.apiUrl}navi_spaziali`, this.newNavicella, { headers }).toPromise();
      console.log('New navicella created:', newNavicella); // Log new navicella for debugging

      if (this.selectedFile) {
        const immagineUrl = await this.uploadFile(newNavicella.id, this.selectedFile).toPromise();
        if (immagineUrl) {
          console.log('Image uploaded, URL:', immagineUrl.url); // Log image URL for debugging
          this.newNavicella.immagine = immagineUrl.url;
          newNavicella.immagine = immagineUrl.url;
          await this.http.patch(`${environment.apiUrl}navi_spaziali/${newNavicella.id}`, newNavicella, { headers }).toPromise();
        } else {
          console.error('Image upload failed'); // Log error if image upload fails
        }
      } else {
        console.error('No file selected for upload'); // Log error if no file selected
      }

      this.loadNavicelle();
      this.newNavicella = { nome: '', descrizione: '', immagineUrl: '' };
      this.selectedFile = null;
    } catch (error) {
      console.error('Error adding navicella:', error); // Log any errors
    }
  }

  async updateNavicella(navicella: any): Promise<void> {
    try {
      const headers = this.getAuthHeaders();

      if (this.selectedFileUpdate[navicella.id]) {
        const immagineUrl = await this.uploadFile(navicella.id, this.selectedFileUpdate[navicella.id] as File).toPromise();
        if (immagineUrl) {
          console.log('Image uploaded for update, URL:', immagineUrl.url); // Log image URL for debugging
          navicella.immagine = immagineUrl.url;
        } else {
          console.error('Image upload for update failed'); // Log error if image upload fails
        }
      } else {
        console.error('No file selected for update upload'); // Log error if no file selected
      }

      await this.http.patch(`${environment.apiUrl}navi_spaziali/${navicella.id}`, navicella, { headers }).toPromise();
      this.loadNavicelle();
    } catch (error) {
      console.error('Error updating navicella:', error); // Log any errors
    }
  }

  deleteNavicella(id: number): void {
    const headers = this.getAuthHeaders();
    this.http.delete(`${environment.apiUrl}navi_spaziali/${id}`, { headers }).subscribe(() => {
      this.loadNavicelle();
    }, error => {
      console.error('Error deleting navicella:', error); // Log any errors
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
