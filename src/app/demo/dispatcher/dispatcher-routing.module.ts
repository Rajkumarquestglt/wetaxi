import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ReceivedComponent } from './received/received.component';
import { AcceptedComponent } from './accepted/accepted.component';
import { OnRideComponent } from './onRide/onRide.component';
import { SuccessfulComponent } from './successful/successful.component';
import { CancelComponent } from './cancel/cancel.component';


const routes: Routes = [
    
    {
        path: '',
        component: ReceivedComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: 'DISPATCHER'
            }
        }
    },
    {
        path: 'accepted',
        component: AcceptedComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: 'DISPATCHER'
            }
        }
    },
    {
        path: 'onRide',
        component: OnRideComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: 'DISPATCHER'
            }
        }
    },
    {
        path: 'successful',
        component: SuccessfulComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: 'DISPATCHER'
            }
        }
    },
    {
        path: 'cancel',
        component: CancelComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only: 'DISPATCHER'
            }
        }
    }
];


 
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DispatcherRoutingModule { }
