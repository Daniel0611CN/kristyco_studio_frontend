import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private http = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  resendConfirmationToken(username: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/confirmation_token/revalidate-token/${username}`, null, this.httpOptions);
  }

  confirmationToken(token: string): Observable<any> {
    return this.http.get<{ message: string }>(`${environment.apiUrl}/confirmation_token/confirm-register?token=${token}`);
  }

  requestResetPassword(email: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/confirmation_token/request-reset-password`, null, { params: { email: email } });
  }
  validateResetToken(token: string): Observable<any> {
    return this.http.get<{ message: string, valid: boolean }>(`${environment.apiUrl}/confirmation_token/validate-reset-token?token=${token}`);
  }

  resetPassword(token: string, password: string) {
    return this.http.put(`${environment.apiUrl}/confirmation_token/reset-password`, { token: token, password: password});
  }

}
