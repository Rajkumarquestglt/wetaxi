import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CallCenterComponent } from './call-center.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
import {TinymceModule} from 'angular2-tinymce';


import { CallCenterRoutingModule } from './call-center-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxLoadingModule,
    CallCenterRoutingModule,
    TinymceModule

  ],
  declarations: [CallCenterComponent]

})
export class CallCenterModule { }
 