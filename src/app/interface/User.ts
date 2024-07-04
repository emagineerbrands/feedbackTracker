export interface User{
  id:number,
  name:string,
  email:string,
  role_id:number[],
  roles:string[],
  page_names:string[],
  page_links:string[],
  page_ids:number[],
  page_icons:string[],
  role_value:string[],
  isAuthenticated:boolean,

};
