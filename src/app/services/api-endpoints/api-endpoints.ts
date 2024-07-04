import { environment } from 'src/environments/environment';

export const APIEndpoints = {
  logtypefeedbackUrl: {
    getEncryptedFirebaseConfig: `${environment.feedbackTrackerUrl}getEncryptedFirebaseConfig`,
    base: `${environment.feedbackTrackerUrl}FeedBackDetails`,
    getAll: function(pageParams:string) {
      return `${this.base}?${pageParams}`;
    },
    byId: function(id: number) {
      return `${this.base}/${id}`;
    },
    staticData: `${environment.feedbackTrackerUrl}GetStaticData`,
    getUserDetails: `${environment.feedbackTrackerUrl}GetUserDetails`,
    inactivateUser: `${environment.feedbackTrackerUrl}InactivateUser`,
    getRoles: `${environment.feedbackTrackerUrl}GetRoles`,
    userDetailsPostAuthentication: `${environment.feedbackTrackerUrl}UserDetailsPostAuthentication`,
    userDetails: `${environment.feedbackTrackerUrl}UserDetails`,
    inactivateTicket: `${environment.feedbackTrackerUrl}InactivateTicket`,
    assigneeReport:(params:string) => `${environment.feedbackTrackerUrl}AssigneeReport?${params}`,
    getOrderNumberSearch:(params:string) => `${environment.feedbackTrackerUrl}OrderNumberSearch?${params}`,
    returnCountReport:(params:string) => `${environment.feedbackTrackerUrl}ReturnCountReport?${params}`,
    sourceCountReport:(params:string) => `${environment.feedbackTrackerUrl}SourceCountReport?${params}`,
    mIOCountReport:(params:string) => `${environment.feedbackTrackerUrl}MIOCountReport?${params}`,
    canadaCountReport:(params:string) => `${environment.feedbackTrackerUrl}CanadaCountReport?${params}`,
    complaintTypeCountReport:(params:string) => `${environment.feedbackTrackerUrl}ComplaintTypeCountReport?${params}`,
    complaintCountReport:(params:string) => `${environment.feedbackTrackerUrl}ComplaintCountReport?${params}`,
    skuCountReport:(params:string) => `${environment.feedbackTrackerUrl}SkuCountReport?${params}`,
    getShipStationOrderByOrderId:(id:number) => `${environment.feedbackTrackerUrl}getShipStationOrderByOrderId?order_number=${id}`,
    returnsDetails: `${environment.feedbackTrackerUrl}ReturnsDetails`,
    returnsDetailsbyParams:function(pageParams:string){
      return `${this.returnsDetails}?${pageParams}`;
    },
    returnsDetailsbyId:function(id:number){
      return `${this.returnsDetails}/${id}`;
    },
    getShipStationStores: `${environment.feedbackTrackerUrl}getShipStationStores`,
    inactivateReturnsTicket: `${environment.feedbackTrackerUrl}InactivateReturnsTicket`,
    getOssOrderId:(id:number) => `${environment.feedbackTrackerUrl}GetOssOrderId?user_id=${id}`,
    welcomeLogCallsDetails: `${environment.feedbackTrackerUrl}WelcomeLogCallsDetails`,
    welcomeLogCallsDetailsbyId:function(id:number){
      return `${this.welcomeLogCallsDetails}/${id}`;
    },
    welcomeLogCallsDetailsbyParams:function(params:string){
      return `${this.welcomeLogCallsDetails}?${params}`;
    },
    welcomeLogsVollumeCallCountByParams: (params:string) => `${environment.feedbackTrackerUrl}VolumeOfCallsReport?${params}`,
    distributionOfCallsReport: (params:string) => `${environment.feedbackTrackerUrl}DistributionOfCallsReport?${params}`,
    engagementLevelsOfCallsReport: (params:string) => `${environment.feedbackTrackerUrl}EngagementLevelsOfCallsReport?${params}`,
    sKUBasedEngagementLevelsOfCallsReport: (params:string) => `${environment.feedbackTrackerUrl}SKUBasedEngagementLevelsOfCallsReport?${params}`,
    sKUBasedPickedUpCallsReport: (params:string) => `${environment.feedbackTrackerUrl}SKUBasedPickedUpCallsReport?${params}`,
  },
  shopifyUrl:{
    base:`${environment.ShopifyUrl}`,
    getByparams:(params:string) => `${environment.ShopifyUrl}${params}`,
    sku:`${environment.ShopifyUrl}SKU`
  }
};
