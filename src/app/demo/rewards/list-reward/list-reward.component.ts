import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from '../../services/excel.service';
import { DriverService, AuthService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import * as moment from 'moment';
import { NotifyService } from '../../services/notify.service';
import { environment } from 'src/environments/environment';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
    selector: 'list-reward',
    templateUrl: './list-reward.component.html'
  })
  export class ListRewardComponent implements OnInit {
    closeResult: string;
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = 'bottom-right';
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  submitted = false;
  filterForm = this.fb.group({
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required]
  });
  filterValue: any = {};
  profilePhotoUrl: string;
  rewardDetails: any;
  exportExcelData=[];
  getPdfData: any;
  _id: any;
  RewardPhotoUrl: string;
  startData=1;


    constructor(
    private fb: FormBuilder,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private driverService:DriverService,
    private authService: AuthService,
    private notifyService:NotifyService,


    private toastyService: ToastyService,

    ) {
      config.minDate = { year: 1900, month: 1, day: 1 };
      config.maxDate = { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() };
     }
     getRewardDetails(id){
      this.loading=true;
      // let dataParam={
      //   'notificationId':id
      // }
      // console.log("dataParam",dataParam)
      this.notifyService.getRewardDetails(id).subscribe(next => {
       this.loading=false;
        console.log("next---------->",next.data);
        // this.id=next.data;
        // this.title=next.data.title;
        // this.description=next.data.description;
        // this.type=next.data.type;
        this._id=next.data._id;
        // this.viewNotificationForm.controls['title'].setValue(next.data.title);
        // this.viewNotificationForm.controls['description'].setValue(next.data.description);
        // this.viewNotificationForm.controls['type'].setValue(next.data.type);
        // this.viewNotificationForm.controls['media'].setValue(next.data.media);
        // this.notificationForm.patchValue({
        //   title:next.data.title,
        //   description:next.data.description,
        //   type:next.data.type,
  
        // })
        
  
  
     });
    }
     generatePdf() 
     { 
   // import 'jspdf-autotable';
   
      this.loading = true;
      this.notifyService.getAllRewardListPDF().subscribe(
        respone => {
        
          this.getPdfData = respone.data.data;
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
   const header = [['title', 'description', 'type', 'createdAt', 'status']];
   const rows=[];
     
   
          const data = this.getPdfData;
          console.log("data",data)
         
        
          data.forEach(elm => {
             const temp = [elm.title, elm.description,elm.type,elm.createdAt,elm.status ];
             rows.push(temp);
            //  console.log('Rows', rows); // showing all data
           });
   
          //  @ts-ignore
          downloadPDF.autoTable({
            head: header,
            body: rows,
          });
        
          this.loading = false;
   
          downloadPDF.save('List-Reward-data.pdf');
   
     }
   
    
     exporExcel() {
      //  console.log("log")
       this.notifyService.getAllRewardList1().subscribe(
         resp => {
           console.log("log", resp.data.data[0].rewardList)
   
           resp.data.data[0].rewardList.map(element => {
             this.exportExcelData.push({ 'title': element.title, 'description': element.description, 'type': element.type,'createdAt': element.createdAt, 'status': element.status })
           
         
           });
           this.excelService.exportAsExcelFile(this.exportExcelData, 'List_Rewards');
   
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
// for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
// {
//   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
// }
// document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[18].getElementsByTagName("li")[0].className = "ng-star-inserted active"
// menu Active Process End
      this.notifyService.getAllRewardList1().subscribe(
        resp => {
          this.loading = false;
          this.rewardDetails = resp.data.data[0].rewardList;
        });
//       let url = window.location.href.split("/")
//       let url_id = url[url.length-1];
// console.log("url_id",url_id)
//       this.getRewardDetails(url_id);
    this.profilePhotoUrl = environment.profileImageUrl;
    this.RewardPhotoUrl = environment.notification_media_large_url;
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
        
          dataTablesParameters.search.value = dataTablesParameters.search.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
          dataTablesParameters.filter = this.filterValue;
          this.startData = dataTablesParameters.start == 0 ? 1 : (dataTablesParameters.start + 1);
          this.notifyService.getAllRewardList(dataTablesParameters).subscribe(
            resp => {
              this.loading = false;
              console.log("resp",resp.data.data[0].rewardList)
              this.rewardDetails = resp.data.data[0].rewardList;
              var inputs = document.getElementsByTagName('input');
            for(var i = 0; i < inputs.length; i++) {
              if(inputs[i].type.toLowerCase() == 'search') {
                inputs[i].style.width = 15 + "vw";
                inputs[i].style.minWidth = 150 + "px";
              }
            }
            // console.log("this.rewardDetails",this.rewardDetails)
            // console.log("this.rewardDetails",resp.data.data[0].notificationList.length)

              callback({
                recordsTotal: resp.data.data[0].rewardList.length, 
                recordsFiltered: resp.data.data[0].rewardCount[0].totalCount,
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
          { data: null },
          { data: "title" },
          { data: "description" },
          { data: "media",orderable:false,searchable:false },
          { data: "type" },
          { data: "createdAt" },
          { data: "status" },
          { data: "action",orderable:false,searchable:false }
          
         
        ]
      };
    } 



    imgErrorHandler(event) {
      event.target.src = this.profilePhotoUrl + 'default.png';
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