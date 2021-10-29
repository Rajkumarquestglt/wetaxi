import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../theme/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
import { InputTrimModule } from 'ng2-trim-directive';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
// import { FileValidator } from '../helper/file-input.validator';
import { SelectModule } from 'ng-select';
import { UserRoutingModule } from './user-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { FileValidator } from '../helper/file-input.validator';
 
 
@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgbDropdownModule,
    NgxLoadingModule.forRoot({}),
    InputTrimModule,
    NgbDatepickerModule,
    SelectModule
  ],
  declarations: [ ListUserComponent,AddUserComponent,ViewUserComponent],
  providers: [ FileValidator ]
})

export class UserModule { }
