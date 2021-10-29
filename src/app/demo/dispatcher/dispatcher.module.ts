import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';

import { DispatcherRoutingModule } from './dispatcher-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { InputTrimModule } from 'ng2-trim-directive';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { SelectModule } from 'ng-select';
import { ReceivedComponent } from './received/received.component';
import { AcceptedComponent } from './accepted/accepted.component';
import { OnRideComponent } from './onRide/onRide.component';
import { CancelComponent } from './cancel/cancel.component';
import { SuccessfulComponent } from './successful/successful.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxLoadingModule,
    DispatcherRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgbDropdownModule,
    NgxLoadingModule,
    InputTrimModule,
    NgbDatepickerModule,
    SelectModule
  ],
  declarations: [ReceivedComponent,AcceptedComponent,SuccessfulComponent,OnRideComponent,CancelComponent]

})
export class DispatcherModule { }
 