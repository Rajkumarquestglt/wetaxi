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
import { DriverRoutingModule } from './driver-routing.module';
import { ListDriverComponent } from './list-driver/list-driver.component';
import { ListDriverRequestComponent } from './driver-request/driver-request.component';
import { ViewDriverComponent } from './view-driver/view-driver.component';
import { DetailDriverComponent } from './detail-driver/detail-driver.component';
import {  AgmCoreModule,GoogleMapsAPIWrapper} from '@agm/core';
import { AgmDirectionModule} from 'agm-direction';
import { FileValidator } from 'src/app/demo/helper/file-input.validator';
// import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [
    CommonModule,
    DriverRoutingModule,
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
  declarations: [ ListDriverComponent,ListDriverRequestComponent,ViewDriverComponent,DetailDriverComponent ],
  providers: [ FileValidator, GoogleMapsAPIWrapper]
})

export class DriverModule { }
