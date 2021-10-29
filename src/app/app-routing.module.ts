import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { UserAuth } from './demo/policy';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [UserAuth],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: './demo/dashboard/dashboard.module#DashboardModule',
        data: {
          permissions: {
            only: ['DASHBOARD'],
            ActivatedRoute
          }
        }
      },
     
      {
        path: 'change-password',
        loadChildren: './demo/change-password/change-password.module#ChangePasswordModule',
        data: {
          permissions: {
            only: ['CHANGE_PASS']
          }
        }
      },
      {
        path: 'dispatcher',
        loadChildren: './demo/dispatcher/dispatcher.module#DispatcherModule',
        data: {
          permissions: {
            only: ['DISPATCHER']
          }
        }
      },
      {
        path: 'logout',
        loadChildren: './demo/logoutModal/logout-modal.module#LogoutModalModule',
        data: {
          permissions: {
            only: ['LOGOUT_MODAL']
          }
        }
      },
      {
      path: 'promotion-code',
      loadChildren: './demo/promotion-code/promotion-code.module#PromotionCodeModule',
      data: {
        permissions: {
          only: ['PROMOTION_CODE']
        }
      }
    },
    {
      path: 'reward',
      loadChildren: './demo/rewards/reward.module#RewardModule',
      data: {
        permissions: {
          only: ['REWARD']
        }
      }
    },
    // {
    //   path: 'call-center',
    //   loadChildren: './demo/call-center/call-center.module#CallCenterModule',
    //   data: {
    //     permissions: {
    //       only: ['CALL_CENTER']
    //     }
    //   }
    // },
    {
      path: 'recycle-bin',
      loadChildren: './demo/recycle-bin/recycle-bin.module#RecycleBinModule',
      data: {
        permissions: {
          only: ['RECYCLE_BIN']
        }
      }
    },
    {
        path: 'passenger',
        loadChildren: './demo/passenger/passenger.module#PassengerModule',
        data: {
          permissions: {
            only: ['PASSENGER']
          }
        }
      },
      {
        path: 'driver-management-promoter',
        loadChildren: './promoters/driverManagement/driver.module#DriverModule',
        data: {
          permissions: {
            only: ['DRIVER_MANAGEMENT_PROMOTER']
          }
        }
      },
      // Vehicle Owner 
      {
        path: 'driver-management-owner',
        loadChildren: './vehicleOwners/driverManagement/driver.module#DriverModule',
        data: {
          permissions: {
            only: ['DRIVER_MANAGEMENT_OWNER']
          }
        }
      },
      {
        path: 'vehicle-owner-management',
        loadChildren: './vehicleOwners/vehicleOwnerManagement/vehicle.module#VehicleModule',
        data: {
          permissions: {
            only: ['VEHICLE_OWNER_MANAGEMENT']
          }
        }
      },
      {
        path: 'insurance',
        loadChildren: './vehicleOwners/insurance/insurance.module#InsuranceModule',
        data: {
          permissions: {
            only: ['VEHICLE_OWNER_MANAGEMENT']
          }
        }
      },
      {
        path: 'driver',
        loadChildren: './demo/driver/driver.module#DriverModule',
        data: {
          permissions: {
            only: ['DRIVER']
          }
        }
      },
      {
        path: 'vehicle',
        loadChildren: './demo/vehicle/vehicle.module#VehicleModule',
        data: {
          permissions: {
            only: ['VEHICLE']
          }
        }
      },
      {
        path: 'help-center',
        loadChildren: './demo/help-center/help-center.module#HelpcenterModule',
        data: {
          permissions: {
            only: ['HELP_CENTER']
          }
        }
      },
      {
        path: 'emergency',
        loadChildren: './demo/emergency/emergency.module#EmergencyModule',
        data: {
          permissions: {
            only: ['EMERGENCY']
          }
        }
      },
      {
        path: 'billing-plan',
        loadChildren: './demo/billing-plan/billing-plan.module#BillingplanModule',
        data: {
          permissions: {
            only: ['BILLING_PLANS']
          }
        }
      },
      {
        path: 'operator',
        loadChildren: './demo/operator/operator.module#OperatorModule',
        data: {
          permissions: {
            only: ['OPERATOR']
          }
        }
      },
      {
        path: 'vehicle-owner',
        loadChildren: './demo/vehicle-owner/vehicle-owner.module#VehicleOwnerModule',
        data: {
          permissions: {
            only: ['VEHILCE_OWNER']
          }
        }
      },
      {
        path: 'credit',
        loadChildren: './demo/credit/credit.module#CreditModule',
        data: {
          permissions: {
            only: ['CREDIT']
          }
        }
      },
      {
        path: 'ride',
        loadChildren: './demo/driver-ride/driver-reward.module#DriverRewardModule',
        data: {
          permissions: {
            only: ['RIDES_HISTORY']
          }
        }
      },
      {
        path: 'rides',
        loadChildren: './demo/passenger-ride/passenger-ride.module#PassengerRideModule',
        data: {
          permissions: {
            only: ['RIDES_HISTORY']
          }
        }
      },
      {
        path: 'history',
        loadChildren: './demo/total-rides-history/ride-history.module#RideHistoryModule',
        data: {
          permissions: {
            only: ['RIDES_HISTORY']
          }
        }
      },
      {
        path: 'reward',
        loadChildren: './demo/drivers-reward/driver-rewards.module#DriverRewardsModule',
        data: {
          permissions: {
            only: ['REWARD_HISTORY']
          }
        }
      },
      {
        path: 'reward',
        loadChildren: './demo/passangers-reward/passanger-rewards.module#PassangerRewardModule',
        data: {
          permissions: {
            only: ['REWARD_HISTORY']
          }
        }
      },
      {
        path: 'hierarchy',
        loadChildren: './demo/system-hierarchy/driver-hierarchy.module#DriverHierarchyModule',
        data: {
          permissions: {
            only: ['HIERARCHY_HISTORY']
          }
        }
      },
      {
        path: 'hierarchys',
        loadChildren: './demo/system-hierarchy-two/passenger-hierarchy.module#PassengerHierarchyModule',
        data: {
          permissions: {
            only: ['HIERARCHY_HISTORY']
          }
        }
      },
      {
        path: 'referral',
        loadChildren: './demo/driver-refferal-earnings/driver-refferal-earnings.module#DriverRefferalEarningModule',
        data: {
          permissions: {
            only: ['REFFERAL_EARNING']
          }
        }
      },
      {
        path: 'referrals',
        loadChildren: './demo/passenger-refferal-earnings/passenger-refferal-earnings.module#PassengerRefferalEarningsModule',
        data: {
          permissions: {
            only: ['REFFERAL_EARNING']
          }
        }
      },
      
      {
        path: 'location',
        loadChildren: './demo/driver-location/driver-location.module#DriverLocationModule',
        data: {
          permissions: {
            only: ['LOCATION']
          }
        }
      },
      {
        path: 'locations',
        loadChildren: './demo/passenger-location/passenger-location.module#PassengerLocationModule',
        data: {
          permissions: {
            only: ['LOCATION']
          }
        } 
      },
      {
        path: 'user',
        loadChildren: './demo/user/user.module#UserModule',
        data: {
          permissions: {
            only: ['USER_MANAGEMENT']
          }
        }
      },
      {
        path: 'user-group',
        loadChildren: './demo/user-group/user-group.module#UserGroupModule',
        data: {
          permissions: {
            only: ['USER_MANAGEMENT']
          }
        }
      },
      // {
      //   path: 'notification',
      //   loadChildren: './demo/driver-notification/driver-notification.module#DriverNotificationModule',
      //   data: {
      //     permissions: {
      //       only: ['NOTIFY']
      //     }
      //   }
      // },
      // {
      //   path: 'notification',
      //   loadChildren: './demo/passenger-notification/passenger-notification.module#PassengerNotificationsModule',
      //   data: {
      //     permissions: {
      //       only: ['NOTIFY']
      //     }
      //   }
      // },
      {
        path: 'activity',
        loadChildren: './demo/action-logs/action-logs.module#ActionLogsModule',
        data: {
          permissions: {
            only: ['ACTION_LOGS']
          }
        }
      },
      {
        path: 'notification',
        loadChildren: './demo/notification-logs/notification-logs.module#NotificationLogsModule',
        data: {
          permissions: {
            only: ['NOTIFICATION_LOGS']
          }
        }
      },
      {
        path: 'admins',
        loadChildren: './demo/setting/setting.module#SettingModule',
        data: {
          permissions: {
            only: ['SETTING_PERMISSION']
          }
        }
      },
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        loadChildren: './demo/login/login.module#LoginModule'
      },
      {
        path: 'forgot-password',
        loadChildren: './demo/forgot-password/forgot-password.module#ForgotPasswordModule'
      },
      {
        path: 'privacy-policy',
        loadChildren: './demo/privacy-policy/privacy-policy.module#PrivacyPolicyModule'
      },
      {
        path: 'terms-condition',
        loadChildren: './demo/terms-condition/terms-condition.module#TermsConditionModule'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
