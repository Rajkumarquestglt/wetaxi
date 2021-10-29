import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { NgxLoadingModule } from 'ngx-loading';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// import { AgmCoreModule } from '@agm/core';
import { FormsModule } from '@angular/forms';
import { InputTrimModule } from 'ng2-trim-directive';
import { SelectModule } from 'ng-select';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
    FormsModule,
    InputTrimModule,
    SelectModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyA2nAC5PVSxPN5Zanwr_DE8B4ccx5ATbUI'
    // })
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
