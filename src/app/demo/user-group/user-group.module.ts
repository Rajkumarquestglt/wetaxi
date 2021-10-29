import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../theme/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
import { InputTrimModule } from 'ng2-trim-directive';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FileValidator } from '../helper/file-input.validator';
import { SelectModule } from 'ng-select';
import { ListUserGroupComponent } from './list-user-group/list-user-group.component';
import { UserGroupRoutingModule } from './user-group-routing.module';
import { ViewUserGroupComponent } from './view-user-group/view-user-group.component';
import { AddUserGroupComponent } from './add-user-group/add-user-group.component';

 
@NgModule({
  imports: [
   
    CommonModule,
    UserGroupRoutingModule,
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
  declarations: [ ListUserGroupComponent,AddUserGroupComponent,ViewUserGroupComponent],
  providers: [ FileValidator ]
})

export class UserGroupModule { }
