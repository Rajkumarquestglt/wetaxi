import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../helper/validation';
import { BillingPlanService } from '../../services';
import { ToastData, ToastOptions, ToastyService } from 'ng2-toasty';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'view-billing-plan',
  templateUrl: './view-billing-plan.component.html',
})
export class ViewBillingplanComponent implements OnInit {

  public loading = false;
  public primaryColour = "#ffffff";
  public secondaryColour = "#ffffff";
  action: string = 'view';
  position = 'bottom-right';
  viewBillingPlanForm: FormGroup;
  isSubmitted: boolean = false;
  billingPlanData: any = {};
  billing_plan_id: any;

  constructor(
    private validation:Validation,
    private billingPlanService: BillingPlanService,
    private toastyService: ToastyService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    
    this.viewBillingPlanForm = new FormGroup({
      name: new FormControl("", [
        Validators.required,
        Validators.pattern(this.validation.alphabaticOnly),
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
    
      details: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]),
     
      billingType: new FormControl('', [Validators.required]),
      // chargePercentage: new FormControl('', []),
      chargeAmt: new FormControl('', [])
    });
    this.route.params.subscribe(params => {
      this.billing_plan_id = params.billing_plan_id;
    });
    this.getBillingPlanDetails();
  }
  ngAfterViewInit(): void {
// Menu Active process Start
// for(var i=0;i<document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item").length;i++)
// {
//   document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[i].getElementsByTagName("li")[0].className = "ng-star-inserted"
// }
// document.getElementsByClassName("nav pcoded-inner-navbar")[0].getElementsByTagName("app-nav-item")[10].getElementsByTagName("li")[0].className = "ng-star-inserted active"
// menu Active Process End
  }
  getBillingPlanDetails() {
      this.loading = true;
      let billingPlanData = {
        'billing_plan_id': this.billing_plan_id
      }
      this.billingPlanService.getBillingPlanDetails(billingPlanData).subscribe(
        respone => {
          this.loading = false;
          this.billingPlanData = respone.data;
          if(this.billingPlanData.billingType == 'cash' || this.billingPlanData.billingType == 'percentage') {
            this.viewBillingPlanForm.get('chargeAmt').setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(9), Validators.pattern(this.validation.integer)]);
            this.viewBillingPlanForm.get('chargeAmt').updateValueAndValidity({ emitEvent: false });
            // this.viewBillingPlanForm.get('chargePercentage').setValidators([])
            // this.viewBillingPlanForm.get('chargePercentage').updateValueAndValidity({ emitEvent: false });
          } else {
            this.viewBillingPlanForm.get('chargeAmt').setValidators([]);
            this.viewBillingPlanForm.get('chargeAmt').updateValueAndValidity({ emitEvent: false });
            // this.viewBillingPlanForm.get('chargePercentage').setValidators([Validators.required, Validators.min(1), Validators.max(100), Validators.pattern(this.validation.integer)])
            // this.viewBillingPlanForm.get('chargePercentage').updateValueAndValidity({ emitEvent: false });
          }
          this.viewBillingPlanForm.setValue({
            name: this.billingPlanData.name,
            // name_ch: this.billingPlanData.name.zh,
            // name_kh: this.billingPlanData.name.km,
            details: this.billingPlanData.details,
            // detail_ch: this.billingPlanData.details.zh,
            // detail_kh: this.billingPlanData.details.km,
            billingType: this.billingPlanData.billingType,
            // chargePercentage: this.billingPlanData.billingType == 'percentage' ? this.billingPlanData.chargeAmt : 0,
            chargeAmt: this.billingPlanData.billingType == 'cash' || this.billingPlanData.billingType == 'percentage' ? this.billingPlanData.chargeAmt : 0
          });
        },
        error => {
          this.loading = false;
          this.addToast({title:'Error', msg:error.message, timeout: 5000, theme:'default', position:'bottom-right', type:'error'});
        }
      );
  }

  

  onTypeChange() {
    if(this.viewBillingPlanForm.value.billingType == 'cash') {
      this.viewBillingPlanForm.get('chargeAmt').setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(9), Validators.pattern(this.validation.integer)]);
      this.viewBillingPlanForm.get('chargeAmt').updateValueAndValidity({ emitEvent: false });

      this.viewBillingPlanForm.patchValue({
        chargeAmt: ''
      })
    } else {
      this.viewBillingPlanForm.get('chargeAmt').setValidators([]);
      this.viewBillingPlanForm.get('chargeAmt').updateValueAndValidity({ emitEvent: false });

      this.viewBillingPlanForm.patchValue({
        chargePercentage: ''
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
    if (this.viewBillingPlanForm.valid) {
      this.loading = true;
      this.viewBillingPlanForm.value.billing_plan_id = this.billing_plan_id;
      if(this.viewBillingPlanForm.value.billingType == 'cash' ) {
        this.viewBillingPlanForm.value.chargeAmt = this.viewBillingPlanForm.value.chargeAmt;
      } else {
        this.viewBillingPlanForm.value.chargeAmt = this.viewBillingPlanForm.value.chargeAmt;
      }

      let name:any = {};
      name = this.viewBillingPlanForm.value.name;

      let details:any = {};
      details = this.viewBillingPlanForm.value.details;
   

      this.viewBillingPlanForm.value.name = name;
      this.viewBillingPlanForm.value.details = details;


      delete this.viewBillingPlanForm.value.names;
   
      this.billingPlanService.editBillingPlan(this.viewBillingPlanForm.value)
        .subscribe(next => {
            this.loading = false;
            this.isSubmitted = false;
            if (next.status_code == 200) {
              this.addToast({title:'Success', msg:next.message, timeout: 5000, theme:'default', position:'bottom-right', type:'success'});
              this.router.navigate(["/billing-plan/"]);
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

