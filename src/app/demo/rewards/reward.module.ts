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
import { RewardRoutingModule } from './reward-routing.module';
import { ViewRewardComponent } from './view-reward/view-reward.component';
import { ListRewardComponent } from './list-reward/list-reward.component';
import { AddRewardComponent } from './add-reward/add-reward.component';


@NgModule({
  imports: [
    CommonModule,
    RewardRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgbDropdownModule,
    NgxLoadingModule,
    InputTrimModule,
    NgbDatepickerModule,
    SelectModule
    
  ],
  declarations: [AddRewardComponent,ViewRewardComponent,ListRewardComponent],
  providers: [ FileValidator ]
})

export class RewardModule { }
