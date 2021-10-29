import { Component, OnInit } from "@angular/core";
import { OperatorService } from "../../services/operator.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Validation } from '../../helper/validation';
import { ToastyService, ToastOptions, ToastData } from "ng2-toasty";

import { Router } from '@angular/router';
import { FileValidator } from '../../helper/file-input.validator';



@Component({
  selector: "add-user-group",
  templateUrl: "./add-user-group.component.html",
 })
export class AddUserGroupComponent implements OnInit {

  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  isSubmitted: boolean = false;
  usersGroupDataPages: any;
  positions: any;
  addUserGroupForm: FormGroup;
  options: any = [];
  public pageAccess=[];
 
  constructor(
    private operatorService: OperatorService,
    private validation: Validation,
    private toastyService: ToastyService,
    private router: Router,
    private fileValidator: FileValidator,
    private fb: FormBuilder,
    ) {}

  ngOnInit() {
    // Menu Active process Start
  // for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
  // {
  //   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
  // }
  // document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[9].getElementsByTagName("li")[0].className = "ng-star-inserted active"
  // menu Active Process End
    this.GetAllPosition();
    this.getAllPages();
    this.addUserGroupForm = new FormGroup({
      name: new FormControl("", [
        Validators.required,
        Validators.pattern(this.validation.alphabaticOnly),
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      description: new FormControl("", [
        Validators.required,
        Validators.pattern(this.validation.alphabaticOnly),
        Validators.minLength(2),
        Validators.maxLength(1000)
      ]),
      pageAccess: new FormControl("", []),
      status: new FormControl(true, []),
    });

  }
  onChangebtn(status){
    let deleted = {
    
      'isActive': status

      }
    console.log("recycled",deleted)
   

  }
  onCheckboxChange(event: any, key: any, value: any) {
    var obj = {page : key,
      position : value
    };
   
    var ind = this.pageAccess.findIndex(function(element){
      return element.page==obj.page && element.position==obj.position;
   })
   if(ind!==-1){
    this.pageAccess.splice(ind, 1)
   }else{
    this.pageAccess.push(obj);
  }
    console.log(this.pageAccess)
    // this.addUserGroupForm.patchValue({
    //   'pageAccess': this.addUserGroupForm.value.pageAccess,
    //  })
 
  }

  onFormSubmit(){
    // this.txt.push(this.pageAccess)
    // console.log("txt",this.txt)
    this.isSubmitted = true;
   


    if (this.addUserGroupForm.valid) {
      
      this.loading = true;
      
     this.addUserGroupForm.value.pageAccess=this.pageAccess;
      console.log("Data",this.addUserGroupForm.value)
      console.log("pc",this.addUserGroupForm.value.pageAccess)
        this.operatorService.saveUserGroups(this.addUserGroupForm.value)
          .subscribe(next => {
              this.loading = false;
              this.isSubmitted = false;
              if (next.status_code == 200) {
                this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
                this.router.navigate(["/user-group/"]);
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

  GetAllPosition() {
    this.operatorService.GetAllPosition().subscribe((respone) => {
      // this.positions = respone.data;
      this.positions = 
       
        [
        {
        "_id": "5e70a67af39e36757bf6c6aa",
        "__v": 0,
        "name": "Admin"
        },
        {
        "_id": "5e730e04cd04001e90fa2834",
        "__v": 0,
        "name": "Super Admin"
        },
        {
        "_id": "5e7ee8923ccfec3d587ef696",
        "__v": 0,
        "name": "Suppoter"
        }
        ]

      console.log("---------------------------------------", this.positions);
    });
  }
  getAllPages() {
    this.operatorService.getAllPages().subscribe((respone) => {
      this.usersGroupDataPages = respone.data;

      // console.log("usersGroupDataPages", this.usersGroupDataPages);
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
}
