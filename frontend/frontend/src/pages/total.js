import React, { Component } from 'react';
import './../App.css';
import {Form} from 'react-bootstrap';
import { MDBContainer } from 'mdb-react-ui-kit';
import {connect} from 'react-redux'

class Total extends Component {
  constructor(props) {
      super(props);
      this.state = {
        type:0,
        from:'',
        to:'',
      };
  }
  setDate = (target,e) =>{
    this.setState({
      ...this.state,
      [target]:e.target.value
    });
  }
  componentDidMount() {
  }
  
  render() {
    const {basic} = this.props;
    const {from,to} = this.state;
    console.log(basic);
    let list =[];
    let nurses =[];
    let nurse_ids =[];
    let dates = [];
    let hour = [];
    let totalhour = [];

    basic.nurses.map(nurse =>{
      totalhour[nurse._id] = 0;
      nurse.rota.map((rota) =>{
        if (from === '' || new Date(from) <= new Date(rota.date)) {
          if(to === '' || new Date(to) >= new Date(rota.date)){
            hour[nurse._id+rota.date] = rota.hour;
            if(rota.hour !== null && rota.hour !== undefined){
              totalhour[nurse._id] += rota.hour*1;
            }
            let selRota = {_id:nurse._id ,date:rota.date,nurse:nurse.name,hour:rota.hour};
            list = [...list,{...selRota}]
          }
        }
      });
    });

    list.map((value)=>{
      nurses = [...nurses,value.nurse];
      nurse_ids = [...nurse_ids,value._id];
      dates = [...dates,value.date];
    });

    const setNurses = new Set(nurses);
    let nurselist = Array.from(setNurses);
    const setIds = new Set(nurse_ids);
    let idlist = Array.from(setIds);
    const setDates = new Set(dates);
    let datelist = Array.from(setDates);
    datelist.sort();
    
    return (
      <MDBContainer>
        <div className="pt-5 text-center text-dark">
          <h1 className="mt-3">TOTAL</h1>
        </div>
        <div className='row'>
          <div className='col'>
            <div className='row'>
              <div className='col-md-3'>
              </div>
              <div className='col-md-3'>
                <Form.Group className="mb-3">
                  <Form.Label>From</Form.Label>
                  <Form.Control type="date" onChange = {(e) =>this.setDate('from',e)} />
                </Form.Group>
              </div>
              <div className='col-md-3'>
                <Form.Group className="mb-3">
                  <Form.Label>To</Form.Label>
                  <Form.Control type="date" value={to}  onChange = {(e) =>this.setDate('to',e)}/>
                </Form.Group>
              </div>
              <div className='col-md-3'>
              </div>
            </div>
            <div className='p-2'>
              <table className='table table-striped table-sm table-responsive' variant="light">
                <thead>
                  <tr>
                    <th key={0}>Date</th>
                    {
                      nurselist.map((value,index) =>
                        <th key={index}>{value}</th>
                      )
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    datelist.map((date,index) =>
                      <tr key={index}>
                        <td>{date}</td>
                        {
                          idlist.map((id,index) =>
                            <th key={index}>{hour[id+date]}</th>
                          )
                        }
                      </tr>
                    )
                  }
                    <tr>
                      <td>Total</td>
                        {
                          idlist.map((id,index) =>
                            <th key={index}>{totalhour[id]}</th>
                          )
                        }
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </MDBContainer>
    );
  };
}

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});
export default connect(mapStateToProps,null)(Total)