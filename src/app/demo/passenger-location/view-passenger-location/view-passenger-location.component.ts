import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'view-passenger-location',
  templateUrl: './view-passenger-location.component.html',
  // template:`<app-view-driver-notification [parentCount]="primaryColour"></app-view-driver-notification>`
})
export class ViewPassengerLocationComponent implements OnInit {
  profilePhotoUrl: any;
  public id: string;
  passengerDetails: any;
  
   
    constructor(
      private locationService: LocationService
    ) {   }



    getPassengerDetails(id){
      let recycled = {
        'id': id
        }
      console.log("recycled",recycled)
      this.locationService
      .getPassengersLocationById(recycled)
      .subscribe(respone => {
        this.passengerDetails = respone.data.PassengerLocationDetail[0];
    
        console.log("passengerDetails--------------------------", this.passengerDetails);
    
      });
    }
    

    imgErrorHandler(event) {
      event.target.src = this.profilePhotoUrl + 'default.png';
    }

ngOnInit(){
 // Menu Active process Start
//  for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
//  {
//    document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
//  }
//  document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[17].getElementsByTagName("li")[0].className = "ng-star-inserted active"
 // menu Active Process End

  this.profilePhotoUrl = environment.profileImageUrl;
  let url = window.location.href.split("/")
  let url_id = url[url.length-1];
  console.log("url ",url)
  console.log("id ",url_id)
this.getPassengerDetails(url_id);
  this.profilePhotoUrl = environment.profileImageUrl;
  // this.getDriverDetails(id);

}
}