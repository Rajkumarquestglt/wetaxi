import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ListPromotionCodeComponent } from './list-promotion-code/list-promotion-code.component';
import { AddPromotionCodeComponent } from './add-promotion-code/add-promotion-code.component';
import { ViewPromotionCodeComponent } from './view-promotion-code/view-promotion-code.component';

const routes: Routes = [
  {
      path: '',
      component: ListPromotionCodeComponent,
      canActivate: [NgxPermissionsGuard],
      data: { 
          permissions: {
              only: 'PROMOTION_CODE'
          }
      }
  },
  {
    path: 'add-promotion-code',
    component: AddPromotionCodeComponent,
    canActivate: [NgxPermissionsGuard],
     data: {
       permissions: {
         only: 'PROMOTION_CODE'
       }
     }
  },
  {
    path: 'view-promotion-code/:promotions?._id',
    component: ViewPromotionCodeComponent,
    canActivate: [NgxPermissionsGuard],
     data: {
       permissions: {
         only: 'PROMOTION_CODE'
       }
     }
  }
  
];
 


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionCodeRoutingModule { }
