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
import { NotificationLogsComponent } from './notification-logs.component';
import { NotificationLogsRoutingModule } from './notification-logs-routing.module';
import { NotificationComponent } from './notification/notification.component';
import { DragDirective } from './notification/dragDrop.directive';

// import { ListNotificationComponent } from './list-notification/list-notification.component';
// import { ListDriverNotificationComponent } from '../driver-notification/list-driver-notification/list-driver-notification.component';
// import { ListPassengerNotificationComponent } from '../passenger-notification/list-passenger-notification/list-passenger-notification.component';

@NgModule({
  imports: [
    CommonModule,
    NotificationLogsRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgbDropdownModule,
    NgxLoadingModule,
    InputTrimModule,
    NgbDatepickerModule,
    SelectModule
  ],
  declarations: [/*ListPassengerNotificationComponent,ListDriverNotificationComponent,ListNotificationComponent,*/DragDirective,NotificationComponent ,NotificationLogsComponent],
  providers: [ FileValidator ]
})

export class NotificationLogsModule { }
