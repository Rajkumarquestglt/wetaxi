import { Component, EventEmitter, OnInit, Output, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { AuthService, DriverService } from "src/app/demo/services";
import { environment } from "src/environments/environment";

@Component({
    selector: 'list-driver-VO',
    templateUrl: './list-driver-VO.html'
})
export class ListDriverVOComponent implements OnInit {
    @Output() close = new EventEmitter<void>();
    public loading = false;
    public primaryColour = "#ffffff";
    public secondaryColour = "#ffffff";
    vehicleID:number;
    drivers:any;
    driverslist:any;
    profilePhotoUrl: string;
    @ViewChild(DataTableDirective)
    dtElement: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    constructor(
        private driverService: DriverService,
        private authService: AuthService,
    ){}
    ngOnInit(): void {
        this.profilePhotoUrl = environment.profileImageUrl;
        this.authService.clearDataTableData("DataTables_driver_management");
        this.loading = true;
        this.driverService.ListOfAllDriversVo(null).subscribe(
            (resp) => {
                this.loading = false;
                this.drivers = resp.data;
                // console.log(resp.data);
            },
            (error) => {
                this.loading = false;
            }
        );
        // this.driverslist = [{autoIncrementId:1,username:"chirag",name:"chirag katrodiya",src:"/assets/images/profile-dummy.png"},{autoIncrementId:2,username:"ronak",name:"ronak kathiriya",src:"/assets/images/profile-dummy.png"},{autoIncrementId:3,username:"smit",name:"smit hapani",src:"/assets/images/profile-dummy.png"}];
        // this.drivers = this.driverslist;
    }
    onClose(){
        this.close.emit();
    }
    assignDriver(i:number){
        console.log("vehicleID",this.vehicleID);
        this.loading = true;
        this.driverslist = this.driverslist.filter((driver,index) => {
            return driver.autoIncrementId!==i
        })
        setTimeout(() => {
            this.loading = false;
            this.onClose();
        },2000)
    }
    searchDriver(event){
        this.drivers = [];
        event.target.value = event.target.value.replace(/\s+/g,' ');
        for(var i of this.driverslist){
            if(i.name.includes(event.target.value) || i.username.includes(event.target.value)){
                this.drivers.push(i);
            }
        }
    }
}