import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NgxPermissionsGuard } from 'ngx-permissions';
import { ListActionLogsComponent } from './list-action-log/list-action-log.component';
import { ViewActionLogsComponent } from './view-action-log/view-action-log.component';

const routes: Routes = [
  {
    path: '',
    component: ListActionLogsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'ACTION_LOGS'
      }
    }
  },
  {
    path: 'view-action-log/:driver._id',
    component: ViewActionLogsComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'ACTION_LOGS'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActionLogsRoutingModule { }
