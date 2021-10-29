import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Validation, PasswordValidation } from "../../helper/validation";
import { ToastyService, ToastOptions, ToastData } from "ng2-toasty";
import { Router } from "@angular/router";
import { FileValidator } from "../../helper/file-input.validator";
import { DriverService, OperatorService } from "../../services";
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'add-user',
  templateUrl: './add-user.component.html',
})
export class AddUserComponent implements OnInit {

  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  addUserForm: FormGroup;
  isSubmitted: boolean = false;
  usersData: any;
  usersGroupData: any;
  

  constructor(
    config: NgbDatepickerConfig,
    private validation: Validation,
    private operatorService:OperatorService,
    private toastyService: ToastyService,
    private router: Router,
    private fileValidator: FileValidator,
    private fb: FormBuilder,

  ) {
    this.addUserForm = fb.group({
      userName: new FormControl("", [
        Validators.required,
        Validators.pattern(this.validation.alpha_numeric),
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      email: new FormControl("", [
        Validators.pattern(this.validation.email)
      ]),
      groupId: new FormControl("", [Validators.required]),
      isActive: new FormControl(true, []),
      positionId: new FormControl("", [Validators.required]),
      phone: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(this.validation.integer)
      ]),
      password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      confirmPassword: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
    },{
      validator: PasswordValidation.MatchPassword 

    });
   }

  ngOnInit() {
     // Menu Active process Start
    //  for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
    //  {
    //    document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
    //  }
    //  document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[8].getElementsByTagName("li")[0].className = "ng-star-inserted active"
     // menu Active Process End
    
    this.getAllUsers();
   this.getAllUserGroups();
   
  }
  getAllUsers(){
    this.operatorService
        .getAllUsers1()
        .subscribe(respone => {
          this.usersData = respone.data.AllUsers;

          console.log("usersData", this.usersData);
        });
  }
  getAllUserGroups(){
    this.operatorService
    .getAllUserGroups1()
    .subscribe(respone => {
      this.usersGroupData = respone.data.AllUserGroup;

      console.log("usersGroupData", this.usersGroupData);
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
      onAdd: (toast: ToastData) => {},
      onRemove: (toast: ToastData) => {}
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

  onChangeMobileNumber() {
    let firstDigit = this.addUserForm.value.phone.slice(0,1);
    if(firstDigit == 0) {
      this.addUserForm.value.phone = this.addUserForm.value.phone.slice(1,this.addUserForm.value.phone.length);
      this.addUserForm.patchValue({
       'phone': this.addUserForm.value.phone
      })
    }
  }

  onFormSubmit() {
    this.isSubmitted = true;

      // let params = this.addUserForm.value;
      // let formData: FormData = new FormData();
      // for (let key in params) {
      //     formData.append(key, params[key]);
      // }

      console.log("1245",this.addUserForm.valid)
      
      if (this.addUserForm.valid) {
    this.loading = true;
        console.log("01245",this.addUserForm.value)
      this.operatorService.saveUser(this.addUserForm.value)
        .subscribe(next => {
            this.loading = false;
            this.isSubmitted = false;
            if (next.status_code == 200) {
              this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
              this.router.navigate(["/user/"]);
            } else {
              this.addToast({title:'Error', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
            }
          },
          error => {
            this.loading = false;
            this.isSubmitted = false;
            this.addToast({title:'Error', msg:error.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
          })
    }
  }
  }

