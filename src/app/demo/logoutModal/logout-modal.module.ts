import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
import { InputTrimModule } from 'ng2-trim-directive';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { FileValidator } from 'src/app/demo/helper/file-input.validator';
import { SelectModule } from 'ng-select';
import { LogoutModalRoutingModule } from './logout-modal-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { LogoutModalComponent } from './logoutModal.component';

@NgModule({ 
  imports: [
    CommonModule,
    NgbModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgbDropdownModule,
    NgxLoadingModule,
    InputTrimModule,
    NgbDatepickerModule, 
    SelectModule,
   LogoutModalRoutingModule,
  ],
  declarations:[LogoutModalComponent],
  providers: [ FileValidator ],
  exports:[LogoutModalComponent],
  entryComponents:[LogoutModalComponent]

}) 
export class LogoutModalModule { }
