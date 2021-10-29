import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecycleBinComponent } from './recycle-bin.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NgxLoadingModule } from 'ngx-loading';
import { DataTablesModule } from 'angular-datatables';

import { RecycleBinRoutingModule } from './recycle-bin-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({ 
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    DataTablesModule,
    NgxLoadingModule,
    RecycleBinRoutingModule
  ],
  declarations: [RecycleBinComponent]

}) 
export class RecycleBinModule { }
