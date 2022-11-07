const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Realtime = new Schema({
  request: {
    type: String,//request url
  },
  level: {
    type: Number,//1:regitration_add-remove,2:registration_update,3:leave_add-remove,4:leave-update,5:roaster_edit
  }, 
  status: {
    type: Number,//1:request,2:approve,3:reject,4:admin edit
  }, 
  data: {
    type: Object,//request data
  },
});

module.exports = mongoose.model("Realtime", Realtime);
