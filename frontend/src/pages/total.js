import React, { Component } from 'react';
import './../App.css';
import {Form} from 'react-bootstrap';
import { MDBContainer } from 'mdb-react-ui-kit';
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';

class Total extends Component {
  constructor(props) {
      super(props);
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth()+1 > 9 ? date.getMonth()+1 : '0'+(date.getMonth()+1);
      let beforemonth = date.getMonth() > 9 ? date.getMonth() : '0'+date.getMonth();
      let day = date.getDate() > 9 ? date.getDate() : '0'+date.getDate();
      let afterday = date.getDate()+1 > 9 ? date.getDate()+1 : '0'+(date.getDate()+1);
      this.state = {
        type:0,
        from:year+'-'+beforemonth+'-'+afterday,
        to:year+'-'+month+'-'+day,
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

    let totalColumns = [];
    let totalDatas = [];
    let details = [];

    totalColumns.push({
        name: "Date",
        center:true,
        wrap:true,
        selector: (row) => row.date,
    })

    details['date'] = [];
    for (var d = new Date(from); d <= new Date(to); d.setDate(d.getDate() + 1)) {
      let year = d.getFullYear();
      let month = d.getMonth()+1 > 9 ? d.getMonth()+1 : '0'+(d.getMonth()+1);
      let day = d.getDate() > 9 ? d.getDate() : '0'+d.getDate();
      let dateFormat = year+'-'+month+'-'+day;
      details['date'].push(dateFormat);
    }
    basic.nurses.map((nurse,nurseIndex) =>{
      totalColumns.push({
        name: nurse.name,
        center:true,
        wrap:true,
        selector: (row) => row[nurseIndex],
      });

      if(details[nurseIndex] == undefined){
        details[nurseIndex] = [];
      }

      nurse.rota.map((rota) =>{
        if(from<rota.date && rota.date<= to){
          let date = rota.date;
          if(details[nurseIndex][date] == undefined){
            details[nurseIndex][date] = rota.hour;
          }else{
            details[nurseIndex][date] += rota.hour;
          }
        }
      });
      for (var d = new Date(from); d <= new Date(to); d.setDate(d.getDate() + 1)) {
        let year = d.getFullYear();
        let month = d.getMonth()+1 > 9 ? d.getMonth()+1 : '0'+(d.getMonth()+1);
        let day = d.getDate() > 9 ? d.getDate() : '0'+d.getDate();
        let dateFormat = year+'-'+month+'-'+day;
        if(details[nurseIndex][dateFormat] == undefined){
          details[nurseIndex][dateFormat] = 0;
        }
        // details[nurseIndex].sort((a,b) => (a.date > b.date) ? 1 : (a.date < b.date ? -1 : 0));
      }
    });

    let dates = details['date'];
    for(var i of dates){
      let row = [];
      row.date = i;
      for(var j in details){
        if(j != "date"){
          let hour = details[j][i];
          row[j] = hour;
        }
      }
      totalDatas.push(row);
    }


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
                  <Form.Control type="date" value={from}  onChange = {(e) =>this.setDate('from',e)} />
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
              <DataTable 
                columns={totalColumns} 
                data={totalDatas}
                striped
                // fixedHeader
                // fixedHeaderScrollHeight={'60vh'}
                // pagination 
                />
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