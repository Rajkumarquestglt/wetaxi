import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { PassengerService, AuthService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ExcelService } from '../../services/excel.service';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'list-passenger',
  templateUrl: './list-passenger.component.html'
})
export class ListPassengerComponent implements AfterViewInit, OnInit {
 
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = 'bottom-right';
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  passengers;
  profilePhotoUrl: any;
  exportPassengerExcel = [];
  submitted = false;
  filterForm = this.fb.group({
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required]
  }); 
  filterValue: any = {};
  ListOfAllPassengersPDF: any;

  constructor(
    private passengerService: PassengerService,
    private toastyService: ToastyService,
    private authService: AuthService,
    private excelService: ExcelService,
    private fb: FormBuilder,
    config: NgbDatepickerConfig
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() };
  }
  generatePdf() 
  { 
    this.loading = true;
    this.passengerService.ListOfAllPassengersPDF().subscribe(
      respone => {
      this.ListOfAllPassengersPDF = respone.data;
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
    const header = [['No', 'PassengerId', 'Name', 'Phone', 'Trips', 'Ride Expenses (EURO)','Registration Date']];
    const rows=[];
    const data = this.ListOfAllPassengersPDF;
    if(data.length > 0){
      data.forEach(element => {
        const temp = [
          element.autoIncrementID,
          element.uniqueID,
          element.name,
          element.onlyPhoneNumber,
          element.totalTripCount > 0?element.totalTripCount:"N/A",
          element.totalRideEarning,
          moment(element.createdAt).format('DD/MM/YYYY hh:mm A')
        ];
        rows.push(temp);
      });
    } else {
      this.loading = false;
      this.addToast({ title: 'Error', msg: "No data Found", timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
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

  ngOnInit() {
     // Menu Active process Start
    //  for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
    //  {
    //    document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
    //  }
    //  document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[3].getElementsByTagName("li")[0].className = "ng-star-inserted active"
     // menu Active Process End
    this.profilePhotoUrl = environment.profileImageUrl;
    this.authService.clearDataTableData("DataTables_passenger_management");
    this.loading = true;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      order: [0, 'desc'],
      serverSide: true,
      processing: false,
      stateSave: true,
      stateSaveCallback: function (settings, data) {
        localStorage.setItem(
          "DataTables_passenger_management",
          JSON.stringify(data)
        );
      },
      stateLoadCallback: function (settings) {
        return JSON.parse(localStorage.getItem("DataTables_passenger_management"));
      },
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.search.value = dataTablesParameters.search.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        dataTablesParameters.filter = this.filterValue;
        this.passengerService.ListOfAllPassengers(dataTablesParameters).subscribe(
          resp => {
            // console.log("dfghjkl",resp)
            this.loading = false;
            this.passengers = resp.data;
            console.log(this.passengers);
            var inputs = document.getElementsByTagName('input');

          for(var i = 0; i < inputs.length; i++) {
            if(inputs[i].type.toLowerCase() == 'search') {
              inputs[i].style.width = 15 + "vw";
              inputs[i].style.minWidth = 150 + "px";
            }
          }
            for (let index = 0; index < this.passengers.length; index++) {
              if (moment().format('D') == moment(this.passengers[index].dob).format('D') && moment().format('MMMM') == moment(this.passengers[index].dob).format('MMMM')) {
                this.passengers[index].isSelected = true;
              } else {
                this.passengers[index].isSelected = false;
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
            this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
          }
        );
      },
      columns: [
        { data: "autoIncrementID" },
        { data: "uniqueID" },
        { data: "profilePhoto", orderable: false, searchable: false },
        { data: "name" },
        { data: "onlyPhoneNumber" },
        { data: "trips" , searchable: false },
        { data: "rideExpenses", searchable: false },
        { data: "createdAt", searchable: false },
        { data: "actions", orderable: false, searchable: false },

      
      ]
    };
  }
  imgErrorHandler(event) {
    event.target.src = "/assets/images/user/avatar-1.jpg";
    // event.target.src = this.profilePhotoUrl + 'default.png';
    console.log("event.target.src",event.target.src)
  }

  exportAsXLSX_Passenger() {
    this.loading = true;
    this.passengerService.ListOfAllPassengers({ filter: this.filterValue }).subscribe(
      resp => {
        console.log('resp: ', resp);
        resp.data.map(element => {
          this.exportPassengerExcel.push({
            'No': element.autoIncrementID,
            'PassengerId': element.uniqueID,
            'Name': element.name,
            'Phone': element.onlyPhoneNumber,
            'Trips':element.totalTripCount > 0?element.totalTripCount:"N/A",
            'Ride Expenses (EURO)': element.totalRideEarning,
            'Registration Date': moment(element.createdAt).format('DD/MM/YYYY hh:mm A')
          })
        });
        this.loading = false;

        this.excelService.exportAsExcelFile(this.exportPassengerExcel, 'PassengerDetails');
        this.exportPassengerExcel =[];
      },
      error => {
        this.loading = false;
        this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
  }

  levelnotfound() {
    Swal({
      title: 'Bottom line !!',
      type: 'info',
      showCloseButton: true,
      showCancelButton: false
    }).then((willDelete) => {
    });
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

  blockUnblockPassenger(passenger: any) {
    let text;
    if (passenger.isBlocked) {
      text = 'You want to unblock this passenger ?';
    } else {
      text = 'You want to block this passenger ?';
    }

    Swal({
      title: 'Are you sure?',
      text: text,
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete && !willDelete.dismiss) {
        let data = {
          'passenger_id': passenger._id
        }
        this.passengerService.blockUnblockPassenger(data).subscribe(
          next => {
            if (next.status_code == 200) {
              this.rerender();
              if (passenger.isBlocked) {
                Swal('Success', "Passenger unblocked successfully.", 'success');
              } else {
                Swal('Success', "Passenger blocked successfully.", 'success');
              }
            } else {
              Swal('Error', next.message, 'error');
            }
          },
          error => {
            Swal('Error', error.message, 'error');
          }
        );
      } else {

      }
    });
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
