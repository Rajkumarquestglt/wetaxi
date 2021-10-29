import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../theme/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
import { InputTrimModule } from 'ng2-trim-directive';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
// import { FileValidator } from '../helper/file-input.validator';
import { SelectModule } from 'ng-select';
import { DriverLocationRoutingModule } from './driver-location-routing.module';
import { ListDriverLocationComponent } from './list-driver-location/list-driver-location.component';
import { ViewDriverLocationComponent } from './view-driver-location/view-driver-location.component';

 
@NgModule({
  imports: [
    CommonModule,
    DriverLocationRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgbDropdownModule,
    NgxLoadingModule.forRoot({}),
    InputTrimModule,
    NgbDatepickerModule,
    SelectModule
  ],
  declarations: [ ListDriverLocationComponent,ViewDriverLocationComponent],
  // providers: [ FileValidator ]
})

export class DriverLocationModule { }
