import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListBillingplanComponent } from './list-billing-plan/list-billing-plan.component';
import { ViewBillingplanComponent } from './view-billing-plan/view-billing-plan.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AddBillingPlanComponent } from './add-billing-plan/add-billing-plan.component';

const routes: Routes = [
  { 
    path: '',
    component: ListBillingplanComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'BILLING_PLANS'
      }
    }
  },
  {
    path: 'add-billing-plan',
    component: AddBillingPlanComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'BILLING_PLANS'
      }
    }
  },
  
  {
    path: 'view-billing-plan/:billing_plan_id',
    component: ViewBillingplanComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'BILLING_PLANS'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingplanRoutingModule { }
