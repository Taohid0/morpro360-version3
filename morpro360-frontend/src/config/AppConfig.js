const localhost = "https://afe40ebb.ngrok.io";
const server = "";
const host = localhost;

const APPCONFIG = {
  userURL: host + "/user",
  userDetailsURL:host+"/user/details",
  loginURL: host + "/auth/login",
  logoutURL: host + "/auth/logout",
  adminURL: host + "/admin",
  roleURL : host+ "/role",
  loadURL: host + "/load",
  driverURL: host + "/driver",
  bidURL: host + "/bid",
  winningBidsURL : host + "/bid/winning-bids",
  availableLoadURL: host + "/load/available-load",
  companyDriversURL: host + "/driver/company-drivers",
  myBidsURL: host + "/bid/my-bids",
  
  adminLoginURL: host + "/admin/login",
  adminLogoutURL: host + "/admin/logout",
  allUsersURL : host+"/user/all-users",
  activateUserURL : host+"/user/activate",
  deactivateUserURL : host+"/user/deactivate",
  allLoadsAdminURL: host + "/load/all-loads-admin",
  relatedBidsURL :  host+"/load/bids",
  assignBidURL : host+"/bid/assign",
  changeLoadStatusURL : host+"/load/change-status",
  loadDetailsURL : host+"/load/details",
  loadDetailsAllFieldsURL : host+"/load/details/all-fields",

};

export default APPCONFIG;
