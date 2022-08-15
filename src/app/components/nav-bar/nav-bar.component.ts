import { Component } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"],
})
export class NavBarComponent {
  appUser$ = this.authService.appUser$;

  constructor(private readonly authService: AuthService) {}

  userLogin() {
    this.authService.login();
  }

  userLogout() {
    this.authService.logout();
  }
}
