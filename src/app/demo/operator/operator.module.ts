import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
import { InputTrimModule } from 'ng2-trim-directive';
import { ListOperatorComponent } from './list-operator/list-operator.component';
import { OperatorRoutingModule } from './operator-routing.module';
// import { AddOperatorComponent } from './add-operator/add-operator.component';
// import { ViewOperatorComponent } from './view-operator/view-operator.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectModule } from 'ng-select';
import { OperatorComponent } from './operator/operator.component';
// import { FileValidator } from '../helper/file-input.validator';

@NgModule({
  imports: [
    CommonModule,
    SelectModule,
    OperatorRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    // FileValidator,
    NgbDatepickerModule,
    NgbModule,
    NgxLoadingModule.forRoot({}),
    InputTrimModule
  ],
  declarations: [ListOperatorComponent,OperatorComponent/*, AddOperatorComponent, ViewOperatorComponent*/]
})

export class OperatorModule { }
