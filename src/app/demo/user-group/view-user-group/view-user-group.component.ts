import { Component, OnInit } from "@angular/core";
import { OperatorService } from "../../services/operator.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Validation } from '../../helper/validation';
import { ToastyService, ToastOptions, ToastData } from "ng2-toasty";

import { Router } from '@angular/router';
import { FileValidator } from '../../helper/file-input.validator';



@Component({
  selector: 'view-user-group',
  templateUrl: './view-user-group.component.html',
  // template:`<app-view-driver-notification [parentCount]="primaryColour"></app-view-driver-notification>`
})
export class ViewUserGroupComponent implements OnInit {
  
  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  isSubmitted: boolean = false;
  usersGroupDataPages: any;
  positions: any;
  editUserGroupForm: FormGroup;
  options: any = [];
  public pageAccess=[];
  status: any;
 
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
    let url = window.location.href.split("/")
    let url_id = url[url.length-1];
    this.getUserGroupById(url_id);
    this.GetAllPosition();
    this.getAllPages();
    this.editUserGroupForm = new FormGroup({
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
      id: new FormControl("", []),
      status: new FormControl(true, []),

    });
  }
  getUserGroupById(id){
    this.loading=true;
     // console.log("dataParam",dataParam)
     this.operatorService.getUserGroupById(id).subscribe(next => {
      this.loading=false;
      //  console.log("next---------->",next.data.pageAccess);
      this.status=next.data;
       this.editUserGroupForm.patchValue({
        name:next.data.name,
        description:next.data.description,
        // pageAccess:next.data.pageAccess,
         id:next.data._id,
         status: new FormControl("", []),
       })
       
 
 
    });
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
    // this.editUserGroupForm.patchValue({
    //   'pageAccess': this.editUserGroupForm.value.pageAccess,
    //  })
 
  }

  onFormSubmit(){
    
    this.isSubmitted = true;
   


    if (this.editUserGroupForm.valid) {
      
      this.loading = true;
      
     this.editUserGroupForm.value.pageAccess=this.pageAccess;
      console.log("Data",this.editUserGroupForm.value)
      
      
        this.operatorService.editUserGroups(this.editUserGroupForm.value)
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

      console.log("usersGroupDataPages", this.usersGroupDataPages);
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
