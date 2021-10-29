import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService, OperatorService, DriverService } from '../../services';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
// import { DriverService, AuthService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ActionLogsService } from '../../services/action-logs.service';
import { ExcelService } from '../../services/excel.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'view-action-log',
  templateUrl: './view-action-log.component.html'
})
export class ViewActionLogsComponent implements OnInit {
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = 'bottom-right';
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  filterForm = this.fb.group({
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required]
  });
  filterValue: any = {};
  submitted = false;
  userActivity: any;
  usersData : any;
  getPdfData: any;
  exportActionLogExcel = [];
  public startData=1;



    constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private driverService:DriverService,
    config: NgbDatepickerConfig,
    private actionLogsService: ActionLogsService,
    private operatorService:OperatorService,
      private excelService:ExcelService,
    private toastyService: ToastyService,


    ){
      config.minDate = { year: 1900, month: 1, day: 1 };
      config.maxDate = { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() };
    }
    generatePdf() 
    { 
     this.loading = true;
     let url = window.location.href.split("/")
          let url_id = url[url.length-1];
          let id={
            'userId' : url_id
          }
     this.actionLogsService.getAllActionLogByUserIdPDF(id).subscribe(
       respone => {
       
         this.getPdfData = respone.data;
        //  this.jsonObj = respone.data;
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
  const header = [['User Group', 'Activities', 'Login Device', 'Open Last Date', 'Opened Page']];
  const rows=[];
    
  
         const data = this.getPdfData;
         console.log("data",data)
        
       
         data.forEach(elm => {
            const temp = [elm.userGroup, elm.activities,"N/A",elm.lastDate,elm.openedPage ];
            rows.push(temp);
           //  console.log('Rows', rows); // showing all data
          });
  
         //  @ts-ignore
         downloadPDF.autoTable({
           head: header,
           body: rows,
         });
       
         this.loading = false;
  
         downloadPDF.save('Activity_log_data.pdf');
  
    }

    exportAsXLSX_Actionlog() {
      let url = window.location.href.split("/")
      let url_id = url[url.length-1];
      const userId=url_id;
      this.actionLogsService.getAllActionLogByUserIdExl(userId).subscribe(
        resp => {
          resp.data.AllActions.map(element => {
            this.exportActionLogExcel.push({
              'No': element.userGroup,
              'userGroup': element.userGroup,
              'Activities': element.activities,
              'Login Device': "N/A",
              'Open Last Date': element.lastDate,
              'Opened Page': element.openedPage
            })
          });
          this.excelService.exportAsExcelFile(this.exportActionLogExcel, 'ActionLogs');
          this.exportActionLogExcel = [];
        },
        error => {
          this.loading = false;
          this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
        }
      );
    }

    
    getAllUsers(){
      let url = window.location.href.split("/")
      let url_id = url[url.length-1];
      const userId=url_id;
      this.operatorService
          .getUserById(userId)
          .subscribe(next => {
            this.loading = false;

            this.usersData = next.data ? next.data : [];
            
            // console.log("usersData", this.usersData);
          },
          error => {
            this.loading = false;
            this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
          
          });
    }
    

    
    ngOnInit() {
     
      this.getAllUsers();
      let url = window.location.href.split("/")
      let url_id = url[url.length-1];
      this.authService.clearDataTableData("DataTables_component");
      this.loading = true;
      this.dtOptions = {
        pagingType: "full_numbers",
        pageLength: 10,
        order: [0, 'desc'],
        serverSide: true,
        processing: true,
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
          dataTablesParameters.userId = url_id;
          this.startData = dataTablesParameters.start == 0 ? 1 : (dataTablesParameters.start + 1);
          // console.log("dataTablesParameters",dataTablesParameters);
          
          this.actionLogsService.getAllActionLogByUserId(dataTablesParameters).subscribe(
            resp => {
              this.loading = false;
              this.userActivity = resp.data.AllActions;
              var inputs = document.getElementsByTagName('input');
            for(var i = 0; i < inputs.length; i++) {
              if(inputs[i].type.toLowerCase() == 'search') {
                inputs[i].style.width = 15 + "vw";
                inputs[i].style.minWidth = 150 + "px";
              }
            }
            //  console.log("this.userActivity",this.userActivity)
              callback({
                recordsTotal: resp.data.recordsTotal, 
                recordsFiltered: resp.data.recordsFiltered,
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
          { data: null,orderable:false},
          { data: "userGroup"},
          { data: "activities"},
          { data: null,orderable:false},
          { data: "lastDate" },
          { data: "openedPage"},


          // { data: "driverData.profilePhoto",orderable: false, searchable: false},
          // { data: "vehicleTypeData.type.en"},
          // { data: "driverData.onlyPhoneNumber"},
          // { data: "toatlDistance"},
          // { data: "totalTime",orderable: false, searchable: false},
          // { data: "toatlFare",orderable: false, searchable: false},
          // { data: null,orderable: false, searchable: false},
          // { data: "driverEarning"},
          // { data: null, orderable: false, searchable: false},
         
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
       // Menu Active process Start
// for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
// {
//   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
// }
// document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[20].getElementsByTagName("li")[0].className = "ng-star-inserted active"
// menu Active Process End
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
