const router = require("express").Router();
const mongoose = require("mongoose");
const Voucher = mongoose.model("Voucher");
const VoucherLog = mongoose.model("VoucherLog");

router.post("/add", async (req, res) => {
    const newVoucher = new Voucher();
    const newVoucherLog = new VoucherLog;

    newVoucher.voucherCode = req.body.voucherCode;
    newVoucher.voucherPIN = req.body.voucherPin;
    newVoucher.voucherAmount = req.body.voucherAmount;
    newVoucher.email = req.body.email;
    newVoucher.status = 'active';

    if(await newVoucher.save()){
      newVoucherLog.usageActivity = req.body.utilized;

      if(await newVoucherLog.save()){
          await newVoucher.voucherLogId.push(newVoucherLog._id);
          await newVoucher.save((err, response) => {
            if (err) {
              res.send(err);
            } else {
              res.send(response);
            }
          })
      }
    }
});

router.post("/check", async (req, res) => {
  const checkVoucherValidity = await Voucher.find({ email: req.body.email, voucherPIN: req.body.voucherPin}).populate('voucherLogId');
  res.send(checkVoucherValidity);
});

router.post("/redeem", async (req, res) => {
    const newVoucherLog = new VoucherLog;

    newVoucherLog.usageActivity = req.body.voucherAmount

    if(await newVoucherLog.save()){
      const voucherData = await Voucher.findOne({ _id: req.body.voucherId});
      await voucherData.voucherLogId.push(newVoucherLog._id);
      voucherData.status = req.body.status;

      await voucherData.save((err, response) => {
        if (err) {
          res.send(err);
        } else {
          res.send(response);
        }
      });

    }
 });

 router.get("/fetch", async (req, res) => {
   const fetchAll = await Voucher.find().populate('voucherLogId');
   res.send(fetchAll);
 });

module.exports = router;
