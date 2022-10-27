import { Component, ElementRef } from '@angular/core';
import { environment } from './../environments/environment'

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet>'
})
export class AppComponent {
    title = 'app works!';

    constructor(private _elementRef: ElementRef) {
        //console.log("Production: " + environment.production);
    }

    ngOnInit(): void {
        this._elementRef.nativeElement.removeAttribute("ng-version");
    }
}
