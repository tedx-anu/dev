import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { FsService } from '../../fs.service';
import { GlobalConstants } from '../../global.constants';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dash Board',  icon: 'dashboard', class: '' },
    { path: '/xerox-reading', title: 'Xerox Reading',  icon:'timer', class: '' },
    { path: '/card-models', title: 'Card Models',  icon:'store', class: '' },
    { path: '/orders', title: 'Orders',  icon:'shopping_cart', class: '' },
    { path: '/agent-portal', title: 'LIC Agent Portal',  icon:'person', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  notifications = [];
  noOfNotifications = 0;
  user:any = {};
  constructor(private af : AngularFireAuth,  private fs: FsService, private gc : GlobalConstants) { 
    this.af.authState.subscribe(user => {
        if(user)
        this.getUserDetails(user.uid);
      })
  }

  getUserDetails(id) {
    this.fs.getUser(id)
      .subscribe(data => {
        this.user = data;
        if(data.profilePic != null && data.profilePic != undefined && data.profilePic.length > 0){
            this.user.profilePic = data.profilePic;
        }else{
            this.user.profilePic = "./assets/img/faces/no-pic.png";
        }
      });
  }

 ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.getNotifications();
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  getNotifications(){
    this.fs.getNotifications()
      .subscribe(data => {
        this.notifications = data;
        for(let item of this.notifications){
            if(item.show == true){
                this.noOfNotifications = this.noOfNotifications + 1;
            }
        }
      });
}

onClickNotifications(){
    this.fs.setNotifyFalse()
    .subscribe(
      (success) => {
        this.noOfNotifications = 0;
      });
}
}
