import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CreditService, AuthService } from '../../services';
import { ToastyService, ToastOptions, ToastData } from 'ng2-toasty';
import { RefferalHierarchyService } from '../../services/refferal-hierarchy.service';
import * as moment from 'moment';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-view-driver-hierarchy',
  templateUrl: './view-driver-hierarchy.component.html'
})
export class ViewDriverHierarchyComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  drivers;
  submitted = false;
  filterForm = this.fb.group({
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required]
  });
  filterValue: any = {};

  constructor(
    private fb: FormBuilder,

    private route: ActivatedRoute,
    private creditService: CreditService,
    private toastyService: ToastyService,
    private authService: AuthService,

    private refferalHierarchyService: RefferalHierarchyService
  ) { }
  profileImageUrl: any;
  driver_id: any;
  driver_view_levels =[];
  public loading = false;
  driverData:any;
  driverName: string;
  position = 'bottom-right';
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";

  ngOnInit() {
    this.profileImageUrl = environment.profileImageUrl;
    this.route.params.subscribe(params => {
      this.driver_id = params.driver_id;
    });
    this.getDriverDetails();
    this.authService.clearDataTableData("DataTables_driver_management");
    this.loading = true;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      order: [0, 'desc'],
      serverSide: true,
      searching: true,
      processing: false,
      stateSave: true,
      stateSaveCallback: function (settings, data) {
        localStorage.setItem(
          "DataTables_driver_management",
          JSON.stringify(data)
        );
      },
      stateLoadCallback: function (settings) {
        return JSON.parse(localStorage.getItem("DataTables_driver_management"));
      },
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.search.value = dataTablesParameters.search.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
        dataTablesParameters.driver_id = this.driver_id;
        dataTablesParameters.filter = this.filterValue;
        // dataTablesParameters.driver_level = Number(this.Level_id) + 1;
        dataTablesParameters.driver_level = Number(1);

        this.refferalHierarchyService.ListDriverReferralByLevel(dataTablesParameters).subscribe(
          resp => {
            this.loading = false;
            this.drivers = resp.data;
            var inputs = document.getElementsByTagName('input');
            for(var i = 0; i < inputs.length; i++) {
              if(inputs[i].type.toLowerCase() == 'search') {
                inputs[i].style.width = 15 + "vw";
                inputs[i].style.minWidth = 150 + "px";
              }
            }
            for (let index = 0; index < this.drivers.length; index++) {
              if (moment().format('D') == moment(this.drivers[index].driver.dob).format('D') && moment().format('MMMM') == moment(this.drivers[index].driver.dob).format('MMMM')) {
                this.drivers[index].driver.isSelected = true;
              } else {
                this.drivers[index].driver.isSelected = false;
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
        // // { data: "autoIncrementID" },
        // { data: "uniqueID"},
        // // { data: "email"},
        // { data: "name"},
        // { data: "countryCode"},
        // { data: "onlyPhoneNumber"},
        // { data: "avgRating"},
        // { data: "creditBalance"},
        // { data: "dob"},
        // { data: "createdAt", searchable: false },
        // { data: "profilePhoto",searchable: false },
        // { data: "profilePhoto",searchable: false },
        // { data: "phoneNumber"},
        // { data: "name"},
        // { data: "actions"}

        {data:null},
        {data:null},
        {data:null},
        {data:null},
        {data:null},
        {data:null},
        {data:null},
        {data:null},
        {data:null},
        {data:null}

      ]
    };

  }
  getDriverDetails() {
    this.loading = true;
    let driverData = {
      'driver_id': this.driver_id
    }
    this.refferalHierarchyService.GetDriverReferralDetails(driverData).subscribe(
      respone => {
        this.loading = false;
        this.driverData = respone.data;
        console.log("this.driverData",this.driverData)

        // console.log("this.driverData",this.driverData.driver.name)
        // console.log("this.driverData",this.driverData.driver)


        // this.driverName = this.driverData.driver.name;
      },
      error => {
        this.loading = false;
        this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
  }

  imgErrorHandler(event){
    event.target.src = this.profileImageUrl + 'default.png';
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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
