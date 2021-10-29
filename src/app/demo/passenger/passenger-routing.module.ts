import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AddPassengerComponent } from './add-passenger/add-passenger.component';
import { ListPassengerComponent } from './list-passenger/list-passenger.component';
// import { ViewPassengerComponent } from './view-passenger/view-passenger.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DetailPassengerComponent } from './detail-passenger/detail-passenger.component';
import { PassengerComponent } from './passenger/passenger.component';

const routes: Routes = [
  {
    path: '',
    component: ListPassengerComponent,
    canActivate: [NgxPermissionsGuard],
     data: {
       permissions: {
         only: 'PASSENGER'
       }
     }
  },
  {
    path: 'add-passenger',
    component: PassengerComponent,
    canActivate: [NgxPermissionsGuard],
     data: {
       permissions: {
         only: 'PASSENGER'
       }
     }
  },
  {
    path: 'view-passenger/:passenger_id',
    component: PassengerComponent,
    canActivate: [NgxPermissionsGuard],
     data: {
       permissions: {
         only: 'PASSENGER'
       }
     }
  },
  {
    path: 'detail-passenger/:passenger_id',
    component: DetailPassengerComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'PASSENGER'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PassengerRoutingModule { }
