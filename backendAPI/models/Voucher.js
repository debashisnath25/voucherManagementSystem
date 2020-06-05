const mongoose = require ('mongoose');
const uniqueValidator = require ('mongoose-unique-validator');
const voucher_schema = new mongoose.Schema ({
    voucherCode: {
      type: String,
      required: 'Voucher Code is Required',
    },
    voucherPIN: {
      type: String,
      required: 'Voucher PIN is Required',
    },
    voucherAmount:{
      type: String,
      required: 'Voucher Amount is required',
    },
    email:{
      type: String,
      required: 'Email is required',
    },
    voucherLogId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VoucherLog',
      }
    ],
    status:{
      type: String,
      enum: [
          'active',
          'partiallyRedemmed',
          'redemmed'
      ],
    },
    AddedDate: {
      type: String,
      default: Date.now,
    }
});
voucher_schema.plugin (uniqueValidator);
module.exports = mongoose.model ('Voucher', voucher_schema);
