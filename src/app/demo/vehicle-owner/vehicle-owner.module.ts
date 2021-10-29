import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataTablesModule } from "angular-datatables";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "src/app/theme/shared/shared.module";
import { NgxLoadingModule } from "ngx-loading";
import { InputTrimModule } from "ng2-trim-directive";
import { NgbDatepickerModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
// import { ViewVehicleOwnerComponent } from "./view-vehicle-owner/view-vehicle-owner.component";
// import { AddVehicleOwnerComponent } from "./add-vehicle-owner/add-vehicle-owner.component";
import { ListVehicleOwnerComponent } from "./list-vehicle-owner/list-vehicle-owner.component";
import { SelectModule } from "ng-select";
import { VehicleOwnerRoutingModule } from "./vehicle-owner-routing.module";
import { VehicleOwnerComponent } from "./vehicle-owner/vehicle-owner.component";
// import { FileValidator } from '../helper/file-input.validator';

@NgModule({
  imports: [
    CommonModule,
    SelectModule,
    VehicleOwnerRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    // FileValidator,
    NgbDatepickerModule,
    NgbModule,
    NgxLoadingModule.forRoot({}),
    InputTrimModule,
  ],
  declarations: [
    ListVehicleOwnerComponent,
    // AddVehicleOwnerComponent,
    VehicleOwnerComponent,
    // ViewVehicleOwnerComponent,
  ],
})
export class VehicleOwnerModule {}
