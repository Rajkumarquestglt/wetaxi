import { Injectable } from "@angular/core";

export interface NavigationItem {
  id: string;
  title: string;
  type: "item" | "collapse" | "group";
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const NavigationItems = [
  { 
    id: "dashboard",
    title: "DASHBOARD",
    type: "item",
    icon: "feather icon-home",
    url: "/dashboard",
    permissionOnly: "DASHBOARD"
  },
  {
    id: "dispatcher",
    title: "DISPATCHER",
    type: "item",
    icon: "feather icon-monitor",
    url: "/dispatcher/",
    permissionOnly: "DISPATCHER"
  },
  {
    id: "driver",
    title: "DRIVERS",
    type: "item",
    icon: "feather icon-life-buoy",
    url: "/driver/",
    permissionOnly: "DRIVER"
  },
  // promoters 
  {
    id: "driver-management-promoter",
    title: "DRIVER MANAGEMENT",
    type: "item",
    icon: "feather icon-user",
    url: "/driver-management-promoter/",
    permissionOnly:  "DRIVER_MANAGEMENT_PROMOTER"
  },
   {
    id: "passenger",
    title: "PASSENGERS",
    type: "item",
    icon: "feather icon-user",
    url: "/passenger/",
    permissionOnly: "PASSENGER"
  },
  {
    id: "vehicle",
    title: "VEHICLE TYPE",
    type: "item",
    icon: "feather icon-target",
    url: "/vehicle/",
    permissionOnly: "VEHICLE"
  },
  // {
  //   id: "vehicle",
  //   title: "VEHICLE",
  //   type: "item",
  //   icon: "feather icon-target",
  //   url: "/vehicle/",
  //   permissionOnly: "VEHICLE"
  // },
 {
    id: "operator",
    title: "PROMOTERS",
    type: "item",
    icon: "feather icon-clipboard",
    url: "/operator/",
    permissionOnly: "OPERATOR"
  },
  {
    id: "vehicle-owner",
    title: "VEHICLE OWNER",
    type: "item",
    icon: "feather icon-clipboard",
    url: "/vehicle-owner/",
    permissionOnly: "VEHILCE_OWNER"
  }, 
//   {
//     id: "operator",
//     title: "VEHICLE OWNER",
//     type: "item",
//     icon: "feather icon-clipboard",
//     url: "/operator/list-operator/",
//     permissionOnly: "OPERATOR"
//   },
  // {
  //   id: "promotion-code",
  //   title: "PROMOTION CODE",
  //   type: "item",
  //   icon: "feather icon-shopping-cart", 
  //   url: "/promotion-code/",
  //   permissionOnly: "PROMOTION_CODE"
  // },
  {
    id: "Notification Logs",
    title: "NOTIFICATION",
    type: "item",
    icon: "feather icon-navigation",
    url: "/notification/",
    permissionOnly: "NOTIFICATION_LOGS"
  },
  // {
  //       id: "call-center",
  //       title: "CALL CENTER",
  //       type: "item",
  //       icon: "feather icon-help-circle",
  //       url: "/call-center/",
  //       permissionOnly: "CALL_CENTER"
  //     },
//   {
//     id: 'navigation',
//     title: 'Navigation',
//     type: 'group',
//     icon: 'icon-navigation',
//     permissionOnly: "ADMIN",
//     children: [
//       {
//         id: 'Notification',
//         title: 'NOTIFICATION',
//         type: 'collapse',
//         icon: 'feather icon-navigation',
//         permissionOnly: "NOTIFY",
//         children: [
//           {
//             id: "Notification Driver",
//             title: "Driver Notification",
//             type: "item",
//             url: "/notify/list-driver-notification/",
//             permissionOnly: "NOTIFY"
//           },
//           {
//             id: "Notification Passenger",
//             title: "Passenger Notification",
//             type: "item",
//             url: "/notifys/list-passenger-notification/",
//             permissionOnly: "NOTIFY"
//           },
//         ]
//       },

   
//   {
//     id: "call-center",
//     title: "CALL CENTER",
//     type: "item",
//     icon: "feather icon-help-circle",
//     url: "/call-center/",
//     permissionOnly: "CALL_CENTER"
//   },
// {
// id: 'navigation',
//     title: 'Navigation',
//     type: 'group',
//     icon: 'icon-navigation',
//     permissionOnly: "ADMIN",
//     children: [
//       {
//         id: "user-management",
//         title: "USER MANAGEMENT",
//         type: "collapse",
//         icon: "feather icon-users",
//         permissionOnly: "USER_MANAGEMENT",
//         children:[
//           {
//             id: "User",
//             title: "USER",
//             type: "item",
//             url: "/user/",
//             permissionOnly: "USER_MANAGEMENT"
//           },
//           {
//             id: "Users Group",
//             title: "USERS GROUP",
//             type: "item",
//             url: "/user-group/",
//             permissionOnly: "USER_MANAGEMENT"
//           },
//         ]
//       },
//       ]
//     },
 

  // {
  //   id: "billing plan",
  //   title: "BILLING PLAN",
  //   type: "item",
  //   icon: "feather icon-file-text",
  //   url: "/billing-plan/",
  //   permissionOnly: "BILLING_PLANS"
  // },
  // {
  //   id: "credit",
  //   title: "CREDIT",
  //   type: "item",
  //   icon: "feather icon-credit-card",
  //   url: "/credit/",
  //   permissionOnly: "CREDIT"
  // },
  // {
  //   id: 'navigation',
  //   title: 'Navigation',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   permissionOnly: "ADMIN",
  //   children: [
      // {
      //   id: 'Referral Hierarchy',
      //   title: 'REFERRAL HIRARCHY',
      //   type: 'collapse',
      //   icon: 'feather icon-server',
      //   permissionOnly: "HIERARCHY_HISTORY",
      //   children: [
      // //     {
      // //       id: "Hierarchy Driver",
      // //       title: "DRIVER HIERARCHY",
      // //       type: "item",
      // //       url: "/hierarchy/",
      // //       permissionOnly: "HIERARCHY_HISTORY"
      // //     },
      // //     {
      // //       id: "Hierarchy Passenger",
      // //       title: "PASSENGER HIERARCHY",
      // //       type: "item",
      // //       url: "/hierarchys/",
      // //       permissionOnly: "HIERARCHY_HISTORY"
      // //     },
      // //   ]
      // // },
      // // {
      // //   id: 'Referral earnings',
      // //   title: 'REFERRAL EARNING',
      // //   type: 'collapse',
      // //   icon: 'feather icon-calendar',
      // //   permissionOnly: "REFFERAL_EARNING",
      // //   children: [
      // //     {
      // //       id: "earnings Driver",
      // //       title: "DRIVER EARNINGS",
      // //       type: "item",
      // //       url: "/refferal/",
      // //       permissionOnly: "REFFERAL_EARNING"
      // //     },
      // //     {
      // //       id: "earnings Passenger",
      // //       title: "PASSENGER EARNINIGS",
      // //       type: "item",
      // //       url: "/refferals/",
      // //       permissionOnly: "REFFERAL_EARNING"
      // //     },
      //   ]
      // },


      // {
      //   id: "location",
      //   title: "LOCATION",
      //   type: "collapse",
      //   icon: "feather icon-map-pin",
      //   permissionOnly: "LOCATION",
      //   children:[
      //     {
      //     id: "Driver Location",
      //     title: "DRIVER LOCATION",
      //     type: "item",
      //     url: "/location/",
      //     permissionOnly: "LOCATION"
      //     },
      //     {
      //       id: "Passenger Location",
      //       title: "PASSENGER LOCATION",
      //       type: "item",
      //       url: "/locations/",
      //       permissionOnly: "LOCATION"
      //       },
      //   ]
      // },
      // {
      //   id: 'Reward',
      //   title: 'REWARD',
      //   type: 'item',
      //   icon: 'feather icon-award',
      //   url: "/reward/",
      //   permissionOnly: "REWARD",
        
      // },
      {
        id: "help center",
        title: "HELP CENTER",
        type: "item",
        icon: "feather icon-help-circle",
        url: "/help-center/",
        permissionOnly: "HELP_CENTER"
      },
     
      {
        id: "emergency",
        title: "EMERGENCY",
        type: "item",
        icon: "feather icon-box",
        url: "/emergency/",
        permissionOnly: "HELP_CENTER"
      },
      {
        id: "setting",
        title: "SETTINGS",
        type: "item",
        icon: "feather icon-sliders",
        url: "/admins/admin-setting/",
        permissionOnly: "SETTING_PERMISSION"
      },
      {
        id: "Action Logs",
        title: "ACTIVITY LOG",
        type: "item",
        icon: "feather icon-file-plus",
        url: "/activity/",
        permissionOnly: "ACTION_LOGS"
      },
      {
        id: "recycle-bin",
        title: "RECYCLE BIN",
        type: "item",
        icon: "feather icon-trash-2",
        url: "/recycle-bin/",
        permissionOnly: "RECYCLE_BIN"
      },

       // Vehicle Owner
       {
        id: "driver-management-owner",
        title: "DRIVER MANAGEMENT",
        type: "item",
        icon: "feather icon-user-plus",
        url: "/driver-management-owner/",
        permissionOnly:  "DRIVER_MANAGEMENT_OWNER"
      },
      {
        id: "vehicle-owner-management",
        title: "VEHICLE MANAGEMENT",
        type: "item",
        icon: "feather icon-user",
        url: "/vehicle-owner-management/",
        permissionOnly: "VEHICLE_OWNER_MANAGEMENT"
      },
      {
          id: 'referral-hierarchy',
          title: 'REFERRAL HIRARCHY',
          type: 'item',
          icon: 'feather icon-server',
          url: "/referral/",
          permissionOnly: "REFERRAL_HIERARCHY",
      },
      {
        id: 'referral-earnings',
        title: 'REFERRAL EARNING',
        type: 'item',
        icon: 'feather icon-calendar',
        url: "/referrals/",
        permissionOnly: "REFFERAL_EARNING_PROMOTER",
      },

     
      // {
      //   id: "driver-management-promoter",
      //   title: "VEHICLE MANAGEMENT",
      //   type: "item",
      //   icon: "feather icon-user-plus",
      //   url: "/vehicle-management/",
      //   permissionOnly:  "VEHICLE_MANAGEMENt_OWNER"
      // }, 
      {
        id: "insurance",
        title: "INSURANCE",
        type: "item",
        icon: "feather icon-wind",
        url: "/insurance/",
        permissionOnly:  "INSURANCE"
      },
      {
        id: "logout",
        title: "LOGOUT",
        type: "item",
        icon: "feather icon-power",
        url: "/logout/",
        permissionOnly: "LOGOUT_MODAL"
      },
 
     

  //   ]
  // },

 
  
 //   {
//     id: 'navigation',
//     title: 'Navigation',
//     type: 'group',
//     icon: 'icon-navigation',
//     permissionOnly: "ADMIN",
//     children: [
    
     

//       {
//         id: 'Ride History',
//         title: 'Ride History',
//         type: 'collapse',
//         icon: 'feather icon-layers',
//         permissionOnly: "RIDES_HISTORY",
//         children: [
//           {
//             id: "Driver ride history",
//             title: "Driver Ride",
//             type: "item",
//             url: "/ride/list-driver-ride/",
//             permissionOnly: "RIDES_HISTORY"
//           },
//           {
//             id: "Passenger ride history",
//             title: "Passenger Ride",
//             type: "item",
//             url: "/rides/list-passenger-ride/",
//             permissionOnly: "RIDES_HISTORY"
//           },
//           {
//             id: "rides history",
//             title: "All Rides",
//             type: "item",
//             url: "/history/ride-history/",
//             permissionOnly: "RIDES_HISTORY"
//           }
//         ]
//       },

  
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
