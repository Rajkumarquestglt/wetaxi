import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DriverService, AuthService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
// import { environment } from 'src/environments/environment';
// import Swal from 'sweetalert2';
import * as moment from 'moment';
import { SettingService } from '../../services/setting.service';
import { ExcelService } from '../../services/excel.service';
import { NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { environment } from '../../../../environments/environment';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'detail-passenger',
  templateUrl: './detail-passenger.component.html'
})
export class DetailPassengerComponent implements  OnInit {
  passengerDetails: any;
  profilePhotoUrl: string;
  title = 'appBootstrap';
  
  closeResult: string;
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = 'bottom-right';
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  promotions;
  submitted = false;
  filterForm = this.fb.group({
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required]
  });
  filterValue: any = {};
  getPromotionListExcel: [];
  exportActionLogExcel: any[];
  driverTrips: any;
  passengerTrips: any;
  getDataPdf: any;
  exportExcelData=[];
  startData=1;
      
      constructor(
      private locationService: LocationService ,
      private driverService:DriverService,
      private toastyService: ToastyService,
    private authService: AuthService,
    private fb: FormBuilder,
    config: NgbDatepickerConfig,
    private modalService: NgbModal,
    private excelService: ExcelService)
    {
      config.minDate = { year: 1900, month: 1, day: 1 };
      config.maxDate = { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() };
    }
      getPassengerDetails(id){
        let recycled = {
          'id': id
          }
        this.locationService
        .getPassengersLocationById(recycled)
        .subscribe(respone => {
          this.passengerDetails = respone.data.PassengerLocationDetail[0];
        });
      }
      
  
      imgErrorHandler(event) {
        event.target.src = this.profilePhotoUrl + 'default.png';
      }


      getPdfData(){
        this.loading = true;
        let url = window.location.href.split("/")
        let url_id = url[url.length-1];
        let recycled = {
          'passengerId': url_id
        
          }
        this.locationService.getTripsByPassengerIdPDF(recycled).subscribe(
          respone => {
          this.getDataPdf = respone.data;
          this.generatePdf();
          },
          error => {
            this.loading = false;
            this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
          }
        );
      }
      generatePdf(){
        const downloadPDF = new jsPDF();
        const header = [['No', 'Driver Id',  'Name', 'Phone', 'Registered Date','Earning']];
        const rows=[];
        const data = this.getDataPdf;
        if(data.length > 0){
          var i = 0;
          data.forEach(element => {
            i += 1;
            const temp = [
              i,
              element.passengerData.uniqueID,
              element.name,
              element.passengerData.onlyPhoneNumber,
              moment(element.createdAt).format('DD/MM/YYYY hh:mm A'),
              element.earning
            ];
            rows.push(temp);
          });
        } else {
          this.loading = false;
          this.addToast({ title: 'Error', msg: "No data found", timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
          return;
        }
        //  @ts-ignore
        downloadPDF.autoTable({
          head: header,
          body: rows,
        });
        this.loading = false;
        downloadPDF.save('Passenger data.pdf');
      }
          exportAsExcel(){
          
            this.loading = true;
            let url = window.location.href.split("/")
            let url_id = url[url.length-1];
            let recycled = {
              'passengerId': url_id
            } 
            this.locationService.getTripsByPassengerIdExl(recycled).subscribe(
              resp => {
                // console.log( "dsadsdas",resp.data.RideDetail.uniqueID)
                var i = 0;
                resp.data.RideDetail.map(element => {
                  i+=1;
                  this.exportExcelData.push({
                    'No': i,
                    'Driver Id': element.passengerData.uniqueID,
                    'Name': element.name,
                    'Phone Number': element.passengerData.onlyPhoneNumber,
                    'Registered Date': moment(element.createdAt).format('DD/MM/YYYY hh:mm A'),
                    'Earning': element.earning
                  })
                });
                this.loading = false;
        
                this.excelService.exportAsExcelFile(this.exportExcelData, 'DriverRideData');
                this.exportExcelData =[];
              },
              error => {
                this.loading = false;
                this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
              }
            );
          }
      
    ngOnInit(){
         // Menu Active process Start
    //  for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
    //  {
    //    document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
    //  }
    //  document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[3].getElementsByTagName("li")[0].className = "ng-star-inserted active"
     // menu Active Process End
      this.profilePhotoUrl = environment.profileImageUrl;
      let url = window.location.href.split("/")
      let url_id = url[url.length-1];
      // console.log("url ",url)
      // console.log("id ",url_id)
      this.getPassengerDetails(url_id);
      this.profilePhotoUrl = environment.profileImageUrl;


      this.authService.clearDataTableData("DataTables_component");
      this.loading = true;
      this.dtOptions = {
        pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      order: [0, 'desc'],
      processing: false,
      stateSave: true,
       
        stateSaveCallback: function (settings, data) {
          localStorage.setItem(
            "DataTables_component",
            JSON.stringify(data)
          );
        }, 
        stateLoadCallback: function (settings) {
          return JSON.parse(localStorage.getItem("DataTables_component"));
        },
        
        ajax: (dataTablesParameters: any, callback) => {
          let url = window.location.href.split("/")
          let url_id = url[url.length-1];
          // console.log(dataTablesParameters);
          dataTablesParameters.search.value = dataTablesParameters.search.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
          dataTablesParameters.filter = this.filterValue;
          dataTablesParameters.passengerId = url_id;
// console.log(" dataTablesParameters.filter", dataTablesParameters.filter)
          // console.log("dataTablesParameters",dataTablesParameters);
          this.startData = dataTablesParameters.start == 0 ? 1 : (dataTablesParameters.start + 1);
          this.locationService.getTripsByPassengerId(dataTablesParameters).subscribe(
            resp => {
              var inputs = document.getElementsByTagName('input');

          for(var i = 0; i < inputs.length; i++) {
            if(inputs[i].type.toLowerCase() == 'search') {
              inputs[i].style.width = 15 + "vw";
              inputs[i].style.minWidth = 150 + "px";
            }
          }
              this.loading = false;
              this.driverTrips = resp.data.RideDetail;
              this.passengerTrips= resp.data.RideDetail[0];
            //  console.log("this.driverTrips",this.driverTrips.totalFare)
            //  console.log("this.driverTrips",this.driverTrips)

              callback({
                recordsTotal: resp.data.RideDetail.length, 
                recordsFiltered: resp.data.RideDetail.length, 
                data: []
              });
              // console.log("resp.data.recordsTotal",resp)

            },
            error => {
              this.loading = false;
              this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
            }
          );
        },
        columns: [
          {data:null},
          {data:"driverData.uniqueID"},

          // { data: "rideId"},
          // { data: "driverData.profilePhoto",orderable: false, searchable: false},
          { data: "vehicleTypeData.type.en"},
          { data: "passengerData.onlyPhoneNumber"},
          { data: "createdAt"},
          { data: "earning", searchable: false},
        
         
        ]
      };
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
    }
  
    rerender(): void {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next();
      });
    }
  
    filterList() {
      this.submitted = true;
  
      if (this.filterForm.status == "INVALID")
        return;
  
      let { fromDate, toDate } = this.filterForm.value;
  
      this.filterValue = {
        fromDate: moment().year(fromDate.year).month(fromDate.month - 1).date(fromDate.day).hours(0).minutes(0).seconds(0).milliseconds(0).toISOString(),
        toDate: moment().year(toDate.year).month(toDate.month - 1).date(toDate.day).hours(23).minutes(59).seconds(59).milliseconds(999).toISOString()
      };
  
      this.rerender();
    }
  
    resetFilter() {
      this.submitted = false;
      this.filterValue = {}
      this.filterForm.reset();
      this.rerender();
    }
}
