import React from "react";
import { Switch } from "react-router-dom";
import Route from './Route';

import Redeem from "../pages/voucherRedeem";
import AddVoucher from '../pages/voucherAdd';
import VoucherList from '../pages/voucherList';

export default function Routes() {
  return (
    <Switch>
      <Route path="/voucherRedeem" component={Redeem} />
      <Route path="/voucherAdd" component={AddVoucher} />
      <Route path="/voucherListing" component={VoucherList} />
      <Route component={Redeem} />
    </Switch>
  );
}
