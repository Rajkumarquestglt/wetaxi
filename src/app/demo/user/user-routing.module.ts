import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NgxPermissionsGuard } from "ngx-permissions";
import { ListUserComponent } from './list-user/list-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { AddUserComponent } from './add-user/add-user.component';


const routes: Routes = [
  {
    path: "",
    component: ListUserComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: "USER_MANAGEMENT"
      }
    }
  },
  {
    path: "add-user",
    component: AddUserComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: "USER_MANAGEMENT"
      }
    }
  },
  {
    path: "view-user/:user_id",
    component: ViewUserComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: "USER_MANAGEMENT"
      }
    }
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
