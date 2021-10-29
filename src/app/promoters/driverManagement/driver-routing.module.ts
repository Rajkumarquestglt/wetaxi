import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListDriverComponent } from './list-driver/list-driver.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DetailDriverComponent } from './detail-driver/detail-driver.component';
import { DriverComponent } from './driver/driver.component';


const routes: Routes = [
  {
    path: '',
    component: ListDriverComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'DRIVER_MANAGEMENT_PROMOTER'
      }
    }
  },
  {
    path: 'add-driver',
    component: DriverComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'DRIVER_MANAGEMENT_PROMOTER'
      }
    }
  },
  {
    path: 'view-driver/:driver_id',
    component: DriverComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'DRIVER_MANAGEMENT_PROMOTER'
      }
    }
  },
  {
    path: 'detail-driver/:driver_id',
    component: DetailDriverComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'DRIVER_MANAGEMENT_PROMOTER'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
