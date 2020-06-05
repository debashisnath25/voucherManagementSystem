import React,{Component} from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';

export default class VoucherRedeem extends Component{
    constructor(props){
        super(props);
        this.state= {
            allData : [],
            email: '',
            status: '',
            fullDataSet : [],
            voucherAddedText : ''
        }
    }

    componentDidMount(){
        axios.get('http://localhost:4000/api/voucher/fetch')
        .then(res => {
            this.setState({
                allData : res.data,
                fullDataSet : res.data
            })
        })
    }

    calculateTotalAmount = (data) => {
        let amount = parseInt(0);
        data.map((eachData) => {
            amount += parseInt(eachData.usageActivity);
            return null;
        })
        return amount;
    }

    onChange = e => {
        e.preventDefault();
        const {name,value} = e.target;
        this.setState({
            [name] : value
        });
    }

    filterData = () => {
        const {allData,email,status} = this.state;
        let newData = allData;
        if(email !== ""){
            newData = newData.filter((allDatazz) => {
                return allDatazz.email.toLowerCase().match(email.toLowerCase());
            });
        }
        if(status !== ""){
            newData = newData.filter((allDatazz) => {
                if (allDatazz.status === status){
                    return true;
                }
                return false;
            });
        }
        this.setState({ fullDataSet: newData});
    }

    render(){
        const {voucherAddedText,fullDataSet} = this.state;
        return(
            <>
            <Helmet>
                <title> Voucher Listing | Voucher Management System </title>
            </Helmet>
            <h1>Welcome to the Voucher Listing Page</h1>
            <div className="container-fluid">
                <section>
                    <div className="col-md-12" style={{backgroundColor:'#ddd',padding:80, border:'2px solid #ccc'}}>
                        <h5>{voucherAddedText}</h5>
                        <div className="row" style={{marginBottom:30}}>
                            <div className="col-md-6">
                                <label>Email : </label>
                                <input type="email" className="form-control" name="email" onChange={this.onChange} />
                            </div>
                            <div className="col-md-6">
                                <label>Status : </label>
                                <select className="form-control" name="status" onChange={this.onChange}>
                                    <option value="" selected disabled>Please Select</option>
                                    <option value="active">Active</option>
                                    <option value="partiallyRedemmed">Partially Redemmed</option>
                                    <option value="redemmed">Redemmed</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <div className="row">
                                    <button type="button" onClick={this.filterData} className="btn btn-primary btn-block">Search</button>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped w-100">
                                <thead className="thead-light">
                                <tr>
                                    <th style={{borderRight:'1px solid #000',borderBottom:'1px solid #000'}}>Voucher Code</th>
                                    <th style={{borderRight:'1px solid #000',borderBottom:'1px solid #000'}}>Voucher Pin</th>
                                    <th style={{borderRight:'1px solid #000',borderBottom:'1px solid #000'}}>Email</th>
                                    <th style={{borderRight:'1px solid #000',borderBottom:'1px solid #000'}}>Redeemed</th>
                                    <th style={{borderRight:'1px solid #000',borderBottom:'1px solid #000'}}>Total Utilized</th>
                                    <th style={{borderBottom:'1px solid #000'}}>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    fullDataSet.length > 0
                                    ?

                                    fullDataSet.map((eachData,eachIndex) => {
                                        return(
                                            <tr key={eachIndex}>
                                                <td style={{borderRight:'1px solid #000',borderBottom:'1px solid #000'}}>{eachData.voucherCode}</td>
                                                <td style={{borderRight:'1px solid #000',borderBottom:'1px solid #000'}}>{eachData.voucherPIN}</td>
                                                <td style={{borderRight:'1px solid #000',borderBottom:'1px solid #000'}}>{eachData.email}</td>
                                                <td style={{borderRight:'1px solid #000',borderBottom:'1px solid #000'}}>
                                                    {
                                                        eachData.voucherLogId.map((eachUsage,eachUsageIndex) => {
                                                            return(
                                                               
                                                                    eachUsage.usageActivity > 0
                                                                    ?
                                                                    <div key={eachUsageIndex}>{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(eachUsage.AddedDate)} : <b>Rs. {eachUsage.usageActivity} </b></div>
                                                                    :
                                                                    null
                                                            )
                                                        })
                                                    }
                                                </td>
                                                <td style={{borderRight:'1px solid #000',borderBottom:'1px solid #000'}}>
                                                    <b> Rs. {this.calculateTotalAmount(eachData.voucherLogId)} </b>
                                                </td>
                                                <td style={{borderBottom:'1px solid #000'}}>
                                                    <b> {
                                                            eachData.status === 'redemmed'
                                                            ?
                                                            'Redemmed'
                                                            :
                                                            eachData.status === 'partiallyRedemmed'
                                                            ?
                                                            'Partially Redemmed'
                                                            :
                                                            'Active'
                                                        } 
                                                    </b>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    :
                                    <span>No Data Found</span>
                                }
                                </tbody>
                            </table>
                        </div>
                        <div style={{marginTop:60}}>
                            <label><b>Redeem voucher</b> by <a href="/voucherRedeem">clicking in here</a>.</label><br />
                            <label><b>Add more voucher</b> by <a href="/voucherAdd">clicking in here</a>.</label>
                        </div>
                    </div>
                </section>
            </div>
            </>
        )
    }
}