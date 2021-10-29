import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { CallCenterComponent } from './call-center.component';


const routes: Routes = [
    {
        path: '',
        component: CallCenterComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: 'CALL_CENTER'
            }
        }
    }
];


 
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CallCenterRoutingModule { }
