import React, { Component } from 'react';
import './../css/App.css';
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';
import {
  MDBCol,MDBContainer,MDBRow
} from 'mdb-react-ui-kit';
import {Form} from 'react-bootstrap';

class DashBoard extends Component {
  constructor(props) {
      super(props);

      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth()+1;
      
      this.state = {
        selYear:year,
        selMonth:month
      };
  }
  componentDidMount() {
  }

  onChangeYear = (e) =>{
    this.setState({
      ...this.state,
      selYear:e.target.value,
    });
  }

  onChangeMonth = (e) =>{
    this.setState({
      ...this.state,
      selMonth:e.target.value,
    });
  }
  
  render() {
    const {selYear,selMonth} = this.state;
    const {basic} =this.props;
    
    const nurseColumns = [
      {
        name: "Nurse",
        center:true,
        wrap:true,
        selector: (row) => row.type,
      },
      {
        name: "Members",
        center:true,
        wrap:true,
        selector: (row) => row.members,
      },
      {
        name: "Available Hours",
        center:true,
        selector: (row) => row.available,
      },
      {
        name: "Assigned Hours",
        center:true,
        wrap:true,
        selector: (row) => row.assigned,
      },
      {
        name: "Overtime/(UnderTime)",
        center:true,
        selector: (row) => row.overtime,
      },
      {
        name: "Utilization",
        center:true,
        wrap:true,
        selector: (row) => row.utilization,
      },
    ];

    let nurseDatas = [{
      type:'Registered Nurse',
      members:0,
      available:0,
      assigned:0,
      overtime:0,
      utilization:0
    },
    {
      type:'Assistant Nurse',
      members:0,
      available:0,
      assigned:0,
      overtime:0,
      utilization:0
    },
    {
      type:'Total',
      members:0,
      available:0,
      assigned:0,
      overtime:0,
      utilization:0
    }];

    let daysInMonth = new Date(selYear, selMonth, 0).getDate();
    let month = selMonth<10?+'0'+String(selMonth):selMonth;
    let from = selYear+'-'+month+'-01';
    let to = selYear+'-'+month+'-'+daysInMonth;

    basic.nurses.map((nurse) =>{
      let nurseLevel = nurse.level;
        nurseDatas[nurseLevel].members++;
        nurseDatas[2].members++;
        nurse.rota.map((rota) =>{
          if(rota.date >= from && rota.date <= to){
            nurseDatas[nurseLevel].assigned += rota.hour*1;
            nurseDatas[2].assigned += rota.hour*1;
          }
        });
    });
    nurseDatas.map((nurseData) =>{
        nurseData.available = nurseData.members * 208;
        nurseData.overtime = nurseData.assigned*1 - nurseData.available*1;
        nurseData.utilization = parseFloat(nurseData.assigned*1 / nurseData.available*1 * 100).toFixed(2) + '%';
    });

    return (
      <MDBContainer>
          <div className="pt-5 text-center text-dark">
            <h1 className="mt-3">DUTY ROASTER DASHBOARD</h1>
          </div>
          <MDBRow className=" align-items-center justify-content-center">
            <MDBCol md="2">
              <Form.Group>
                <Form.Control type="number" value={selYear} placeholder="Year"  min={2022} max={new Date().getFullYear()+1} onChange = {(e) =>this.onChangeYear(e)}/>
              </Form.Group>
            </MDBCol>
            <MDBCol md="2">
              <Form.Group>
                <Form.Control type="number" value={selMonth} placeholder="Month" min={1} max={12}  onChange = {(e) =>this.onChangeMonth(e)}/>
              </Form.Group>
            </MDBCol>
          </MDBRow>
          <MDBRow className='mt-5'>   
                <DataTable
                    columns={nurseColumns} 
                    data={nurseDatas}
                    fixedHeader
                    height={'300px'}
                />
          </MDBRow>
      </MDBContainer>
    );
  };
}

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});
export default connect(mapStateToProps,null)(DashBoard)