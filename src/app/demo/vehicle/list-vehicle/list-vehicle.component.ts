import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { VehicleService, AuthService, DriverService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from '../../services/excel.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';


class Vehicle {
  [x: string]: any;
  Id: number;
  first_name: string;
  last_name: string;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}


@Component({
  selector: 'list-vehicle',
  templateUrl: './list-vehicle.component.html'
})
export class ListVehicleComponent implements AfterViewInit, OnInit { 

  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = 'bottom-right';
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  vehicles: Vehicle[];
  vehicleTypeImageUrl: any;
  filterForm = this.fb.group({
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required]
  }); 
  filterValue: any = {};
  isSubmitted: boolean;
  closeResult: string;
  exportExcel=[];
  getPdfData: any;
  vehicleTypeDefaultImageUrl: any;
  startData=1;
  constructor(
    private vehicleService: VehicleService,
    private authService: AuthService,
    private fb: FormBuilder,
    config: NgbDatepickerConfig,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private driverService: DriverService,
    
    private toastyService: ToastyService
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() };
   }
   open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  generatePdf() 
  { 
    this.loading = true;
    this.vehicleService.getAllVehiclePDF().subscribe(
      respone => {
        this.getPdfData = respone.data;
        console.log("getPdfData",this.getPdfData)
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
    const header = [['No', 'Vehicle ID','Type','Fee/KM','Min Fare']];
    const rows=[];
    const data = this.getPdfData;
    if(data.length > 0){
      data.forEach(element => {
        const temp = [
          element.autoIncrementID,
          "V-0"+element.autoIncrementID,
          element.type.en,
          element.feePerKM,
          element.minFare
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
    downloadPDF.save('Vehicle-data.pdf');
  }

 
  exportExcelData() {
    console.log("log")
    this.loading = true;

    this.vehicleService.ListOfAllVehicles({}).subscribe(
      resp => {
        // console.log("log", resp.data.AllDriverLocation)

        resp.data.map(element => {
          this.exportExcel.push({
            'No': element.autoIncrementID,
            'Vehicle ID': "V-0"+element.autoIncrementID,
            'Type': element.type.en,
            'Fee/KM': element.feePerKM,
            'Min Fare': element.minFare
          })
        });
    this.loading = false;

        this.excelService.exportAsExcelFile(this.exportExcel, 'Vehicle_data');

          this.exportExcel =[];
      },
      error => {
        this.loading = false;
        this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
  }
  ngOnInit() {
    // Menu Active process Start
    // for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
    // {
    //   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
    // }
    // document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[4].getElementsByTagName("li")[0].className = "ng-star-inserted active"
    // menu Active Process End
    this.vehicleTypeDefaultImageUrl = environment.profileImageUrl + 'default.png'
    this.vehicleTypeImageUrl = environment.vehicleTypeImageUrl;
    this.authService.clearDataTableData("DataTables_vehicle_management");
    this.loading = true;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: false,
      stateSave: true,
      stateSaveCallback: function(settings, data) {
        localStorage.setItem(
          "DataTables_vehicle_management",
          JSON.stringify(data)
        );
      },
      stateLoadCallback: function(settings) {
        return JSON.parse(localStorage.getItem("DataTables_vehicle_management"));
      },
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.search.value = dataTablesParameters.search.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        this.startData = dataTablesParameters.start == 0 ? 1 : (dataTablesParameters.start + 1);
        this.vehicleService.ListOfAllVehicles(dataTablesParameters).subscribe(
          resp => {
            this.loading = false;
            this.vehicles = resp.data;
            console.log(resp.data);
            var inputs = document.getElementsByTagName('input');

          for(var i = 0; i < inputs.length; i++) {
            if(inputs[i].type.toLowerCase() == 'search') {
              inputs[i].style.width = 15 + "vw";
              inputs[i].style.minWidth = 150 + "px";
            }
          }
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          },
          error => {
            this.loading = false;
            this.addToast({title:'Error', msg:error.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
          }
        );
      },
      columns: [
        { data: "autoIncrementID" },
        { data: "autoIncrementID" },
        { data: "vehicle.image",orderable: false, searchable: false },

        { data: "type.en" },
        { data: "feePerKM", searchable: false },
        { data: "minFare", searchable: false },
        // { data: "image", orderable: false, searchable: false },
        { data: "actions", orderable: false, searchable: false }
      ]
    };
  }
  onImageErr(event){
    event.target.src = "";
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

  // activeInactiveVehicle(vehicle: any) {
  //   let text;
  //   if(vehicle.isActive) {
  //     text = 'You want to inactive this vehicle ?';
  //   } else {
  //     text = 'You want to active this vehicle ?';
  //   }

  //   Swal({
  //     title: 'Are you sure?',
  //     text: text,
  //     type: 'warning',
  //     showCloseButton: true,
  //     showCancelButton: true
  //   }).then((willDelete) => {
  //       if (willDelete && !willDelete.dismiss) {
  //         let data = {
  //           'vehicle_id': vehicle._id
  //         }
  //         this.vehicleService.activeInactiveVehicle(data).subscribe(
  //           next => {
  //            if(next.status_code == 200) {
  //              this.rerender();
  //              if(vehicle.isActive) {
  //               Swal('Success', "Vehicle inactivated successfully.", 'success');
  //             } else {
  //               Swal('Success', "Vehicle activated successfully.", 'success');
  //             }
  //            } else {
  //             Swal('Error', "Vehicle status is not updated.", 'error');
  //            }
  //           },
  //           error => {
  //             Swal('Error', "Vehicle status is not updated.", 'error');
  //           }
  //         );
  //       } else {
          
  //       }
  //     });
  // }

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
    this.isSubmitted = true;

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
    this.isSubmitted = false;
    this.filterValue = {}
    this.filterForm.reset();
    this.rerender();
  }

}

