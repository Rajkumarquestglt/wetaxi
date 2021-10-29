import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NgxPermissionsGuard } from 'ngx-permissions';
// import { NotificationLogsComponent } from './notification-logs.component';
// import { AddNotificationComponent } from './add-notification/add-notification.component';
// import { ViewNotificationComponent } from './view-notification/view-notification.component';
import { ListNotificationComponent } from './list-notification/list-notification.component';
import { ListDriverNotificationComponent } from '../driver-notification/list-driver-notification/list-driver-notification.component';
import { ListPassengerNotificationComponent } from '../passenger-notification/list-passenger-notification/list-passenger-notification.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  // {
  //   path: 'list-notification-log',
  //   component: NotificationLogsComponent,
  //   canActivate: [NgxPermissionsGuard],
  //   data: {
  //     permissions: {
  //       only: 'NOTIFICATION_LOGS'
  //     }
  //   }
  // },
  {
    path: '',
    component: ListNotificationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'NOTIFICATION_LOGS'
      }
    }
  },
  {
    path: 'view-notification/:notificationDetails._id',
    component: NotificationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'NOTIFICATION_LOGS'
      }
    }
  },
  {
    path: 'add-notification',
    component: NotificationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'NOTIFICATION_LOGS'
      }
    }
  },
  {
    path: 'list-driver-notification/:notificationList._id',
    component: ListDriverNotificationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'NOTIFY'
      }
    }
  },
  {
    path: 'list-passenger-notification/:notificationList._id',
    component: ListPassengerNotificationComponent,
    canActivate: [NgxPermissionsGuard],
     data: {
       permissions: {
         only: 'NOTIFY'
       }
     }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationLogsRoutingModule { }
