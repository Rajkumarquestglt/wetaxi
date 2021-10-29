import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { ToastData, ToastOptions, ToastyService } from "ng2-toasty";
import { Router } from "@angular/router";
import { AuthService } from 'src/app/demo/services';
// import { environment } from 'src/environments/environment';
import Swal from "sweetalert2";
import * as moment from "moment";
// import { ExcelService } from '../../services/excel.service';
import {
  NgbDatepickerConfig,
  NgbModal,
  ModalDismissReasons,
} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: "logoutModal",
  templateUrl: "logoutModal.component.html",
})
export class LogoutModalComponent implements  OnInit {
  @Output() close = new EventEmitter<void>();
  title = "appBootstrap";
  @ViewChild('template') template: TemplateRef<HTMLDivElement>;

  closeResult: string;
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  isSubmitted: boolean = false;

  promotions;
  submitted = false;
  filterForm = this.fb.group({
    fromDate: ["", Validators.required],
    toDate: ["", Validators.required],
  });
  filterValue: any = {};
  getPromotionListExcel: [];
  exportActionLogExcel: any[];
  promotionCodeDel: any;
  profilePhotoUrl: string;
  getPdfData: any;
  exportExcelData = [];
  startData=1;

  constructor(
    private router: Router,

    private toastyService: ToastyService,
    private authService: AuthService, 
    private fb: FormBuilder,
    config: NgbDatepickerConfig,
    private modalService: NgbModal,
  ) {
    config.minDate = { year: 1900, month: 1, day: 1 };
    config.maxDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    };
  }

  ngOnInit() {
  this.open();
  }
  logout(){
    this.authService.doLogout();
    this.router.navigate(["/login"]);
  }
  onCancel(){
    this.onClose();
    // if(window.location.href.split("/").reverse()[0]==="logout"){
    //   this.router.navigate(["/dashboard"]);
    // }
  }
  onClose(){
    this.close.emit();
  }
  open() {
    console.log("logout in progress");
    this.modalService
      .open(this.template, { keyboard:false,backdrop:'static' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
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

  }
