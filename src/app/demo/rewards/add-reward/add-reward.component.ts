import { Component, OnInit } from '@angular/core';
// import { FileHandle } from './dragDrop.directive';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Validation } from '../../helper/validation';
import { ToastyService, ToastOptions, ToastData  } from 'ng2-toasty';
import { Router } from '@angular/router';
import { FileValidator } from '../../helper/file-input.validator';
import { NotifyService } from '../../services/notify.service';

@Component({
    selector: 'add-reward',
    templateUrl: './add-reward.component.html'
  })
  export class AddRewardComponent implements OnInit {
    public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  addRewardForm: FormGroup;
  mediaExtentionError: Boolean = false;
  isMediaSelected: Boolean = false;
  media: any = {};
  imageSrc: string | ArrayBuffer;
  isSubmitted = false;
  // isSubmitted: boolean = false;
  //   files: FileHandle[] = [];
  
  //   filesDropped(files: FileHandle[]): void {
  //     this.files = files;
  //   }
  
    constructor(
    private validation: Validation,
    private toastyService: ToastyService,
    private router: Router,
    private fileValidator: FileValidator,
    private fb: FormBuilder,
    private notifyService:NotifyService
  ) {
    this.addRewardForm = fb.group({
      title: new FormControl("", [
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
      type: new FormControl( "text", []),
     
      media: new FormControl("", []),
    });
   }
    ngOnInit(){
       
    }
    resetMedia(){
      this.addRewardForm.controls['type'].setValue("text");
      this.addRewardForm.controls['media'].setValue("");
      this.imageSrc=null;
    }
    onFormSubmit() {
      this.isSubmitted = true;
      // console.log("1245",this.addRewardForm.valid)
        
        if (this.addRewardForm.valid) {
        this.loading = true;
          // console.log("01245",this.addRewardForm.value)
          let params = this.addRewardForm.value;
          let formData: FormData = new FormData();
         
          // formData.append('vehicleIdPhotos', this.vehicleIdPhotos);
    
          for (let key in params) {
             
              // console.log(" params[key]", params[key])
              
              formData.append(key, params[key]);
          }
          if(this.isMediaSelected) {
            formData.append("media", this.media);
          }

        this.notifyService.createReward(formData)
          .subscribe(next => {
              this.loading = false;
              this.isSubmitted = false;
              console.log("next",next.status_code)
              if (next.status_code == 200) {
                this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
                this.router.navigate(["/reward/"]);
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
    onImageChange(e) {
      const vm = this;
      if (e.target.files.length > 0 && e.target.files[0]) {
    
        this.isMediaSelected = true;
        let file = e.target.files[0];
        if (file) {
          if (!this.fileValidator.validateImage(file.name)) {
            this.mediaExtentionError = true;
          } else {
            this.mediaExtentionError = false;
            const reader = new FileReader();
                 reader.onload = e => this.imageSrc = reader.result;
                   
                  reader.readAsDataURL(file);
            };
            console.log("file--------------------------",file.type)
            if(file.type == "video/mp4"){
             this.addRewardForm.controls['type'].setValue("video");

            }else{
             this.addRewardForm.controls['type'].setValue("image");

            }
            this.media = file;
          }
        }
      
      // if (e.target.files && e.target.files[0]) {
      //       const file = e.target.files[0];
     
      //     const reader = new FileReader();
      //      reader.onload = e => this.imageSrc = reader.result;
             
      //       reader.readAsDataURL(file);
      //    }
      else {
        this.media = "";
        this.isMediaSelected = false;
        this.mediaExtentionError = false;
      }
    }
    ngAfterViewInit(): void {
    // Menu Active process Start
// for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
// {
//   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
// }
// document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[18].getElementsByTagName("li")[0].className = "ng-star-inserted active"
// menu Active Process End
  }
  }