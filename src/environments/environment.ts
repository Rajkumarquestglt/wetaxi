// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// ng build --prod --aot --vendor-chunk --common-chunk --delete-output-path --buildOptimizer
export const environment = {
  production: false,
  // apiUrl: 'http://202.131.117.92:7025/admin_v1/',
  // apiUrl: 'http://localhost:7025/admin_v1/',
  // apiUrl: 'http://192.168.2.251:7025/admin_v1/',
  // profileImageUrl: 'http://202.131.117.92:7025/uploads/profile_picture/large/',
  // vehicleImageUrl: 'http://202.131.117.92:7025/uploads/vehicle_photos/large/',
  // vehicleTypeImageUrl: 'http://202.131.117.92:7025/uploads/vehicle_types/',
  // countryFlagUrl: 'http://202.131.117.92:7025/uploads/country_flags/',
  apiUrl: "http://3.21.49.79:6025/admin_v1/",
  apiUrlPromoter: "http://3.21.49.79:6025/promoter/",
  apiUrlVo: "http://3.21.49.79:6025/Vo/",

// apiUrl: "http://localhost:7025/admin_v1/",
  // apiUrl: 'https://api.gogotaxiapps.com/admin_v1/',
  profileImageUrl:"http://3.21.49.79:6025/uploads/profile_picture/large/",
  // profileImageUrl:"https://api.gogotaxiapps.com/uploads/profile_picture/large/",
  // vehicleImageUrl: "https://api.gogotaxiapps.com/uploads/vehicle_photos/large/",
  vehicleImageUrl: "http://3.21.49.79:6025/uploads/vehicle_photos/large/",
  notification_media_large_url:"http://3.21.49.79:6025/uploads/notification_media/large/",
  vehicleTypeImageUrl: "http://3.21.49.79:6025/uploads/vehicle_types/",
  countryFlagUrl: "http://3.21.49.79:6025/uploads/country_flags/",
  reward_media_large_url:"http://3.21.49.79:6025/uploads/reward_media/large/",

  adminPermission: [
    "DASHBOARD",
    "DISPATCHER",
    "PASSENGER",
    "CHANGE_PASS",
    "DRIVER",
    "PROMOTION_CODE",
    "REWARD",
    "USER_MANAGEMENT",
    "LOCATION",
    "RECYCLE_BIN",
    "VEHICLE",
    "HELP_CENTER",
    "EMERGENCY",
    "CALL_CENTER",
    "BILLING_PLANS",
    "OPERATOR",
    "VEHILCE_OWNER",
    "CREDIT",
    "DRIVER_RIDE",
    "PASSENGER_RIDE",
    "RIDES_HISTORY",
    "REWARD_HISTORY",
    "SETTING_PERMISSION",
    "HIERARCHY_HISTORY",
    "REFFERAL_EARNING",
    "NOTIFY",
    "ACTION_LOGS",
    "ADMIN",
    "NOTIFICATION_LOGS",
    "LOGOUT_MODAL"
  ],
  operatorPermission: [
    "DASHBOARD",
    "CHANGE_PASS",
    "DRIVER_MANAGEMENT_OWNER",
    "VEHICLE_OWNER_MANAGEMENT",
    "INSURANCE",
    "LOGOUT_MODAL"
  ],
  promoterPermission: [
    "DASHBOARD",
    "CHANGE_PASS",
    "DRIVER_MANAGEMENT_PROMOTER",
    "VEHILCE_OWNER",
    "REFERRAL_HIERARCHY",
    "REFFERAL_EARNING_PROMOTER",
    "LOGOUT_MODAL"
  ],
  // operatorPermission: ["PASSENGER", "DRIVER", "CREDIT"],
  default_map_zoom: 12
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
