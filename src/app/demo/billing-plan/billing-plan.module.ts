import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
import { InputTrimModule } from 'ng2-trim-directive';
import { BillingplanRoutingModule } from './billing-plan-routing.module';
import { ListBillingplanComponent } from './list-billing-plan/list-billing-plan.component';
import { ViewBillingplanComponent } from './view-billing-plan/view-billing-plan.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AddBillingPlanComponent } from './add-billing-plan/add-billing-plan.component';
import { FileValidator } from '../helper/file-input.validator';

@NgModule({
  imports: [
    CommonModule,
    BillingplanRoutingModule,
    SharedModule,
    NgbModule,
    FormsModule,
    DataTablesModule,
    NgxLoadingModule.forRoot({}),
    InputTrimModule
  ],
  declarations: [ListBillingplanComponent,ViewBillingplanComponent,AddBillingPlanComponent],
  providers: [ FileValidator ],
})

export class BillingplanModule { }
