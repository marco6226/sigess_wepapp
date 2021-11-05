import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
    datourl= '/app/home'

    constructor(private authService: AuthService, private router: Router, private activateRoute: ActivatedRoute) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let url: string = state.url;
        /*console.log(url)
        
        let xd = url.slice(0,42);
        console.log(xd)
        if(xd == "/app/inspecciones/elaboracionInspecciones/"){
            this.authService.redirectUrl = url;
            return true;
        }
        else{
            return this.checkLogin(url);
        }*/
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {
        if (this.authService.isLoggedIn()) return true;

        localStorage.setItem('url', url);
        // Store the attempted URL for redirecting
        this.authService.redirectUrl = url;
        // Navigate to the login page with extras
        //this.router.navigateByUrl('/app/sec/tarea/' + 1);
        this.datourl = url
        this.router.navigate(['/login']);
        return false;
    }

    
    Geturl (){        
        return this.datourl;
    }

    Seturl(url: string){        
        this.datourl = url;
    }

}
