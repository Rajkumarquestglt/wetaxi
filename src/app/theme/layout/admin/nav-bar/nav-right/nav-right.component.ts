import { Component, ComponentFactoryResolver, DoCheck, OnInit, ViewContainerRef } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { animate, style, transition, trigger } from '@angular/animations';
import { DattaConfig } from '../../../../../app-config';
import { AuthService } from 'src/app/demo/services';
import { Router } from '@angular/router';
import { LogoutModalComponent } from 'src/app/demo/logoutModal/logoutModal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class NavRightComponent implements OnInit, DoCheck {

  public visibleUserList: boolean;
  public chatMessage: boolean;
  public friendId: boolean;
  public dattaConfig: any;
  public name: any;
  public operatorDisable = false;
  closesub!:Subscription;

  constructor(config: NgbDropdownConfig,
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver:ComponentFactoryResolver,
    public viewContainerRef:ViewContainerRef) {
    config.placement = 'bottom-right';
    this.visibleUserList = false;
    this.chatMessage = false;
    this.dattaConfig = DattaConfig.config;
  }

  ngOnInit() {
    let adminData = JSON.parse(localStorage.getItem('adminData'));
    this.name = adminData.first_name + ' ' + adminData.last_name;

    if (adminData.type == "vehicleOwner" && adminData.chnagePassordPer == true ) {
    this.name = adminData.name;
    this.operatorDisable = false;
    } else if (adminData.type == "admin") {
      this.name = "admin";
      this.operatorDisable = false;
    }else if(adminData.type == "promoter" && adminData.chnagePassordPer == true ){
      this.name = adminData.name;
      this.operatorDisable = false;
    } 
    else {
      this.operatorDisable = true;
    }
  }
test(){
  var answer = window.confirm("Are you want to Logout?")
    if (answer) {
      this.authService.doLogout();
      this.router.navigate(["/login"]);
    }
    else {
       console.log("cancle")
    }
}
  logout() { 
    // this.test();
    const logoutfactory = this.componentFactoryResolver.resolveComponentFactory(LogoutModalComponent);
    const hostViewContainerRef = this.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef =  hostViewContainerRef.createComponent(logoutfactory);
    this.closesub = componentRef.instance.close.subscribe(() => {
      this.closesub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  onChatToggle(friend_id) {
    this.friendId = friend_id;
    this.chatMessage = !this.chatMessage;
  }

  ngDoCheck() {
    if (document.querySelector('body').classList.contains('datta-rtl')) {
      this.dattaConfig['rtl-layout'] = true;
    } else {
      this.dattaConfig['rtl-layout'] = false;
    }
  }
}
