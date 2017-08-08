_satellite.pushAsyncScript(function(event, target, $variables){
  _satellite.getVisitorId().setCustomerIDs({
  "userUUID":{
      "id":_satellite.getVar('userUUID'),
      "authState":Visitor.AuthState.AUTHENTICATED
  }
});
});
