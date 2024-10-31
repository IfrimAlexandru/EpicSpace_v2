import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ScelteUtenteService } from 'src/app/service/scelte-utente.service';
import { AuthService } from 'src/app/service/auth.service';
import { User } from 'src/app/interface/user.interface';

@Component({
  selector: 'app-area-personale',
  templateUrl: './area-personale.component.html',
  styleUrls: ['./area-personale.component.scss']
})
export class AreaPersonaleComponent implements OnInit {
  user: User | null = null;
  bookedTrips: any[] = [];
  selectedAvatarFile: File | null = null;

  @ViewChild('avatarUpload') avatarUpload!: ElementRef;

  constructor(
    private authService: AuthService,
    private scelteUtenteService: ScelteUtenteService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadBookedTrips();
  }

  loadUserData(): void {
    this.user = this.authService.getUserFromLocalStorage();
    if (this.user && this.user.email) {
      this.loadBookedTrips();
    }
  }

  loadBookedTrips(): void {
    if (this.user && this.user.email) {
      this.scelteUtenteService.getBookedTrips(this.user.email).subscribe(trips => {
        this.bookedTrips = trips;
      }, error => {
        console.error('Error loading booked trips', error);
      });
    }
  }

  onAvatarSelected(event: any): void {
    this.selectedAvatarFile = event.target.files[0];
  }

  uploadAvatar(): void {
    if (!this.selectedAvatarFile || !this.user || !this.user.idUtente) return;

    this.authService.uploadAvatar(this.user.idUtente, this.selectedAvatarFile).subscribe(response => {
      if (this.user) {
        this.user.avatar = response.url;
        this.authService.updateUser(this.user);
      }
      this.selectedAvatarFile = null;
      if (this.avatarUpload) {
        this.avatarUpload.nativeElement.value = '';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
