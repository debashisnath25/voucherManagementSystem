import React,{Component} from 'react';
import { Helmet } from 'react-helmet';
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import axios from 'axios';

export default class VoucherRedeem extends Component{
    constructor(props){
        super(props);
        this.state= {
            email: '',
            voucherPin : '',
            voucherAmount : 0,
            voucherAddedText : ''
        }
    }

    onChange = e => {
        e.preventDefault();
        this.form.validateFields(e.target);
        const {name,value} = e.target;
        this.setState({
            [name] : value
        });
        
    }
    calculateTotalAmount = (data,currentAmount) => {
        let amount = parseInt(currentAmount);
        data.map((eachData) => {
            amount += parseInt(eachData.usageActivity);
            return null;
        })
        return amount;
    }
    onSubmit = (e) => {
        this.setState({voucherAddedText : ''});
        this.form.validateFields();
        if (this.form.isValid()) {
            e.preventDefault();
            const {email,voucherPin,voucherAmount} = this.state;
            if(voucherAmount <= 1000){
                axios.post('http://localhost:4000/api/voucher/check',{email,voucherPin})
                .then(res => {
                    if(res.status === 200){
                        if(res.data.length > 0){
                            let addedTime = res.data[0].AddedDate;
                            
                            let currentTime = new Date().getTime();
                            let timeDiff =  (currentTime- addedTime)/(1000 * 3600 * 24); 
                            if(timeDiff <= 24) {
                                let lastRedeem = res.data[0].voucherLogId[res.data[0].voucherLogId.length -1].AddedDate;
                                let nextRedeemTimeDiff =  (currentTime - lastRedeem)/(1000 * 60 * 10); 
                                
                                if(nextRedeemTimeDiff < 10){
                                    if(res.data[0].voucherLogId.length <= 5){
                                        let totalCouponAmountUtilized = this.calculateTotalAmount(res.data[0].voucherLogId,voucherAmount);
                                        if(totalCouponAmountUtilized < 1000){
                                            axios.post('http://localhost:4000/api/voucher/redeem',{voucherAmount,voucherId: res.data[0]._id,status:'partiallyRedemmed'})
                                            .then(response => {
                                                if(response.status === 200){
                                                    this.setState({
                                                        voucherAddedText : 'Voucher Applied Successfully....'
                                                    })
                                                }else{
                                                    this.setState({
                                                        voucherAddedText : 'Something went wrong. Please try again...!'
                                                    })
                                                }
                                            })
                                        }else if(totalCouponAmountUtilized === 1000){
                                            axios.post('http://localhost:4000/api/voucher/redeem',{voucherAmount,voucherId: res.data[0]._id,status:'redemmed'})
                                            .then(response => {
                                                if(response.status === 200){
                                                    this.setState({
                                                        voucherAddedText : 'Voucher Applied Successfully....'
                                                    })
                                                }else{
                                                    this.setState({
                                                        voucherAddedText : 'Something went wrong. Please try again...!'
                                                    })
                                                }
                                            })
                                        }else if(totalCouponAmountUtilized > 1000){
                                            this.setState({
                                                voucherAddedText : 'You have already utilized the total coupon amount...'
                                            })
                                        }
                                    }else{
                                        this.setState({
                                            voucherAddedText : "You have exceeded the total number of times to utilize this coupon."
                                        }) 
                                    }
                                }else{
                                    this.setState({
                                        voucherAddedText : "Please redeem after few minutes..."
                                    })  
                                }
                            }else{
                                this.setState({
                                    voucherAddedText : "Voucher Pin is expired..."
                                }) 
                            }
                        }else{
                            this.setState({
                                voucherAddedText : "Voucher Pin didn't match. Please try again...!"
                            }) 
                        }
                    }else{
                        this.setState({
                            voucherAddedText : 'Something went wrong. Please try again...!'
                        })
                    }
                })
            }else{
                this.setState({
                    voucherAddedText : 'Voucher Amount has exceeded the limit...'
                })
            }
        }
    }

    render(){
        const {voucherAddedText} = this.state;
        return(
            <>
            <Helmet>
                <title> Voucher Redeem | Voucher Management System </title>
            </Helmet>
            <h1>Welcome to the Voucher Redeem Page</h1>
            <div className="container-fluid">
                <section>
                    <div className="container">
                        <div className="col-md-12" style={{backgroundColor:'#ddd',padding:80, border:'2px solid #ccc'}}>
                        <h5>{voucherAddedText}</h5>
                        <FormWithConstraints ref={form => this.form = form}
                                onSubmit={this.onSubmit}
                                method="Post"
                                noValidate> 
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Email Id : </label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="email" className="form-control form-control-solid" name="email" required onChange={this.onChange} />
                                            </div>
                                            <FieldFeedbacks for="email">
                                                <FieldFeedback when="*"  style={{color: 'red'}}/>
                                                <FieldFeedback when={value => /^\s+$/.test(value)}  style={{color: 'red'}} >Invalid email address.</FieldFeedback>
                                                <FieldFeedback when={value => !/\S+@\S+/.test(value)} style={{color: 'red'}}>Invalid email address.</FieldFeedback>
                                            </FieldFeedbacks>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Voucher PIN : </label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" className="form-control form-control-solid" name="voucherPin" required  onChange={this.onChange} />
                                            </div>
                                            <FieldFeedbacks for="voucherPin">
                                                <FieldFeedback when="*"  style={{color: 'red'}}/>
                                            </FieldFeedbacks>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Voucher Amount : </label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" className="form-control form-control-solid" name="voucherAmount" required  onChange={this.onChange} />
                                            </div>
                                            <FieldFeedbacks for="voucherAmount">
                                                <FieldFeedback when="*"  style={{color: 'red'}}/>
                                            </FieldFeedbacks>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <button type="button" onClick={this.onSubmit} className="btn btn-primary btn-block">Redeem Now</button>
                                        </div>
                                    </div>
                                </div>
                            </FormWithConstraints>
                            <label><b>Add more voucher</b> by <a href="/voucherAdd">clicking in here</a>.</label><br />
                            <label><b>View all Vouchers</b> by <a href="/voucherListing">clicking in here</a>.</label>
                        </div>
                    </div>
                </section>
            </div>
            </>
        )
    }
}