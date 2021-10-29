import { Component, OnInit } from '@angular/core';
import { FileHandle } from './dragDrop.directive';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Validation } from '../../helper/validation';
import { ToastyService, ToastOptions, ToastData  } from 'ng2-toasty';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FileValidator } from '../../helper/file-input.validator';
import { NotifyService } from '../../services/notify.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'notification',
    templateUrl: './notification.component.html'
  })
  export class NotificationComponent implements OnInit {
    public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  position = "bottom-right";
  notificationForm: FormGroup;
  mediaExtentionError: Boolean = false;
  isMediaSelected: Boolean = false;
  media: any = {};
  imageSrc: string | ArrayBuffer;

  isSubmitted: boolean = false;
    files: FileHandle[] = [];
  notificationDetailsid: any;
  editMode = false;
  errorMessageMedia = "";
  
    filesDropped(files: FileHandle[]): void {
      this.files = files;
    }
  
    constructor(
    private validation: Validation,
    private toastyService: ToastyService,
    private router: Router,
    private fileValidator: FileValidator,
    private fb: FormBuilder,
    private notifyService:NotifyService,
    private route:ActivatedRoute
  ) {
    this.notificationForm = fb.group({
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
     status:new FormControl(true,[]),
      media: new FormControl("", []),
      notificationId: new FormControl("", []),
    });
   }
    ngOnInit(){
      this.route.params.subscribe((params:Params) => {
        this.notificationDetailsid = params['notificationDetails._id'];
        this.editMode = params['notificationDetails._id']!=null;
      });
      if(this.editMode){
        this.getNotificationDetails(this.notificationDetailsid);
      }
      else{
        this.notificationForm.removeControl('notificationId');
      }
    }
    getNotificationDetails(id){
      this.loading=true;
      this.notifyService.getNotificationDetails(id).subscribe(next => {
        console.log(next);
       this.loading=false;
       if(next.data.type === "image")
        this.imageSrc= next.data.media?environment.notification_media_large_url + next.data.media : "../../../../assets/images/dummy.jpg";
        else if(next.data.type === "video")
        this.imageSrc= next.data.media?"http://3.21.49.79:6025/uploads/notification_video/"+ next.data.media : "../../../../assets/images/dummy.jpg";
        this.notificationForm.patchValue({
          title:next.data.title,
          description:next.data.description,
          type:next.data.type,
          notificationId:next.data._id,
        })
     });
    }
    resetMedia(){
      this.notificationForm.controls['type'].setValue("text");
      this.notificationForm.controls['media'].setValue("");
      this.imageSrc=null;
    }
    onFormSubmit() {
      this.isSubmitted = true;
      // console.log(this.notificationForm.valid);
      if (this.notificationForm.valid) {
        // this.notificationForm.value.title  = this.notificationForm.value.title.toLowerCase().split(' ');
        // this.notificationForm.value.title = this.notificationForm.value.title.map((str) => (
        //     str.charAt(0).toUpperCase() + str.slice(1)
        //   )).join(' ');
        // this.notificationForm.value.description  = this.notificationForm.value.description.toLowerCase().split(' ');
        // this.notificationForm.value.description = this.notificationForm.value.description.map((str) => (
        //       str.charAt(0).toUpperCase() + str.slice(1)
        //     )).join(' ');
        this.loading = true;
          let params = this.notificationForm.value;
          let formData: FormData = new FormData();
    
          for (let key in params) {
              formData.append(key, params[key]);
              console.log(key,params[key]);
          }
          if(this.isMediaSelected) {
            // formData.delete("media");
            formData.set("media", this.media);
          }
        if(this.editMode){
          this.notifyService.updateNotification(formData)
          .subscribe(next => {
              this.loading = false;
              this.isSubmitted = false;
              console.log("next",next.status_code)
              if (next.status_code == 200) {
                this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
                this.router.navigate(["/notification/"]);
              } else {
                this.addToast({title:'Error', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
              }
            },
            error => {
              this.loading = false;
              this.isSubmitted = false;
              this.addToast({title:'Error', msg:error.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
            })
            return;
        }
        this.notifyService.createNotification(formData)
          .subscribe(next => {
              this.loading = false;
              this.isSubmitted = false;
              console.log("next",next.status_code)
              if (next.status_code == 200) {
                this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
                this.router.navigate(["/notification/"]);
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
      let file = e.target.files[0];
      if(file.type == "video/mp4" && file.size > 5120000){
        this.errorMessageMedia = "Video Size Should be Less than 5mb";
        return
      }
      if((file.type == "image/png" || file.type === "image/jpg" || file.type === "image/jpeg") && file.size > 2048000){
        this.errorMessageMedia = "Image Size Should be Less than 2mb";
        return
      }
      this.errorMessageMedia = "";
      if (e.target.files.length > 0 && e.target.files[0]) {
        this.loading = true;
        this.isMediaSelected = true;
        if (file) {
          if (!this.fileValidator.validateImage(file.name)) {
            this.mediaExtentionError = true;
          } else {
            this.mediaExtentionError = false;
            const reader = new FileReader();
                reader.onload = e => {
                  this.imageSrc = reader.result
                  this.loading = false;
                };
                reader.readAsDataURL(file);
            };
            if(file.type == "video/mp4"){
             this.notificationForm.controls['type'].setValue("video");
            }
            else if(file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg"){
             this.notificationForm.controls['type'].setValue("image");
            } else {
              this.mediaExtentionError = true;
            }
            this.media = file;
          }
        }
      else {
        this.media = "";
        this.isMediaSelected = false;
        this.mediaExtentionError = false;
      }
    }
  }