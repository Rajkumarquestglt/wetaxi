import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NgxPermissionsGuard } from "ngx-permissions";
import { ListPassengerLocationComponent } from "./list-passenger-location/list-passenger-location.component";
import { ViewPassengerLocationComponent } from "./view-passenger-location/view-passenger-location.component";

const routes: Routes = [
  {
    path: "",
    component: ListPassengerLocationComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: "LOCATION"
      }
    }
  },
  {
    path: "view-passenger-location/:passengerLocation._id",
    component: ViewPassengerLocationComponent,
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
export class PassengerLocationRoutingModule {}
