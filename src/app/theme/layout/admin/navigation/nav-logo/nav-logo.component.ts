import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-nav-logo',
  templateUrl: './nav-logo.component.html',
  styleUrls: ['./nav-logo.component.scss']
})
export class NavLogoComponent implements OnInit,AfterViewInit {
  @Input() navCollapsed: boolean;
  @Output() onNavCollapse = new EventEmitter();
  public windowWidth: number;

  constructor() {
    this.windowWidth = window.innerWidth;
  }

  ngOnInit() {
  }
  ngAfterViewInit(){
    setInterval(() => {
      if(this.windowWidth !== window.innerWidth){
        this.windowWidth = window.innerWidth;
        if(this.windowWidth >= 992){
          this.navCollapsed = !this.navCollapsed;
        } //else{
          // this.navCollapsed = true;
        // }
        this.onNavCollapse.emit();
      }
  },1000);
  }
  navCollapse() {
    if (this.windowWidth >= 992) {
      this.navCollapsed = !this.navCollapsed;
      this.onNavCollapse.emit();
    }
  }
}
