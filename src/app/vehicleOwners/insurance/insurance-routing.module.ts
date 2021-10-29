import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NgxPermissionsGuard } from 'ngx-permissions';
import { ListInsuranceComponent } from './list-insurance/list-insurance.component';


const routes: Routes = [
  {
    path: '',
    component: ListInsuranceComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'INSURANCE'
      }
    }
  },
//   {
//     path: 'add-driver',
//     component: AddDriverComponent,
//     canActivate: [NgxPermissionsGuard],
//     data: {
//       permissions: {
//         only: 'DRIVER_MANAGEMENT_OWNER'
//       }
//     }
//   },
//   {
//     path: 'view-driver/:driver_id',
//     component: ViewDriverComponent,
//     canActivate: [NgxPermissionsGuard],
//     data: {
//       permissions: {
//         only: 'DRIVER_MANAGEMENT_OWNER'
//       }
//     }
//   },
//   {
//     path: 'detail-driver/:driver_id',
//     component: DetailDriverComponent,
//     canActivate: [NgxPermissionsGuard],
//     data: {
//       permissions: {
//         only: 'DRIVER_MANAGEMENT_OWNER'
//       }
//     }
//   }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule { }
