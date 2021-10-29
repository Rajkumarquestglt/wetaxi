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
import { PassengerLocationRoutingModule } from './passenger-location-routing.module';
import { ListPassengerLocationComponent } from './list-passenger-location/list-passenger-location.component';
import { ViewPassengerLocationComponent } from './view-passenger-location/view-passenger-location.component';

 
@NgModule({
  imports: [
    CommonModule,
    PassengerLocationRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgbDropdownModule,
    NgxLoadingModule.forRoot({}),
    InputTrimModule,
    NgbDatepickerModule,
    SelectModule
  ],
  declarations: [ ListPassengerLocationComponent,ViewPassengerLocationComponent]
  // providers: [ FileValidator ]
})

export class PassengerLocationModule { }
