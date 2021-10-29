import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { environment } from 'src/environments/environment';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { ExcelService } from '../../services/excel.service';


@Component({
  selector: 'view-driver-location',
  templateUrl: './view-driver-location.component.html',
  // template:`<app-view-driver-notification [parentCount]="primaryColour"></app-view-driver-notification>`
})
export class ViewDriverLocationComponent implements OnInit {
  profilePhotoUrl: any;
  driverDetails: any;
  public id: string;
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = 'bottom-right';

   
    constructor(
      private locationService: LocationService,
      private toastyService: ToastyService,
      private excelService:ExcelService
    ) {   }

    

    getDriverDetails(id){
      let recycled = {
        'id': id
        }
      console.log("recycled",recycled)
      this.locationService
      .getDriverLocationById(recycled)
      .subscribe(respone => {
        this.driverDetails = respone.data.DriverLocationDetail[0];
    
        console.log("driverDetails--------------------------", this.driverDetails);
    
      },
      error => {
        this.loading = false;
        this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' 
      });
    });
    }
    

    imgErrorHandler(event) {
      event.target.src = this.profilePhotoUrl + 'default.png';
    }

ngOnInit(){


  this.profilePhotoUrl = environment.profileImageUrl;
  let url = window.location.href.split("/")
  let url_id = url[url.length-1];
  console.log("url ",url)
  console.log("id ",url_id)
  this.getDriverDetails(url_id);
  this.profilePhotoUrl = environment.profileImageUrl;
  // this.getDriverDetails(id);

}

addToast(options) {
  if (options.closeOther) {
    this.toastyService.clearAll();
  }
  this.position = options.position ? options.position : this.position;
  const toastOptions: ToastOptions = {
    title: options.title,
    msg: options.msg,
    showClose: options.showClose,
    timeout: options.timeout,
    theme: options.theme,
    onAdd: (toast: ToastData) => {
    },
    onRemove: (toast: ToastData) => {
    }
  };

  switch (options.type) {
    case 'default': this.toastyService.default(toastOptions); break;
    case 'info': this.toastyService.info(toastOptions); break;
    case 'success': this.toastyService.success(toastOptions); break;
    case 'wait': this.toastyService.wait(toastOptions); break;
    case 'error': this.toastyService.error(toastOptions); break;
    case 'warning': this.toastyService.warning(toastOptions); break;
  }
}
ngAfterViewInit(): void {
// Menu Active process Start
// for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
// {
//   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
// }
// document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[16].getElementsByTagName("li")[0].className = "ng-star-inserted active"
// menu Active Process End

}




}