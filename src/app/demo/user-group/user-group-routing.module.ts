import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NgxPermissionsGuard } from "ngx-permissions";
import { ListUserGroupComponent } from './list-user-group/list-user-group.component';
import { ViewUserGroupComponent } from './view-user-group/view-user-group.component';
import { AddUserGroupComponent } from './add-user-group/add-user-group.component';

const routes: Routes = [
  {
    path: "",
    component: ListUserGroupComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: "USER_MANAGEMENT"
      }
    }
  },
  {
    path: "add-user-group",
    component: AddUserGroupComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: "USER_MANAGEMENT"
      }
    }
  },
  {
    path: "view-user-group/:location_id",
    component: ViewUserGroupComponent,
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
export class UserGroupRoutingModule {}
