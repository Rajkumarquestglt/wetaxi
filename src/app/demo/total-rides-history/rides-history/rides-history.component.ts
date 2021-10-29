import { Component, OnInit, ViewChild } from '@angular/core';
import { DriverRideService } from '../../services/driver-ride.service';
import { AuthService, PassengerService } from '../../services';
import { ToastyService, ToastOptions, ToastData } from 'ng2-toasty';
import { ActivatedRoute } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ExcelService } from '../../services/excel.service';
@Component({
  selector: 'app-rides-history',
  templateUrl: './rides-history.component.html'
})
export class RidesHistoryComponent implements OnInit {
  public loading = false;
  position = 'bottom-right';
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject(); @ViewChild(DataTableDirective)
  credits: any;
  balance: number = 0;
  driverName: string;
  exportRideHistoryExcel = [];
  @ViewChild('closeBtn') closeBtn;
  profileImageUrl: any;
  @ViewChild('myPersistenceModal') myPersistenceModal;
  submitted = false;
  filterForm = this.fb.group({
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required]
  });
  filterValue: any = {};
  constructor(
    private passengerService: PassengerService,
    private route: ActivatedRoute,
    private toastyService: ToastyService,
    private authService: AuthService,
    private excelService: ExcelService,
    private driverRideService: DriverRideService,
    private fb: FormBuilder,
    config: NgbDatepickerConfig
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() };
  }

  ngOnInit() {
    this.authService.clearDataTableData("DataTables_credit_management");
    this.loading = true;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      serverSide: true,
      processing: false,
      order: [1, 'desc'],
      // searching: false,
      stateSave: true,
      stateSaveCallback: function (settings, data) {
        localStorage.setItem(
          "DataTables_credit_management",
          JSON.stringify(data)
        );
      },
      stateLoadCallback: function (settings) {
        return JSON.parse(localStorage.getItem("DataTables_credit_management"));
      },
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.search.value = dataTablesParameters.search.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        dataTablesParameters.filter = this.filterValue;
        this.driverRideService.ListOfAllDriversRide(dataTablesParameters).subscribe(
          resp => {
            this.loading = false;
            this.credits = resp.data;
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
            this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
          }
        );
      },
      columns: [
        { data: "rideId" },
        { data: "acceptedAt" },
        { data: "pickupAddress" },
        { data: "destinationAddress" },
        { data: "toatlFare" },
        { data: "toatlDistance" },
        { data: "totalTime" },
        { data: "reasonText" },
        { data: "isVerified", orderable: false, searchable: false },
        { data: "actions", orderable: false, searchable: false }
      ]
    };
  }
  
  blockUnblockDriver(rides: any) {
    let text;
    let reason_title;
    if (rides.cancelBy == 'passenger') {
      text = "Reason:" + rides.reasonText.en;
      reason_title = 'Ride Is Cancelled By Passanger';
    } else {
      text = "Reason:" + rides.reasonText.en;
      reason_title = 'Ride Is Cancelled By System';
    }
    Swal({
      title: reason_title,
      text: text,
      type: 'warning',
      showCloseButton: true
    })
  }

  exportAsXLSX_Totalridedetail() {
    this.driverRideService.ListOfAllDriversRide({ filter: this.filterValue }).subscribe(
      resp => {
        resp.data.map(element => {
          this.exportRideHistoryExcel.push({ 'RideId': element.rideId,'Date': element.paymentAt ? moment(element.paymentAt).format('YYYY-MM-DD') : moment(element.createdAt).format('YYYY-MM-DD'), 'Source': element.pickupAddress, 'Destination': element.destinationAddress, 'TotalFee': element.toatlFare,'Distance': Math.round(element.toatlDistance)+'km' ,'Time': element.totalTime+'min' ,'Reason': element.reasonText ? element.reasonText.en : "--"})
        });
        this.excelService.exportAsExcelFile(this.exportRideHistoryExcel, 'TotalRideHistory');
        this.exportRideHistoryExcel =[];
      },
      error => {
        this.loading = false;
        this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
  }

  cancelRideSystem(rides: any) {
    let text = 'You want to cancel ride ?';
    Swal({
      title: 'Are you sure?',
      text: text,
      type: 'warning',
      showCloseButton: true,
      showCancelButton: true
    }).then((willDelete) => {
      if (willDelete && !willDelete.dismiss) {
        let data = {
          'ride_id': rides._id
        }
        this.driverRideService.CancelRide(data).subscribe(
          next => {
            if (next.status_code == 200) {
              this.rerender();
              Swal('Success', next.message, 'success');
            } else {
              Swal('Error', next.message, 'error');
            }
          },
          error => {
            Swal('Error', "Ride can not cancel successfully.", 'error');
          }
        );
      } else {
      }
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

