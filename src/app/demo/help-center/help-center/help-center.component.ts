import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../helper/validation';
import { DriverService, HelpCenterService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html'
})
export class HelpCenterComponent implements OnInit {

  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  action: string = 'view';
  position = 'bottom-right';
  helpCenterForm: FormGroup;
  isSubmitted: boolean = false;
  extension: any;
  helpCenterData: any = {};
  help_center_id!:string;
  editMode = false;
  edit = true;
  countries: any;

  constructor(
    private validation: Validation,
    private helpCenterService: HelpCenterService,
    private toastyService: ToastyService,
    private router: Router,
    private route: ActivatedRoute,
    private driverService : DriverService
  ) { }

  ngOnInit() {
    this.helpCenterForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.pattern(this.validation.email)]),
      phoneNumber: new FormControl("", [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(this.validation.integer)]),
      countryCode: new FormControl("", [Validators.required]),
    });
    this.route.params.subscribe((params:Params) => {
        this.help_center_id = params['help_center_id'];
        this.editMode = params['help_center_id']!=null;
    });
    this.getAllCountries();
    if(this.editMode)
        this.getHelpCenterDetails();
  }
  getHelpCenterDetails() {
    this.loading = true;
    let helpCenterData = {
      'help_center_id': this.help_center_id
    }
    this.helpCenterService.getHelpCenterDetails(helpCenterData).subscribe(
      respone => {
        this.loading = false;
        this.helpCenterData = respone.data;
        console.log(this.helpCenterData);
        this.helpCenterForm.setValue({
          email: this.helpCenterData.email,
          phoneNumber: this.helpCenterData.phoneNumber.includes(" ")?this.helpCenterData.phoneNumber.split(" ")[1]:this.helpCenterData.phoneNumber,
          countryCode: this.helpCenterData.phoneNumber.includes(" ")?this.helpCenterData.phoneNumber.split(" ")[0]:"+34",
        });
      },
      error => {
        this.loading = false;
        this.addToast({title:'Error', msg:error.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
      }
    );
}

onEdit() {
  this.edit = false;
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

  onFormSubmit() {
    this.isSubmitted = true;
    if (this.helpCenterForm.valid) {
      this.loading = true;
      this.helpCenterForm.value.phoneNumber = this.helpCenterForm.value.countryCode + " " + this.helpCenterForm.value.phoneNumber;
      // console.log(this.helpCenterForm.value);
      // return 
      if(this.editMode){
        this.helpCenterForm.value.help_center_id = this.help_center_id;
        this.helpCenterService.editHelpCenter(this.helpCenterForm.value)
          .subscribe(next => {
              this.loading = false;
              this.isSubmitted = false;
              if (next.status_code == 200) {
                this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
                this.router.navigate(["/help-center/"]);
              } else {
                this.addToast({title:'Error', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
              }
            },
            error => {
              this.loading = false;
              this.isSubmitted = false;
              this.addToast({title:'Error', msg:error.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
            })
        return
      }
      this.helpCenterService.addHelpCenterDetails(this.helpCenterForm.value)
        .subscribe(next => {
          this.loading = false;
          this.isSubmitted = false;
          if (next.status_code == 200) {
            this.addToast({ title: 'Success', msg: next.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'success' });
            this.router.navigate(["/help-center/"]);
          } else {
            this.addToast({ title: 'Error', msg: next.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
          }
        },
          error => {
            this.loading = false;
            this.isSubmitted = false;
            this.addToast({ title: 'Error', msg: error.message, timeout: 5000, theme: 'default', position: 'bottom-right', type: 'error' });
          })
    }
  }
  getAllCountries() {
    this.loading = true;
    this.driverService.getAllCountries().subscribe(
      (respone) => {
        this.loading = false;
        let resData = JSON.parse(JSON.stringify(respone));
        this.countries = resData.data.countries;
        console.log(this.countries);
        this.helpCenterForm.patchValue({
          countryCode: this.countries[0].phoneCode,
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
  }
}
