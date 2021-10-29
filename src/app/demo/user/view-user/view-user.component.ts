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
  selector: 'view-user',
  templateUrl: './view-user.component.html',
})
export class ViewUserComponent implements OnInit {

  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  editUserForm: FormGroup;
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
    this.editUserForm = fb.group({
      userName: new FormControl("", [
        Validators.required,
        Validators.pattern(this.validation.alphabaticOnly),
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      email: new FormControl("", [
        Validators.pattern(this.validation.email)
      ]),
      id: new FormControl(""),

      groupId: new FormControl("", [Validators.required]),
      positionId: new FormControl("", [Validators.required]),
      phone: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern(this.validation.integer)
      ]),
      isActive: new FormControl("",[]),
      password: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      confirmPassword: new FormControl("", [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
    },{
      validator: PasswordValidation.MatchPassword 

    });
   }
   editUser(id){
    this.operatorService.getUserById(id)
    .subscribe(next => {
  console.log("next333",next.data.password)

       this.editUserForm.controls['id'].setValue(next.data._id);
      this.editUserForm.controls['userName'].setValue(next.data.userName);
      this.editUserForm.controls['phone'].setValue(next.data.phone);

       
      


      // this.editUserForm.controls['startDate'].setValue({year: current_date.getFullYear(), month: current_date.getMonth(), day: current_date.getDay()});

      this.editUserForm.controls['email'].setValue(next.data.email);
      this.editUserForm.controls['password'].setValue(next.data.password);

      // this.editUserForm.controls['expireDate'].setValue({year: expire_date.getFullYear(), month: expire_date.getMonth(), day: expire_date.getDay()});
      this.editUserForm.controls['groupId'].setValue(next.data.groupId);
      this.editUserForm.controls['positionId'].setValue(next.data.positionId);


   });
   }
  ngOnInit() {
    // Menu Active process Start
    // for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
    // {
    //   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
    // }
    // document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[8].getElementsByTagName("li")[0].className = "ng-star-inserted active"
    // menu Active Process End
    this.getAllUsers();
   this.getAllUserGroups();
   let url = window.location.href.split("/")
   let url_id = url[url.length-1];
   console.log("url_id",url_id)
   this.editUser(url_id);
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
    let firstDigit = this.editUserForm.value.phoneNumber.slice(0,1);
    if(firstDigit == 0) {
      this.editUserForm.value.phoneNumber = this.editUserForm.value.phoneNumber.slice(1,this.editUserForm.value.phoneNumber.length);
      this.editUserForm.patchValue({
       'phoneNumber': this.editUserForm.value.phoneNumber
      })
    }
  }

  onFormSubmit() {
    this.isSubmitted = true;

      // let params = this.editUserForm.value;
      // let formData: FormData = new FormData();
      // for (let key in params) {
      //     formData.append(key, params[key]);
      // }

      console.log("1245",this.editUserForm.valid)
      
      if (this.editUserForm.valid) {
    this.loading = true;
        console.log("01245",this.editUserForm.value)
      this.operatorService.editUser(this.editUserForm.value)
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

