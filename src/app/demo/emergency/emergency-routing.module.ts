import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListEmergencyComponent } from './list-emergency/list-emergency.component';
// import { AddEmergencyComponent } from './add-emergency/add-emergency.component';
// import { ViewEmergencyComponent } from './view-emergency/view-emergency.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { EmergencyComponent } from './emergency/emergency.component';

const routes: Routes = [
  {
    path: '',
    component: ListEmergencyComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'EMERGENCY'
      }
    }
  },
  {
    path: 'add-emergency',
    component: EmergencyComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'EMERGENCY'
      }
    }
  },
  {
    path: 'view-emergency/:emergency_id',
    component: EmergencyComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'EMERGENCY'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmergencyoutingModule { }
