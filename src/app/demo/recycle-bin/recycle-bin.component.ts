import { Component, OnInit, ViewChild } from "@angular/core";
import { RecycleBinService } from "../services/recycle-bin.service";
import { ToastData, ToastOptions, ToastyService } from "ng2-toasty";
import { AuthService } from "../services";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { NgbModal, ModalDismissReasons, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: "app-recycle-bin",
  templateUrl: "./recycle-bin.component.html",
})
export class RecycleBinComponent implements OnInit {
  closeResult: string;
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  submitted = false;
  recycleData: any;
  recycleDataDel: any;
  public masterSelected = false;
  recycleDataRev: any;
 filterForm = this.fb.group({
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required]
  });
  filterValue: any = {};
  startData=1;
  constructor(
    private router: Router,
    private recycleBinServece: RecycleBinService,
    private toastyService: ToastyService,
    private authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    config: NgbDatepickerConfig,
  )  {
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
  onDelete(id) {
    this.loading = true;

    let recycled = {
      id: id,
    };
    console.log("recycled", recycled);
    this.recycleBinServece.deleteRecycle(recycled).subscribe((next) => {
      this.recycleDataDel = next.data;
      this.loading = false;
      // console.log(next.status_code)
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

  onRecover(id) {
    this.loading=true;
    let recycled = { 
      "id": id,
    };
    console.log("recycled", recycled);
    this.recycleBinServece.recoverRecycle(recycled).subscribe((next) => {
      console.log("next",next)
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

  // list(){
  //   this.recycleBinServece
  //   .getAllRecycleBinList()
  //   .subscribe(respone => {
  //     this.recycleData = respone.data.AllRecycleData;

  //     console.log("recycleData", this.recycleData);
  //   });

  // }
  ngOnInit() {
    
    this.authService.clearDataTableData("DataTables_component");
    this.loading = true;
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      order: [0, "desc"],
      serverSide: true,
      processing: true,
      stateSave: true,

      stateSaveCallback: function (settings, data) {
        localStorage.setItem("DataTables_component", JSON.stringify(data));
      },
      stateLoadCallback: function (settings) {
        return JSON.parse(localStorage.getItem("DataTables_component"));
      },

      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.search.value = dataTablesParameters.search.value.replace(
          /[&\/\\#,+()$~%.'":*?<>{}]/g,
          ""
        );
        dataTablesParameters.filter = this.filterValue;
        this.startData = dataTablesParameters.start == 0 ? 1 : (dataTablesParameters.start + 1);
        this.recycleBinServece
          .getAllRecycleBinList(dataTablesParameters)
          .subscribe(
            (resp) => {
              this.loading = false;
              this.recycleData = resp.data.AllRecycleData;
              var inputs = document.getElementsByTagName('input');
              for(var i = 0; i < inputs.length; i++) {
                if(inputs[i].type.toLowerCase() == 'search') {
                  inputs[i].style.width = 15 + "vw";
                  inputs[i].style.minWidth = 150 + "px";
                }
              }
              console.log("this.recycleData",this.recycleData)

              callback({
                recordsTotal: resp.data.AllRecycleData.length,
                recordsFiltered: resp.data.AllRecycleData.length,
                data: [],
              });
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
      },
      columns: [
        { data: null },
        { data: "subject" },
        { data: "Modified_by" },
        { data: "updatedAt" },
        { data: "action", orderable: false, searchable: false },
      ],
    };

    //  this.list();
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
      onAdd: (toast: ToastData) => {},
      onRemove: (toast: ToastData) => {},
    };

    switch (options.type) {
      case "default":
        this.toastyService.default(toastOptions);
        break;
      case "info":
        this.toastyService.info(toastOptions);
        break;
      case "success":
        this.toastyService.success(toastOptions);
        break;
      case "wait":
        this.toastyService.wait(toastOptions);
        break;
      case "error":
        this.toastyService.error(toastOptions);
        break;
      case "warning":
        this.toastyService.warning(toastOptions);
        break;
    }
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    // Menu Active process Start
// for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
// {
//   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
// }
// document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[21].getElementsByTagName("li")[0].className = "ng-star-inserted active"
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
