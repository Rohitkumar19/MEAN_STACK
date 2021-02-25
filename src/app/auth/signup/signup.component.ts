import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})

export class SignupComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private authSub: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isLoading = false;
      });
  }

  onSignup(form: NgForm) {
    if (form.valid) {
      this.isLoading = true;
      this.authService.createUser(form.value.email, form.value.password);
    }
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
