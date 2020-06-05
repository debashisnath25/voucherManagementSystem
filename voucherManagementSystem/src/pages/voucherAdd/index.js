import React,{Component} from 'react';
import { Helmet } from 'react-helmet';
import { FormWithConstraints, FieldFeedbacks, FieldFeedback } from 'react-form-with-constraints';
import axios from 'axios';

function newRandomString(length){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
     
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
     
    return text;
}

export default class VoucherAdd extends Component{
    constructor(props){
        super(props);
        this.state= {
            email: '',
            voucherPin : '',
            voucherCode: '',
            voucherAmount: '1000',
            utilized: 0,
            voucherAddedText: ''
        }
    }

    componentDidMount(){
        let voucherCode = 'VCD'+newRandomString(10);
        let voucherPin = newRandomString(5);
        this.setState({
            voucherCode, voucherPin
        })
    }

    

    onChange = e => {
        e.preventDefault();
        this.form.validateFields(e.target);
        const {name,value} = e.target;
        this.setState({
            [name] : value
        });
        
    }
    onSubmit = (e) => {
        this.form.validateFields();
        if (this.form.isValid()) {
            e.preventDefault();
            const {email,voucherPin,voucherCode,voucherAmount,utilized} = this.state;
            axios.post('http://localhost:4000/api/voucher/add', {email,voucherPin,voucherCode,voucherAmount,utilized})
            .then(res => {
                if(res.status === 200){
                    this.setState({
                        voucherAddedText : 'Voucher Added Successfully...'
                    })
                }else{
                    this.setState({
                        voucherAddedText : 'Voucher Addition Failed...'
                    })
                }
            })
        }
    }

    render(){
        const {voucherCode,voucherPin,voucherAmount,voucherAddedText} = this.state;
        return(
            <>
            <Helmet>
                <title> Voucher Add | Voucher Management System </title>
            </Helmet>
            <h1>Welcome to the Voucher Add Page</h1>
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
                                                <label>Voucher Code : </label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" className="form-control form-control-solid" name="voucherCode" required value={voucherCode} readOnly disabled/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Voucher PIN : </label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" className="form-control form-control-solid" name="voucherPin" required  value={voucherPin} readOnly disabled/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Voucher Amount : </label>
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" className="form-control form-control-solid" name="voucherAmount" required  value={voucherAmount} readOnly disabled/>
                                            </div>
                                        </div>
                                    </div>
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
                                            <button type="button" onClick={this.onSubmit} className="btn btn-primary btn-block">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </FormWithConstraints>
                            <label><b>Redeem voucher</b> by <a href="/voucherRedeem">clicking in here</a>.</label><br />
                            <label><b>View all Vouchers</b> by <a href="/voucherListing">clicking in here</a>.</label>
                        </div>
                    </div>
                </section>
            </div>
            </>
        )
    }
}