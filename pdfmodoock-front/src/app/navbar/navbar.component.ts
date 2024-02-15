import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { FormControl } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  username = new FormControl('');
  password = new FormControl('');
  first_name = new FormControl('');
  last_name = new FormControl('');
  hasToken: boolean = false;
  user: any = {};
  tokens: any = {};
  isCopied: boolean = false;
  constructor(
    private cookieService: CookieService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) { }
  ngOnInit() {
    this.hasToken = this.cookieService.check('jwt');
    if (this.hasToken) {
      const token = this.cookieService.get('jwt');
      this.http
        .get(
          `http://his.modoock.com/api/check-token-validity/${token}`
        )
        .subscribe((response: any) => {
          if (response.message.trim().toLowerCase() === 'not valid') {
            this.cookieService.delete('jwt');
            location.reload();
          } else {
            this.http
              .post(
                `http://his.modoock.com/api/user`,
                { 'jwt': token }
              )
              .subscribe((response: any) => {
                this.user = response;
                console.log(this.user);
              });
          }
        });
      this.cdr.detectChanges();
    }
  }

  onSubmit() {
    this.http
      .post('http://his.modoock.com/api/login', {
        username: this.username.value,
        password: this.password.value,
      })
      .subscribe((response: any) => {
        this.cookieService.set('jwt', response.jwt);
        location.reload();
      }, (error) => {
        Swal.fire('Error', 'An error occurred while registering', 'error');
      });
  }
  logout() {
    this.cookieService.delete('jwt');
    location.reload();
  }
}