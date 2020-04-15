import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../core/auth.service';
import { ParametroNavegacionService } from '../../../core/services/parametro-navegacion.service';

@Component({
  selector: 's-idleTimeout',
  templateUrl: './idle-timeout.component.html',
  styleUrls: ['./idle-timeout.component.scss']
})
export class IdleTimeoutComponent implements OnInit {

  @ViewChild('divBar', { static: false }) divBar: HTMLDivElement;

  timeoutID;
  intervalID;
  timeOut = 300_000;

  countDown = 0;

  expired: boolean = false;
  visibleBtn: boolean = false;

  constructor(
    private authService: AuthService,
    private navService: ParametroNavegacionService
  ) { }

  ngOnInit() {
    window.addEventListener('mousemove', this.resetTimer.bind(this));
    window.addEventListener('keypress', this.resetTimer.bind(this));
    this.startTimer();
  }

  resetTimer() {
    if (!this.visibleBtn) {
      window.clearTimeout(this.timeoutID);
      this.goActive();
    }
  }

  startTimer() {
    this.timeoutID = window.setTimeout(() => { this.goInactive() }, this.timeOut);
  }

  goInactive() {
    this.expired = true;
    this.intervalID = setInterval(() => this.countInterval(), 50);
  }

  countInterval() {
    this.countDown += 1;
    this.divBar['nativeElement'].style.width = this.countDown + '%';
    if (this.countDown >= 100) {
      this.countDown = 100;
      clearInterval(this.intervalID);
      this.authService.logout().then(
        resp => {
          this.visibleBtn = true;
        }
      );
    }
  }

  goActive() {
    if (this.expired == true) {
      this.expired = false;
      clearInterval(this.intervalID);
      this.countDown = 0;
    }
    this.startTimer();
  }

  redireccionar(){
    this.navService.redirect('/login');
  }

}
