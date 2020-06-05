const mongoose = require ('mongoose');
const uniqueValidator = require ('mongoose-unique-validator');
const voucherLog_schema = new mongoose.Schema ({
    usageActivity:{
      type: String,
      required: 'Usage Activity is required',
    },
    AddedDate: {
      type: String,
      default: Date.now,
    }
});
voucherLog_schema.plugin (uniqueValidator);
module.exports = mongoose.model ('VoucherLog', voucherLog_schema);
