import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NgxPermissionsGuard } from 'ngx-permissions';
import { VehicleComponent } from 'src/app/vehicleOwners/vehicleOwnerManagement/vehicle/vehicle.component';
// import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { DetailVehicleComponent } from './detail-vehicle/detail-vehicle.component';
import { ListVehicleComponent } from './list-vehicle/list-vehicle.component';
// import { ViewVehicleComponent } from './view-vehicle/view-vehicle.component';

const routes: Routes = [
  {
    path: '',
    component: ListVehicleComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'VEHICLE_OWNER_MANAGEMENT'
      }
    }
  },
  {
    path: 'add-vehicle',
    component: VehicleComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'VEHICLE_OWNER_MANAGEMENT'
      }
    }
  },
  {
    path: 'view-vehicle/:vehicle_id',
    component: VehicleComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'VEHICLE_OWNER_MANAGEMENT'
      }
    }
  },
  {
    path: 'detail-vehicle/:vehicle_id',
    component: DetailVehicleComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'VEHICLE_OWNER_MANAGEMENT'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleRoutingModule { }
