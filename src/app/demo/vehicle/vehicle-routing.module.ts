import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListVehicleComponent } from './list-vehicle/list-vehicle.component';
// import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
// import { ViewVehicleComponent } from './view-vehicle/view-vehicle.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { VehicleComponent } from './vehicle/vehicle.component';

const routes: Routes = [
  {
    path: '',
    component: ListVehicleComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'VEHICLE'
      }
    }
  },
  {
    path: 'add-vehicle',
    component: VehicleComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'VEHICLE'
      }
    }
  },
  {
    path: 'view-vehicle/:vehicle_id',
    component: VehicleComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'VEHICLE'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
