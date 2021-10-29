// import { ViewVehicleOwnerComponent } from './view-vehicle-owner/view-vehicle-owner.component';
// import { AddVehicleOwnerComponent } from './add-vehicle-owner/add-vehicle-owner.component';
import { ListVehicleOwnerComponent } from './list-vehicle-owner/list-vehicle-owner.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { VehicleOwnerComponent } from './vehicle-owner/vehicle-owner.component';


const routes: Routes = [
  {
    path: '',
    component: ListVehicleOwnerComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'VEHILCE_OWNER'
      }
    }
  },
  {
    path: 'add-vehicle-owner',
    component: VehicleOwnerComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'VEHILCE_OWNER'
      }
    }
  },
  {
    path: 'view-vehicle-owner/:vehicle_owner_id',
    component: VehicleOwnerComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'VEHILCE_OWNER'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleOwnerRoutingModule { }
