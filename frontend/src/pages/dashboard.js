import React, { Component } from 'react';
import './../css/App.css';
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';
import {
  MDBCol,MDBContainer,MDBRow,MDBCard,MDBCardBody
} from 'mdb-react-ui-kit';
import {Form} from 'react-bootstrap';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const NavLink = styled(Link)`
color: #ffffff;
font-family:Roboto,Helvetica Neue,sans-serif;
font-size: 16px;
display: flex;
align-items: center;
text-align:center;
text-decoration: none;
padding: 5px 12px;
height: 100%;
cursor: pointer;
&.active {
	color: white;
	background-color: #0088ff;
}
`;

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

    let daysInMonth = new Date(selYear, selMonth, 0). getDate();
    let month = selMonth<10?+'0'+String(selMonth):selMonth;
    let from = selYear+'-'+month+'-01';
    let to = selYear+'-'+month+'-'+daysInMonth;

    //get holidays per month
    let holidays = basic.holidays;
    let holidaysPerMonth = [];
    holidays.map(holiday =>{
      if(parseInt(holiday.slice(0,2)) == 1){
        holidaysPerMonth.push(selYear+'-'+holiday);
      }
    });
    //get sundays per month
    let sundaysPerMonth = [];
    let date = selYear+selMonth+'-01';
    let firstDate = new Date(date).getDay();
    if(firstDate == 0){firstDate = 7}
    for(let selDay = 7- firstDate;selDay < daysInMonth;selDay+=7){
      let day = selDay > 9?selDay:'0'+selDay;
      sundaysPerMonth.push(selYear+'-'+selMonth+'-'+day);
    }

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

        //get leavedays per month
        let leaves = nurse.leave;
        let leavedaysPerMonth = [];

        for(let leave of leaves){
          let from = new Date(leave.from);
          let to = new Date(leave.to);
          for(let betweenDay = from;betweenDay <= to;){
            let year = betweenDay.getFullYear();
            let month = betweenDay.getMonth()+1>9?betweenDay.getMonth()+1:'0'+(betweenDay.getMonth()+1);
            let day = betweenDay.getDate()>9?betweenDay.getDate():'0'+betweenDay.getDate();
            if(year == selYear && month == selMonth){
              leavedaysPerMonth.push(year+'-'+month+'-'+day);
            }
            betweenDay.setDate(betweenDay.getDate() + 1);
          }
        }

        let workingdays = [...leavedaysPerMonth,...holidaysPerMonth,...sundaysPerMonth];
        console.log(nurse.level,workingdays.length);
        workingdays = [...new Set(workingdays)];
        nurseDatas[nurseLevel].available += (daysInMonth-workingdays.length)*8;
        nurseDatas[2].available += (daysInMonth-workingdays.length)*8;
    });
    nurseDatas.map((nurseData) =>{
        nurseData.overtime = nurseData.assigned*1 - nurseData.available*1;
        if(nurseData.available*1 == 0){
          nurseData.utilization = 0+".00%";
        }else{
          nurseData.utilization = parseFloat(nurseData.assigned*1 / nurseData.available*1 * 100).toFixed(2) + '%';
        }
    });

    return (
      <MDBContainer>
          <MDBRow className="pt-5 mt-3">
            <MDBCol>
              <MDBCard background='primary' className='text-white text-center mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="basic">Staff</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard background='success' className='text-white mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="working">Working Days</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard background='success' className='text-white mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="leave">Leave Days</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard background='danger' className='text-white mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="roaster">Duty Roaster</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mt-2">
            <MDBCol>
              <MDBCard background='primary' className='text-white mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="total">Report</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard background='warning' className='text-white mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="payroll">Payroll</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard background='warning' className='text-white mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="revenue">Revenue</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard background='danger' className='text-white text-center mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="pnl">PNL</NavLink>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
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
          <MDBRow className='mt-2'>   
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