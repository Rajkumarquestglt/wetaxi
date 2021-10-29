import { Component, OnInit, ViewChild } from '@angular/core';
import { OperatorService } from '../../services/operator.service';
import { NgbModal, ModalDismissReasons, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { DriverService, AuthService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../services/excel.service';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'list-user-group',
  templateUrl: './list-user-group.component.html',
  // template:`<app-view-driver-location [parentCount]="primaryColour"></app-view-driver-location>`
})
export class ListUserGroupComponent implements OnInit {
  usersGroupData: any;
  userGroupDataDel: any;
  closeResult: string;
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = 'bottom-right';
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  exportExcel=[];
  getPdfData: any;
  userDataDel: any;
  submitted = false;
  filterForm = this.fb.group({
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required]
  });
  filterValue: any = {};
  startData=1;
  constructor(
    private fb: FormBuilder,
    config: NgbDatepickerConfig,
    private operatorService:OperatorService,
    private authService: AuthService,
    private toastyService: ToastyService,
    private modalService: NgbModal,
    private excelService: ExcelService,
    
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
// import 'jspdf-autotable';

   this.loading = true;
   this.operatorService.getAllUserGroupsPDF().subscribe(
     respone => {
     
       this.getPdfData = respone.data.AllUserGroup;
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
const header = [['name', 'description', 'pageAccess', 'createdAt']];
const rows=[];
  

       const data = this.getPdfData;
       console.log("data",data)
      
     
       data.forEach(elm => {
          const temp = [elm.name, elm.description,elm.pageAccess,elm.createdAt];
          rows.push(temp);
         //  console.log('Rows', rows); // showing all data
        });

       //  @ts-ignore
       downloadPDF.autoTable({
         head: header,
         body: rows,
       });
     
       this.loading = false;

       downloadPDF.save('User-group.pdf');

  }

 
  exportExcelData() {
    console.log("log")
    this.loading = true;

    this.operatorService.getAllUserGroups1().subscribe(
      resp => {
        // console.log("log", resp.data.AllDriverLocation)

        resp.data.AllUserGroup.map(element => {
          this.exportExcel.push({ 'userName': element.userName, 'position': element.position, 'group': element.group, 'createdAt': element.createdAt })
        
      
        });
    this.loading = false;

        this.excelService.exportAsExcelFile(this.exportExcel, 'User_group');

          this.exportExcel =[];
      },
      error => {
        this.loading = false;
        this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
      }
    );
  }
  getAllUserGroups(){
   

  }

  
  onDelete(id){
    this.loading = true;

    let deleted = {
      'id': id
      }
    console.log("recycled",deleted)
    this.operatorService
    .deleteUserGroups(deleted)
    .subscribe(next => {
      this.userGroupDataDel = next.data;
      if (next.status_code == 200) {
        this.addToast({
          title: "Success",
          msg: next.message,
          timeout: 5000,
          theme: "default",
          position: "bottom-right",
          type: "success",
        });
        this.rerender();
        this.loading = false;
      } else {
        this.addToast({
          title: "Error",
          msg: next.message,
          timeout: 5000,
          theme: "default",
          position: "bottom-right",
          type: "error",
        });
      }
    },
    (error) => {
      this.loading = false;

      this.addToast({
        title: "Error",
        msg: error.message,
        timeout: 5000,
        theme: "default",
        position: "bottom-right",
        type: "error",
      });
    }
  );
  }

ngOnInit(){
  // Menu Active process Start
  // for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
  // {
  //   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
  // }
  // document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[9].getElementsByTagName("li")[0].className = "ng-star-inserted active"
  // menu Active Process End
  this.authService.clearDataTableData("DataTables_component");
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
        "DataTables_component",
        JSON.stringify(data)
      );
    },
    stateLoadCallback: function (settings) {
      return JSON.parse(localStorage.getItem("DataTables_component"));
    },
    ajax: (dataTablesParameters: any, callback) => {
      console.log(dataTablesParameters);
      dataTablesParameters.search.value = dataTablesParameters.search.value.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
      dataTablesParameters.filter = this.filterValue;
     
      this.startData = dataTablesParameters.start == 0 ? 1 : (dataTablesParameters.start + 1);
      this.operatorService.getAllUserGroups(dataTablesParameters).subscribe(
        respone => {
          this.loading = false;
          this.usersGroupData = respone.data.AllUserGroup;
          var inputs = document.getElementsByTagName('input');
            for(var i = 0; i < inputs.length; i++) {
              if(inputs[i].type.toLowerCase() == 'search') {
                inputs[i].style.width = 15 + "vw";
                inputs[i].style.minWidth = 150 + "px";
              }
            }
          callback({
            recordsTotal: respone.data.AllUserGroup.length, 
            recordsFiltered: respone.data.AllUserGroup.length,
            data: []
          });
        
        },
        error => {
          this.loading = false;
          this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
        });
     
    },
    columns: [
      { data: "_id" },
      { data: "userName" },
      { data: "position" },
      { data: "group" },
      { data: "createdAt" },
      { data: "action",orderable : false, searchable: false, }
     
     
    ]
  };
  
}
onChangebtn(id,status){
  let deleted = {
    'id': id,
    'status': status

    }
  console.log("recycled",deleted)
  this.operatorService
  .changeUserGroupsStatus(deleted)
  .subscribe(respone => {
    // this.userDataDel = respone;

    // // console.log("recycleData", this.userDataDel);
    // this.getAllUserGroups();

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