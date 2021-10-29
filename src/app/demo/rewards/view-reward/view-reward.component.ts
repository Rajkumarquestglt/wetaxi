import { Component, OnInit } from '@angular/core';
import { ToastOptions, ToastData, ToastyService } from 'ng2-toasty';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NotifyService } from '../../services/notify.service';
import { FileValidator } from '../../helper/file-input.validator';
import { Router } from '@angular/router';
import { Validation } from '../../helper/validation';
import { environment } from 'src/environments/environment';

// import { FileHandle } from './add-notification/dragDrop.directive';
@Component({
    selector: 'view-reward',
    templateUrl: './view-reward.component.html'
  })
  export class ViewRewardComponent implements OnInit {
    public loading = false;
    public primaryColour = "#ffffff";
    public secondaryColour = "#ffffff";
    position = "bottom-right";
    viewRewardForm: FormGroup;
    mediaExtentionError: Boolean = false;
    isMediaSelected: Boolean = false;
    media: any = {};
    imageSrc: string | ArrayBuffer;
  
    isSubmitted: boolean = false;
  profilePhotoUrl: string;
  RewardPhotoUrl: string;
      // files: FileHandle[] = [];
    
      // filesDropped(files: FileHandle[]): void {
      //   this.files = files;
      // }
    
      constructor(
      private validation: Validation,
      private toastyService: ToastyService,
      private router: Router,
      private fileValidator: FileValidator,
      private fb: FormBuilder,
      private notifyService:NotifyService
    ) {
     
     }


      ngOnInit(){
        
        this.profilePhotoUrl = environment.profileImageUrl;
   this.RewardPhotoUrl=environment.reward_media_large_url;

        let url = window.location.href.split("/")
        let url_id = url[url.length-1];
        console.log("url_id",url_id)
        this.getRewardDetails(url_id);

        this.viewRewardForm = new FormGroup({
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
          type: new FormControl( "", []),
          rewardId:new FormControl( "", []),
          media: new FormControl("", []),
        });
      }
      imgErrorHandler(event) {
        event.target.src = this.profilePhotoUrl + 'default.png';
      }
      getRewardDetails(id){
        this.loading=true;
        // let dataParam={
        //   'notificationId':id
        // }
        // console.log("dataParam",dataParam)
        this.notifyService.getRewardDetails(id).subscribe(next => {
         this.loading=false;
          console.log("next---------->",next);
          // this.viewRewardForm.controls['title'].setValue(next.data.title);
          // this.viewRewardForm.controls['description'].setValue(next.data.description);
          // this.viewRewardForm.controls['type'].setValue(next.data.type);
          // this.viewRewardForm.controls['media'].setValue(next.data.media);
          this.viewRewardForm.patchValue({
            title:next.data.title,
            description:next.data.description,
            type:next.data.type,
            rewardId:next.data._id,
          })
          
    
    
       });
      }
      resetMedia(){
        this.viewRewardForm.controls['type'].setValue("text");
        this.viewRewardForm.controls['media'].setValue("");
        this.imageSrc=null;
      }
      onFormSubmit() {
       
        this.isSubmitted = true;
        // console.log("1245",this.viewRewardForm.valid)
          
          if (this.viewRewardForm.valid) {
          this.loading = true;
            // console.log("01245",this.viewRewardForm.value)
            let params = this.viewRewardForm.value;
            let formData: FormData = new FormData();
           
            // formData.append('vehicleIdPhotos', this.vehicleIdPhotos);
      
            for (let key in params) {
               
                // console.log(" params[key]", params[key])
                
                formData.append(key, params[key]);
            }
            if(this.isMediaSelected) {
              formData.append("media", this.media);
            }
  
          this.notifyService.updateReward(formData)
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
               this.viewRewardForm.controls['type'].setValue("video");
  
              }else{
               this.viewRewardForm.controls['type'].setValue("image");
  
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