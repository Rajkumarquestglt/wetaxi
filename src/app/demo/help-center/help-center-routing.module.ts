import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListHelpcenterComponent } from './list-help-center/list-help-center.component';
// import { ViewHelpcenterComponent } from './view-help-center/view-help-center.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
// import { AddHelpCenterComponent } from './add-help-center/add-help-center.component';
import { HelpCenterComponent} from './help-center/help-center.component';
const routes: Routes = [
  {
    path: '',
    component: ListHelpcenterComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'HELP_CENTER'
      }
    }
  },
  {
    path: 'view-help-center/:help_center_id',
    component: HelpCenterComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'HELP_CENTER'
      }
    }
  },
  {
    path: 'add-help-center',
    component: HelpCenterComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: 'HELP_CENTER'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpcenterRoutingModule { }
