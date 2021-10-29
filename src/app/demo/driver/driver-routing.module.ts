import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListDriverComponent } from './list-driver/list-driver.component';
// import { AddDriverComponent } from './add-driver/add-driver.component';
// import { ViewDriverComponent } from './view-driver/view-driver.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DetailDriverComponent } from './detail-driver/detail-driver.component';
import { DriverModificationComponent } from './drivermodification/drivermodification.component';


const routes: Routes = [
  {
    path: '',
    component: ListDriverComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'DRIVER'
      }
    }
  },
  {
    path: 'add-driver',
    component: DriverModificationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'DRIVER'
      }
    }
  },
  {
    path: 'view-driver/:driver_id',
    component: DriverModificationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'DRIVER'
      }
    }
  },
  {
    path: 'detail-driver/:driver_id',
    component: DetailDriverComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'DRIVER'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule { }
