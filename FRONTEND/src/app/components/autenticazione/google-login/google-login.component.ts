import { Component, EventEmitter, Output } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment.development';

declare global {
  interface Window {
      google: any;
  }
}


@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss']
})

export class GoogleLoginComponent implements AfterViewInit {

  constructor(private authSrv: AuthService) {}

  ngAfterViewInit(): void {
    this.loadGoogleScript().then(() => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: environment.clientIdGoogle,
          callback: this.handleCredentialResponse.bind(this)
        });

        const buttonDiv = document.getElementById('buttonDiv');
        if (buttonDiv) {
          window.google.accounts.id.renderButton(
            buttonDiv,
            {
              theme: 'filled_blue',
              size: 'medium',
            }
          );
          window.google.accounts.id.prompt(); // mostra il dialogo One Tap
        } else {
          console.error('Elemento buttonDiv non trovato');
        }
      }
    }).catch((error) => {
      console.error('Errore nel caricamento dell\'API di Google:', error);
    });
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }

  handleCredentialResponse(response: any) {
    if (response && response.credential) {
      console.log('Encoded JWT ID token: ' + response.credential);
      this.sendTokenToBackend(response.credential);
    } else {
      console.error('Credenziali non valide', response);
    }
  }

  sendTokenToBackend(token: string): void {
    this.authSrv.loginGoogle({ token }).subscribe();
  }}
// export class GoogleLoginComponent implements OnInit {
  
// constructor(private authSrv:AuthService ) { }

// ngOnInit(): void {
//   // window.onload = () => {
//     google.accounts.id.initialize({
//       client_id: '722812885951-dvlljpp34qhkm2mgd0vifbtncgh4b7sk.apps.googleusercontent.com',
//       callback: this.handleCredentialResponse.bind(this)
//     });
//     const buttonDiv = document.getElementById('buttonDiv');
//     if (buttonDiv) {
//       google.accounts.id.renderButton(
//         buttonDiv,
//         { theme: 'outline', size: 'large' }  
//       );
//       google.accounts.id.prompt(); 
//     } else {
//       console.error('Elemento buttonDiv non trovato');
//     }
//   // }
// }


// handleCredentialResponse(response: any) {
//   if (response && response.credential) {
//     console.log('Encoded JWT ID token: ' + response.credential);
//     this.sendTokenToBackend(response.credential);
//   } else {
//     console.error('Credenziali non valide', response);
//   }
// }

// sendTokenToBackend(token: string): void {
//   this.authSrv.loginGoogle({token}).subscribe();
// }
// }