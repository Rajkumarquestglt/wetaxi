import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListDriverNotificationComponent } from './list-driver-notification/list-driver-notification.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ListNotificationComponent } from '../notification-logs/list-notification/list-notification.component';


const routes: Routes = [
  // {
  //   path: '',
  //   component: ListNotificationComponent,
  //   canActivate: [NgxPermissionsGuard],
  //   data: {
  //     permissions: {
  //       only: 'NOTIFICATION_LOGS'
  //     }
  //   }
  // },
  {
    path: 'list-driver-notification/:notificationList._id',
    component: ListDriverNotificationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'NOTIFY'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverNotificationRoutingModule { }
