import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { environment } from 'src/environments/environment';
import { DataTableDirective } from 'angular-datatables';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../services/excel.service';
import { DriverService, AuthService } from '../../services';
import { Subject } from 'rxjs';



@Component({
  selector: 'list-passenger-location',
  templateUrl: './list-passenger-location.component.html',
  // template:`<app-view-passenger-location [parentCount]="primaryColour"></app-view-passenger-location>`
})
export class ListPassengerLocationComponent implements OnInit {
  passengerLocation: any;
  profilePhotoUrl: string;
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = 'bottom-right';
  @ViewChild('closeBtn') closeBtn;


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  exportExcelData=[];
  getPdfData: any;
  public startData=1;
 
 
  constructor(
    private locationService: LocationService,
    private toastyService: ToastyService,
    private excelService:ExcelService,
    private driverService:DriverService,
    private authService: AuthService

    
   ) { }
   
  ngOnInit(){
    
  this.profilePhotoUrl = environment.profileImageUrl;
  this.authService.clearDataTableData("DataTables_component");
  console.log("same")
  this.dtOptions = {
    pagingType: "full_numbers",
    pageLength: 10,
    order: [0, 'desc'],
    serverSide: true,
    processing: true,
    stateSave: true,

    stateSaveCallback: function (settings, data) {
  // console.log("same")

      localStorage.setItem(
        "DataTables_component",
        JSON.stringify(data)
      );
    }, 
    stateLoadCallback: function (settings) {
  // console.log("same")

      return JSON.parse(localStorage.getItem("DataTables_component"));
    },
    

    ajax: (dataTablesParameters: any, callback) => {
     
      // console.log(dataTablesParameters);
            let url = window.location.href.split("/")
      let url_id = url[url.length-1];
      dataTablesParameters.search.value = dataTablesParameters.search.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
      // dataTablesParameters.filter = this.filterValue;
      dataTablesParameters.passengerId = url_id;
      // console.log("same",dataTablesParameters)
      this.startData = dataTablesParameters.start == 0 ? 1 : (dataTablesParameters.start + 1);
      this.locationService
      .getAllPassengersLocation(dataTablesParameters)
      .subscribe(resp => {
        // console.log('here');
        this.loading = false;
        this.passengerLocation = resp.data.AllPassengerLocation;
        var inputs = document.getElementsByTagName('input');
            for(var i = 0; i < inputs.length; i++) {
              if(inputs[i].type.toLowerCase() == 'search') {
                inputs[i].style.width = 15 + "vw";
                inputs[i].style.minWidth = 150 + "px";
              }
            }
        // console.log("fine",resp.data.AllPassengerLocation);

        callback({
          recordsTotal: resp.data.AllPassengerLocation.length, 
          recordsFiltered: resp.data.AllPassengerLocation.length,
          data: []
        });
    
      },
      error => {
        this.loading = false;
        this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      });
    },
    columns: [
      { data: null },
      {data:null},
      { data: "uniqueID" },
      { data: "profilePhoto",orderable:false,searchable:false},
      { data: "name" },
      { data: "onlyPhoneNumber" },
      { data: "updatedAt",  },
      {data:null,orderable:false,searchable:false}
     
    ]
  };



    // this.locationService
    // .getAllPassengersLocation1()
    // .subscribe(respone => {
    //   this.passengerLocation = respone.data.AllPassengerLocation;

    //   console.log("passengerLocation", respone);
    // });
    
  }
  imgErrorHandler(event) {
    event.target.src = this.profilePhotoUrl + 'default.png';
  }

  generatePdf() 
  { 
// import 'jspdf-autotable';

   this.loading = true;
   this.locationService.getAllPassengersLocationPDF().subscribe(
     respone => {
     
       this.getPdfData = respone.data.AllPassengerLocation;
      //  this.jsonObj = respone.data;
       console.log("getPdfData",this.getPdfData)
     //  this.data();
      this.exportDriverDataToPdf();
      
     },
     
     error => {
       this.loading = false;
       this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
     }
   );
  
  } 

 exportDriverDataToPdf(){

const downloadPDF = new jsPDF();
const header = [['Location Name', 'uniqueID', 'name', 'PhoneNumber', 'updatedAt']];
const rows=[];
  

       const data = this.getPdfData;
       console.log("data",data)
      
     
       data.forEach(elm => {
          const temp = ["N/A", elm.uniqueID,elm.name,elm.onlyPhoneNumber,elm.updatedAt ];
          rows.push(temp);
         //  console.log('Rows', rows); // showing all data
        });

       //  @ts-ignore
       downloadPDF.autoTable({
         head: header,
         body: rows,
       });
     
       this.loading = false;

       downloadPDF.save('Driver data.pdf');

  }

 
  exportData() {
    
    this.locationService.getAllPassengersLocation1().subscribe(
      resp => {
        console.log("log", resp.data.AllPassengerLocation)
        resp.data.AllPassengerLocation.map(element => {
          this.exportExcelData.push({ 'uniqueID': element.uniqueID, 'name': element.name, 'onlyPhoneNumber': element.onlyPhoneNumber, 'updatedAt': element.updatedAt })
        
      
        });
        this.excelService.exportAsExcelFile(this.exportExcelData, 'PassengerLocationDetails');

          this.exportExcelData =[];
      },
      error => {
        this.loading = false;
        this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
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
    this.dtTrigger.next();
    // Menu Active process Start
// for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
// {
//   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
// }
// document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[17].getElementsByTagName("li")[0].className = "ng-star-inserted active"
// menu Active Process End
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
}