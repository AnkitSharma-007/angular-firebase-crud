import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  user,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  appUser$: Observable<User | null> = user(this.auth);

  /**
   * Initiates the login process using Google authentication.
   *
   * @returns {void}
   */
  login(): void {
    signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  /**
   * Logs out the current user by signing them out of the authentication service.
   * After signing out, navigates the user to the home page.
   *
   * @returns {void}
   */
  logout(): void {
    signOut(this.auth).then(() => {
      this.router.navigate(['/']);
    });
  }
}
