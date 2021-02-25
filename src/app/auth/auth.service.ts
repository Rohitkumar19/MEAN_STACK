import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + '/user'

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  private token: string;
  isAuthneticated: boolean = false;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new BehaviorSubject<boolean>(false);

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }
    this.http.post(BACKEND_URL + "/signup", authData)
      .subscribe((result) => {
        this.router.navigate(["/auth/login"])
      }, (err) => {
        this.authStatusListener.next(false)
      })
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }
    this.http.post<{ token: string, expiresIn: number, userId: string }>(BACKEND_URL + "/login", authData)
      .subscribe((result) => {
        this.token = result.token;
        if (this.token) {
          const expiresInDuration = result.expiresIn;
          this.userId = result.userId;
          this.setAuthTimer(expiresInDuration)
          this.authStatusListener.next(true);
          this.isAuthneticated = true;
          const now = new Date()
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
          this.saveAuthData(result.token, expirationDate, result.userId)
          this.router.navigate(["/"])
        }
      }, (err) => {
        this.authStatusListener.next(false)
      })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      const now = new Date();
      const expirenIn = authInformation.expirationDate.getTime() - now.getTime();
      console.log("Expires In", expirenIn);
      if (expirenIn > 0) {
        this.token = authInformation.token;
        this.isAuthneticated = true;
        this.userId = authInformation.userId
        this.authStatusListener.next(true);
        this.setAuthTimer(expirenIn / 1000)
      }
    }
  }

  private setAuthTimer(duration: number) {
    console.log("Timer" + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000)
  }

  getIsAuth() {
    return this.isAuthneticated
  }

  getToken() {
    return this.token
  }

  logout() {
    this.token = null;
    this.isAuthneticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(["/"]);
  }

  private saveAuthData(token: string, expirationDate: Date, userId) {
    localStorage.setItem("token", token)
    localStorage.setItem("expiration", expirationDate.toISOString())
    localStorage.setItem("userId", userId)
  }

  private clearAuthData() {
    localStorage.clear();
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId")
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  getUserId() {
    return this.userId
  }

}
