import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FbAuthToken, User} from "../../../shared/interfaces";
import {environment} from "../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import {Subject, throwError} from "rxjs";

@Injectable({providedIn: "root"})
export class AuthService {
    public error$:Subject<string> = new Subject<string>()
    constructor(private http: HttpClient) {
    }

    get token(): string {
        const expDate = new Date(localStorage.getItem('fb-token-exp'))
        if (new Date() > expDate) {
            this.logout()
            return null
        }
        return localStorage.getItem('fb-token')
    }

    login(user: User) {
        user.returnSecureToken = true
        console.log(environment.apiKey)
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
            .pipe(
                tap(this.setToken),
                catchError(this.handleError.bind(this))
            )
    }

    logout() {
        this.setToken(null)
    }

    handleError(error: HttpErrorResponse) {
        const {message} = error.error.error
        switch (message) {
            case 'INVALID_PASSWORD':
                this.error$.next('invalid password')
                break
            case 'INVALID_EMAIL':
                this.error$.next('invalid email')
                break
            case 'EMAIL_NOT_FOUND':
                this.error$.next('email not found')
                break
        }
        console.log('MESS', message)
        return throwError(error)
    }

    isAuthenticated(): boolean {
        return !!this.token
    }

    private setToken(response: FbAuthToken | null) {
        if (response) {
            const expiresDate = new Date(new Date().getTime() + (+response.expiresIn * 1000))
            localStorage.setItem('fb-token', response.idToken)
            localStorage.setItem('fb-token-exp', expiresDate.toString())
        } else {
            localStorage.clear()
        }
    }

}
