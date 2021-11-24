import { Component } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import firebase from "firebase/compat/app";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"],
})
export class NavBarComponent {
  appUser: firebase.User;

  constructor(private authService: AuthService) {
    this.authService.appUser$.subscribe((appUser) => (this.appUser = appUser));
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
