import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ListRewardComponent } from './list-reward/list-reward.component';
import { ViewRewardComponent } from './view-reward/view-reward.component';
import { AddRewardComponent } from './add-reward/add-reward.component';


const routes: Routes = [

  {
    path: '',
    component: ListRewardComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'REWARD'
      }
    }
  },
  {
    path: 'view-reward/:notificationDetails._id',
    component: ViewRewardComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'REWARD'
      }
    }
  },
  {
    path: 'add-reward',
    component: AddRewardComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'REWARD'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RewardRoutingModule { }
