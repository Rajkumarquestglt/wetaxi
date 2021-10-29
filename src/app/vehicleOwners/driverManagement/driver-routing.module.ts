import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListDriverComponent } from './list-driver/list-driver.component';
import { ListDriverRequestComponent } from './driver-request/driver-request.component';
import { ViewDriverComponent } from './view-driver/view-driver.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DetailDriverComponent } from './detail-driver/detail-driver.component';


const routes: Routes = [
  {
    path: '',
    component: ListDriverComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'DRIVER_MANAGEMENT_OWNER'
      }
    }
  },
  {
    path: 'driver-request',
    component: ListDriverRequestComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'DRIVER_MANAGEMENT_OWNER'
      }
    }
  },
  {
    path: 'view-driver/:driver_id',
    component: ViewDriverComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'DRIVER_MANAGEMENT_OWNER'
      }
    }
  },
  {
    path: 'detail-driver/:driver_id',
    component: DetailDriverComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'DRIVER_MANAGEMENT_OWNER'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
