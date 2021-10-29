import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
import { InputTrimModule } from 'ng2-trim-directive';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { SelectModule } from 'ng-select';

import {  AgmCoreModule,GoogleMapsAPIWrapper} from '@agm/core';
import { AgmDirectionModule} from 'agm-direction';
import { FileValidator } from 'src/app/demo/helper/file-input.validator';
import { VehicleRoutingModule } from './vehicle-routing.module';
import { ListVehicleComponent } from './list-vehicle/list-vehicle.component';
// import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
// import { ViewVehicleComponent } from './view-vehicle/view-vehicle.component';
import { DetailVehicleComponent } from './detail-vehicle/detail-vehicle.component';
import { ListDriverVOComponent } from './list-driver-VO/list-driver-VO';
import { VehicleComponent } from './vehicle/vehicle.component';
// import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [
    CommonModule,
    VehicleRoutingModule,
    SharedModule,
    FormsModule,
    NgbModule,
    DataTablesModule,
    NgbDropdownModule,
    NgxLoadingModule,
    InputTrimModule,
      NgbDatepickerModule,
    SelectModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA2nAC5PVSxPN5Zanwr_DE8B4ccx5ATbUI'
    }),
    AgmDirectionModule,
  ],
  declarations: [ ListVehicleComponent,ListDriverVOComponent,/*AddVehicleComponent,*/VehicleComponent,/*ViewVehicleComponent,*/DetailVehicleComponent ],
  providers: [ FileValidator, GoogleMapsAPIWrapper],
  exports:[ListDriverVOComponent],
  entryComponents:[ListDriverVOComponent]
})

export class VehicleModule { }
