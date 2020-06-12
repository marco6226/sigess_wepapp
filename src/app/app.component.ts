import { Component } from '@angular/core';
import { environment } from './../environments/environment'

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  title = 'app works!';
  
  constructor(){
  	//console.log("Production: " + environment.production);
  }
}
