const baseUrl = 'https://us-central1-copper-imprint-246119.cloudfunctions.net/';
const shopifyBaseUrl = 'https://admin.shopify.com/store/honest-ppe-supply/';
export const environment = {
  production: true,
  ShopifyUrl:`${baseUrl}ShopifyOrderService/`,
  feedbackTrackerUrl:`${baseUrl}LogTypeFeedbackDetails/`,
  storageKey:'staticData',
  ShopifyOrderURL:`${shopifyBaseUrl}orders/`,
  ShopifyCustomerURL:`${shopifyBaseUrl}customers/`,
  WalmartURL:'https://seller.walmart.com/order-management/details?orderGroups=Shipped&poNumber=',
  AmazonURL:'https://sellercentral.amazon.com/orders-v3/order/',
};
