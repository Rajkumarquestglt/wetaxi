import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NgxPermissionsGuard } from "ngx-permissions";
import { ListDriverLocationComponent } from "./list-driver-location/list-driver-location.component";
import { ViewDriverLocationComponent } from "./view-driver-location/view-driver-location.component";

const routes: Routes = [
  {
    path: "",
    component: ListDriverLocationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: "LOCATION"
      }
    }
  },
  {
    path: "view-driver-location/:location._id",
    component: ViewDriverLocationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: "LOCATION"
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverLocationRoutingModule {}
