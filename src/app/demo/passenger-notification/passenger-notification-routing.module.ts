import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListPassengerNotificationComponent } from './list-passenger-notification/list-passenger-notification.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ListNotificationComponent } from '../notification-logs/list-notification/list-notification.component';

const routes: Routes = [
 
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
  // {
  //   path: 'view-passenger-refferal-earnings/:passenger_id',
  //   component: ViewPassengerRefferalEarningsComponent,
  //   canActivate: [NgxPermissionsGuard],
  //    data: {
  //      permissions: {
  //        only: 'REFFERAL_EARNING'
  //      }
  //    }
  // },
  // {
  //   path: 'single-view-passenger-ride/:passenger_id',
  //   component: SingleViewPassengerRideComponent,
  //   canActivate: [NgxPermissionsGuard],
  //    data: {
  //      permissions: {
  //        only: 'RIDES_HISTORY'
  //      }
  //    }
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassengerNotificationRoutingModule { }
