import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
import { InputTrimModule } from 'ng2-trim-directive';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { FileValidator } from '../helper/file-input.validator';
import { SelectModule } from 'ng-select';
import { PromotionCodeRoutingModule } from './promotion-code-routing.module';
import { ListPromotionCodeComponent } from './list-promotion-code/list-promotion-code.component';
import { AddPromotionCodeComponent } from './add-promotion-code/add-promotion-code.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ViewPromotionCodeComponent } from './view-promotion-code/view-promotion-code.component';

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
    PromotionCodeRoutingModule
  ],
  declarations: [ListPromotionCodeComponent,ViewPromotionCodeComponent,AddPromotionCodeComponent],
  providers: [ FileValidator ]

}) 
export class PromotionCodeModule { }
