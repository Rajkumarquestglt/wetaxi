import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { RecycleBinComponent } from './recycle-bin.component';

const routes: Routes = [
  {
      path: '',
      component: RecycleBinComponent,
      canActivate: [NgxPermissionsGuard],
      data: { 
          permissions: {
              only: 'RECYCLE_BIN'
          }
      }
  }
];
 


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecycleBinRoutingModule { }
