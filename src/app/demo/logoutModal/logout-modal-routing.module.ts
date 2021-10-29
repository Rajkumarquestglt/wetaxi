import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { LogoutModalComponent } from './logoutModal.component';

const routes: Routes = [
  {
      path: '',
      component: LogoutModalComponent,
      canActivate: [NgxPermissionsGuard],
      data: { 
          permissions: {
              only: 'LOGOUT_MODAL'
          }
      }
  },
    
];
 


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogoutModalRoutingModule { }
