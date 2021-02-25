import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  userIsAuthenticated: boolean = false
  private authSub: Subscription;
  constructor(private authService: AuthService) {

  }
  ngOnInit() {
    this.authSub = this.authService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated
    })
  }

  ngOnDestroy() {
    this.authSub.unsubscribe()
  }

  onLogout() {
    this.authService.logout()
  }
}
