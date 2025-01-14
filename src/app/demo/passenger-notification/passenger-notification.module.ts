import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
import { InputTrimModule } from 'ng2-trim-directive';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FileValidator } from '../helper/file-input.validator';
import { PassengerNotificationRoutingModule } from './passenger-notification-routing.module';
import { ListPassengerNotificationComponent } from './list-passenger-notification/list-passenger-notification.component';
import { ListNotificationComponent } from '../notification-logs/list-notification/list-notification.component';

@NgModule({
  imports: [
    CommonModule,
    PassengerNotificationRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgbDropdownModule,
    NgxLoadingModule.forRoot({}),
    InputTrimModule,
    NgbDatepickerModule
  ],
  declarations: [ListPassengerNotificationComponent],
  providers: [ FileValidator ]

})

export class PassengerNotificationsModule { }
