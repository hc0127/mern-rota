import React, { Component } from 'react';
import './../css/App.css';
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';
import {
  MDBCol,MDBContainer,MDBRow,MDBCard,MDBCardBody,MDBCardTitle,MDBCardSubTitle,MDBCardText,MDBCardLink,MDBCardImage,MDBProgress,MDBProgressBar
} from 'mdb-react-ui-kit';
import {Form} from 'react-bootstrap';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';
import {CWidgetStatsB
} from '@coreui/react';

import { getStyle, hexToRgba } from '@coreui/utils';
import { CChart } from '@coreui/react-chartjs';
import {cilCloudDownload,} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

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
    let month = date.getMonth()+1>9?date.getMonth()+1:'0'+(date.getMonth()+1);
    
    this.state = {
      selYear:year,
      selMonth:month
        perPatient:false,
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
  viewPerPatient = (e) =>{
    this.setState({
      ...this.state,
      perPatient:!this.state.perPatient
    });
  }
  getTotals(data, key){
    let total = 0;
    data.forEach(item => {
      total += item[key];
    });
    return total;
  }

  swap(json){
    let ret = [];
    for(var key in json){
      ret[json[key]] = key;
    }
    return ret;
  }
  
  render() {
    const {selYear,selMonth} = this.state;
    const {basic} =this.props;

    let nurseDatas = [{
      members:0,
      available:0,
      assigned:0,
      overtime:0,
      utilization:0
    },
    {
      members:0,
      available:0,
      assigned:0,
      overtime:0,
      utilization:0
    },
    {
      members:0,
      available:0,
      assigned:0,
      overtime:0,
      utilization:0
    }];

    let monthNames = basic.monthNames;
    let monthNumbers = this.swap(monthNames);
    
    let Mon = Object.keys(monthNames);
    let NoMon = Object.values(monthNames);
    
    const MonthSelect = Mon.map((month,index) =>
      <option value={NoMon[index]}>{month}</option>
    );

    let daysInMonth = new Date(selYear, selMonth, 0). getDate();
    let from = selYear+'-'+selMonth+'-01';
    let to = selYear+'-'+selMonth+'-'+daysInMonth;
    if(perPatient){
      pnlColumns.push({
        name: "Patient",
        center:true,
        wrap:true,
        sortable:true,
        filterable: true,
        selector: (row) => row.patient
      },{
        name: "Level",
        center:true,
        wrap:true,
        sortable:true,
        selector: (row) => row.level,
      });
    }else{
      pnlColumns.push({
        name: "Month",
        center:true,
        wrap:true,
        selector: (row) => row.month,
      });
    }
    pnlColumns.push({
      name: "Revenue",
      center:true,
      wrap:true,
      selector: (row) => row.revenue?row.revenue.toLocaleString('en'):0,
    },{
      name: "Payroll",
      center:true,
      wrap:true,
      selector: (row) => row.payroll?row.payroll.toLocaleString('en'):0,
    },{
      name: "Profit/Loss",
      center:true,
      wrap:true,
      selector: (row) => row.pnl?row.pnl.toLocaleString('en'):0,
    });

    //get holidays per month
    let holidays = basic.holidays;
    let holidaysPerMonth = [];
    holidays.map(holiday =>{
      if(parseInt(holiday.slice(0,2)) == selMonth){
        if(holidaysPerMonth[key] == undefined){holidaysPerMonth[key] = [];}
        holidaysPerMonth.push(selYear+'-'+holiday);
      }
    });
    //get sundays per month
    let sundaysPerMonth = [];
      for(let loopMonth in monthNumbers){
        let daysInMonth = new Date(selYear, loopMonth, 0).getDate();
    let date = selYear+'-'+selMonth+'-01';
    let firstDate = new Date(date).getDay();
    if(firstDate == 0){firstDate = 7}
    for(let selDay = firstDate;selDay < daysInMonth;selDay+=7){
      let day = selDay > 9?selDay:'0'+selDay;
          let key = monthNumbers[loopMonth];
          if(sundaysPerMonth[key] == undefined){sundaysPerMonth[key] = [];}
      sundaysPerMonth.push(selYear+'-'+selMonth+'-'+day);
    }
      }
      //get payroll
      let payrollPerMonth = []; 
      let payrollPerPatient = [];
      let payrollHourly = [];

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
              let key = monthNumbers[month];
              if(leavedaysPerMonth[key] == undefined){leavedaysPerMonth[key] = [];}
              leavedaysPerMonth.push(year+'-'+month+'-'+day);
            }
            betweenDay.setDate(betweenDay.getDate() + 1);
          }
        }
        //rota hours per month
        let rotas = nurse.rota;
        let rotaPerMonth = [];
        let rotaHolidayPerMonth = [];
        rotas.map(rota =>{
          if(rota.date.startsWith(selYear)){
            let month = monthNumbers[[rota.date.slice(5,7)]];
            if(rotaPerMonth[month] == undefined){
              rotaPerMonth[month] = rota.hour;
            }else{
              rotaPerMonth[month] += rota.hour;
            }
            if(holidaysPerMonth[month].includes(rota.date)){
              if(rotaHolidayPerMonth[month] == undefined){
                rotaHolidayPerMonth[month] = rota.hour;
              }else{
                rotaHolidayPerMonth[month] += rota.hour;
              }
            }

            if(rota.date.slice(5,7) == selMonth){
              if(payrollPerPatient[rota.patient_id] == undefined){payrollPerPatient[rota.patient_id] = []}
              if(payrollPerPatient[rota.patient_id][nurse._id] == undefined){
                payrollPerPatient[rota.patient_id][nurse._id] = rota.hour
              }else{
                payrollPerPatient[rota.patient_id][nurse._id] += rota.hour
              }
            }
          }
        });

        //datatable set
        let offDaysPerMonth = [];
        let dutyHoursPerMonth = [];

        for(let loopMonth in monthNames){
          let daysInMonth = new Date(selYear, monthNames[loopMonth], 0).getDate();
          if(leavedaysPerMonth[loopMonth] == undefined){leavedaysPerMonth[loopMonth] = [];}
          if(holidaysPerMonth[loopMonth] == undefined){holidaysPerMonth[loopMonth] = [];}
          if(sundaysPerMonth[loopMonth] == undefined){sundaysPerMonth[loopMonth] = [];}
          
        let offdays = [...leavedaysPerMonth,...holidaysPerMonth,...sundaysPerMonth];
        offdays = [...new Set(offdays)];
          dutyHoursPerMonth[loopMonth] = (daysInMonth-offDaysPerMonth[loopMonth].length)*8;
  
          if(rotaPerMonth[loopMonth] == undefined){rotaPerMonth[loopMonth] = 0;}
          if(rotaHolidayPerMonth[loopMonth] == undefined){rotaHolidayPerMonth[loopMonth] = 0;}
          if(payrollPerMonth[loopMonth] == undefined){payrollPerMonth[loopMonth] = 0;}
          
          if(rotaPerMonth[loopMonth]){
        nurseDatas[nurseLevel].available += (daysInMonth-offdays.length)*8;
        nurseDatas[2].available += (daysInMonth-offdays.length)*8;
            let reducePerDay = parseFloat(salary*12/365);

            if(dutyHoursPerMonth[loopMonth] < rotaPerMonth[loopMonth] 
              //  && rotaPerMonth[loopMonth] >= 192
               ){
              let overtime = rotaPerMonth[loopMonth] - dutyHoursPerMonth[loopMonth];
              let holidayovertime = 0;

              if(rotaHolidayPerMonth[loopMonth] != undefined){
                if(overtime <= rotaHolidayPerMonth[loopMonth]){
                  holidayovertime = overtime;
                  overtime = 0;
                }else{
                  overtime -= rotaHolidayPerMonth[loopMonth];
                  holidayovertime = rotaHolidayPerMonth[loopMonth];
                }
              }
              salary += parseInt(basicPerDay*overtime+holidayPerDay*holidayovertime);
            }
            
            if(selYear == parseInt(nurse.date.slice(0,4))){
              let joined = nurse.date;
              if(monthNames[loopMonth] < joined.slice(5,7)){
                salary = 0;
              }else if(monthNames[loopMonth] == joined.slice(5,7)){
                salary = salary - parseInt(reducePerDay*(parseInt(joined.slice(8,10))-1));
              }
            }else if(selYear < parseInt(nurse.date.slice(0,4))){
              salary = 0;
            }

          
          payrollPerMonth[loopMonth] += salary;
          
          
          if(monthNames[loopMonth] == selMonth){
              payrollHourly[nurse._id] = parseFloat(salary/rotaPerMonth[loopMonth]);
          }
        }
        }
    });

    if(perPatient){
      let revenueTotal = 0;
      let payrollTotal = 0;
    nurseDatas.map((nurseData) =>{
        nurseData.overtime = nurseData.assigned*1 - nurseData.available*1;
        if(nurseData.available*1 == 0){

        for(let month in patient.revenue){
          if(month.slice(4,6) == selYear%100 && monthNames[month.slice(0,3)] == selMonth){
            revenue = patient.revenue[month];
            revenueTotal += revenue;
          }
        }
        if(payrollPerPatient[patient._id] == undefined){
          payroll = 0;
        }else{
          for(let loopNurse in payrollPerPatient[patient._id]){
            payroll += parseFloat(payrollPerPatient[patient._id][loopNurse] * payrollHourly[loopNurse]);
          }
          payrollTotal += payroll;
        }
          
        pnlDatas.push({
          patient:patient.name,
          level:patient.level,
          revenue:parseInt(revenue),
          payroll:parseInt(payroll),
          pnl:revenue-parseInt(payroll)
        });
        
      });

      let row={
        patient:" Total",
        revenue:revenueTotal,
        payroll:parseInt(payrollTotal),
        pnl:revenueTotal-parseInt(payrollTotal)
      };
          nurseData.utilization = 0;
        }else{
          nurseData.utilization = parseInt(nurseData.assigned*1 / nurseData.available*1 * 100);
      basic.patients.map(patient =>{
          for(let month in patient.revenue){
            if(month.slice(4,6) == selYear%100){
              let m = month.slice(0,3);
              revenue[m] == undefined 
              ?
              revenue[m] = patient.revenue[month]
              :
              revenue[m] += patient.revenue[month];
        }
          }
    });
      
      for(let month in monthNames){
        if(revenue[month] == undefined){revenue[month] = 0}
        if(payrollPerMonth[month] == undefined){payrollPerMonth[month] = 0}
        pnlDatas.push({
          month:month,
          revenue:revenue[month],
          payroll:payrollPerMonth[month],
          pnl:revenue[month]-payrollPerMonth[month],
        });
      }

      let row={};
      revenue = Object.values(revenue).reduce((a,b) => a+b,0)
      let payroll = Object.values(payrollPerMonth).reduce((a,b) => a+b,0);
      let pnl = revenue - payroll
      row.month = 'Total';
      row.revenue = revenue;
      row.payroll = payroll;
      row.pnl = pnl;
      
      pnlDatas.push(row);
    }

    const conditionalRowStyles = [
        {
          when: (row) => row.month == 'Total' || row.patient == 'Total',
          style: row => ({
            backgroundColor: 'rgb(160,160,160)',
          }),
        }
    ];

    return (
      <MDBContainer>
          <div className="pt-5 text-center text-dark">
            <h1 className="mt-3">PROFIT & LOSS</h1>
          </div>
          <MDBRow className="pt-5 mt-3 align-items-center justify-content-center">
            <MDBCol md="2">
              <Form.Group>
                <Form.Control type="number" value={selYear} placeholder="Year"  min={2022} max={new Date().getFullYear()+1} onChange = {(e) =>this.onChangeYear(e)}/>
              </Form.Group>
            </MDBCol>
            {perPatient &&
            <MDBCol md="2">
                <Form.Group>
                  <Form.Select aria-label="select" value={selMonth} onChange = {(e) =>this.onChangeMonth(e)}>
                    {
                      MonthSelect
                    }
                  </Form.Select>
                </Form.Group>
            </MDBCol>
          </MDBRow>

          <MDBRow className="mt-3">
            <MDBCol>
              <MDBCard>
                  <MDBCardImage src='https://884863.smushcdn.com/2024606/wp-content/uploads/2006/10/outfit_nurse_clothes_attire_work.jpg?lossy=1&strip=1&webp=1' alt='...' position='top' />
                  <MDBCardBody>
                    <MDBProgress className='mb-1' height='15'>
                        <MDBProgressBar width='100' valuemin={0} valuemax={100}>
                          {nurseDatas[2].members}
                        </MDBProgressBar>
                    </MDBProgress>
                    <MDBProgress height='15'>
                      <MDBProgressBar 
                        bgColor='success' 
                        width={nurseDatas[2].members == 0?0:(nurseDatas[0].members/nurseDatas[2].members)*100} valuemin={0} valuemax={100}>{nurseDatas[0].members}
                      </MDBProgressBar>
                      <MDBProgressBar 
                        bgColor='info'
                        width={nurseDatas[2].members == 0?0:(nurseDatas[1].members/nurseDatas[2].members)*100} 
                        valuemin={0} valuemax={100}>
                          {nurseDatas[1].members}
                      </MDBProgressBar>
                    </MDBProgress>
                  </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard>
                  <MDBCardImage src='https://upload.wikimedia.org/wikipedia/commons/c/cd/180726-time-al-1252.webp' alt='...' position='top' />
                  <MDBCardBody>
                    <MDBProgress className='mb-1' height='15'>
                        <MDBProgressBar width='100' valuemin={0} valuemax={100}>
                          {nurseDatas[2].available}
                        </MDBProgressBar>
                    </MDBProgress>
                    <MDBProgress height='15'>
                      <MDBProgressBar 
                        bgColor='success' 
                        width={nurseDatas[2].available == 0?0:(nurseDatas[0].available/nurseDatas[2].available)*100} valuemin={0} valuemax={100}>{nurseDatas[0].available}
                      </MDBProgressBar>
                      <MDBProgressBar 
                        bgColor='info'
                        width={nurseDatas[2].available == 0?0:(nurseDatas[1].available/nurseDatas[2].available)*100} 
                        valuemin={0} valuemax={100}>
                          {nurseDatas[1].available}
                      </MDBProgressBar>
                    </MDBProgress>
                  </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard>
                  <MDBCardImage src='https://www.gannett-cdn.com/authoring/2019/02/08/NOKL/ghnewsok-OK-5622432-19aacf4d.jpeg?width=649&height=432&fit=crop&format=pjpg&auto=webp' alt='...' position='top' />
                  <MDBCardBody>
                    <MDBProgress className='mb-1' height='15'>
                        <MDBProgressBar width='100' valuemin={0} valuemax={100}>
                          {nurseDatas[2].assigned}
                        </MDBProgressBar>
                    </MDBProgress>
                    <MDBProgress height='15'>
                      <MDBProgressBar 
                        bgColor='success' 
                        width={nurseDatas[2].assigned == 0?0:(nurseDatas[0].assigned/nurseDatas[2].assigned)*100} valuemin={0} valuemax={100}>{nurseDatas[0].assigned}
                      </MDBProgressBar>
                      <MDBProgressBar 
                        bgColor='info'
                        width={nurseDatas[2].assigned == 0?0:(nurseDatas[1].assigned/nurseDatas[2].assigned)*100} 
                        valuemin={0} valuemax={100}>
                          {nurseDatas[1].assigned}
                      </MDBProgressBar>
                    </MDBProgress>
                  </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard>
                  <MDBCardImage src='https://blog.axcethr.com/hubfs/flsa-overtime-basics-for-employers%20(1).webp' alt='...' position='top' />
                  <MDBCardBody>
                    <MDBProgress className='mb-1' height='15'>
                        <MDBProgressBar width='100' valuemin={0} valuemax={100}>
                          {nurseDatas[2].overtime}
                        </MDBProgressBar>
                    </MDBProgress>
                    <MDBProgress height='15'>
                      <MDBProgressBar 
                        bgColor='success' 
                        width={nurseDatas[2].overtime == 0?0:(nurseDatas[0].overtime/nurseDatas[2].overtime)*100} valuemin={0} valuemax={100}>{nurseDatas[0].overtime}
                      </MDBProgressBar>
                      <MDBProgressBar 
                        bgColor='info'
                        width={nurseDatas[2].overtime == 0?0:(nurseDatas[1].overtime/nurseDatas[2].overtime)*100} 
                        valuemin={0} valuemax={100}>
                          {nurseDatas[1].overtime}
                      </MDBProgressBar>
                    </MDBProgress>
                  </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol>
              <MDBCard>
                  <MDBCardImage src='https://russianvagabond.com/wp-content/uploads/2020/03/Webp.net-resizeimage-207.jpg' alt='...' position='top' />
                  <MDBCardBody>
                    <MDBProgress className='mb-1' height='15'>
                        <MDBProgressBar width={nurseDatas[2].utilization} valuemin={0} valuemax={100}>
                          {nurseDatas[2].utilization+'%'}
                        </MDBProgressBar>
                    </MDBProgress>
                    <MDBRow>
                      <MDBCol>
                        <MDBProgress height='15'>
                          <MDBProgressBar 
                            bgColor='success' 
                            width={nurseDatas[0].utilization+'%'} valuemin={0} valuemax={100}>{nurseDatas[0].utilization}
                          </MDBProgressBar>
                        </MDBProgress>
                      </MDBCol>
                      <MDBCol>
                        <MDBProgress>
                          <MDBProgressBar 
                            bgColor='info'
                            width={nurseDatas[1].utilization} valuemin={0} valuemax={100}>
                              {nurseDatas[1].utilization+'%'}
                          </MDBProgressBar>
                        </MDBProgress>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>

          <MDBRow className='mt-2'>
            <MDBCol>
              <MDBProgress height='15'>
                <MDBProgressBar bgColor='primary' width='100' valuemin={0} valuemax={100}>Total</MDBProgressBar>
              </MDBProgress>
            </MDBCol>
            <MDBCol>
              <MDBProgress height='15'>
                <MDBProgressBar bgColor='success' width='100' valuemin={0} valuemax={100}>Assistant</MDBProgressBar>
              </MDBProgress>
            </MDBCol>
            <MDBCol>
              <MDBProgress height='15'>
                <MDBProgressBar bgColor='info' width='100' valuemin={0} valuemax={100}>Registered</MDBProgressBar>
              </MDBProgress>
            </MDBCol>
          </MDBRow>
          <CChart
            type="line" 
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
                fixedHeader
              datasets: [
                {
                  label: "Revenue",
                  backgroundColor: "#00f",
                  borderColor: "#00f",
                  pointBackgroundColor: "#ff0",
                  pointBorderColor: "#f00",
                  data: [40, 20, 12, 39, 10, 40, 39, 80, 40]
                },
                {
                  label: "Payroll",
                  backgroundColor: "#0f0",
                  borderColor: "#0f0",
                  pointBackgroundColor: "#ff0",
                  pointBorderColor: "#f00",
                  data: [400, 200, 102, 309, 100, 400, 309, 850, 440]
                },
                {
                  label: "PNL",
                  backgroundColor: "#0dcaf0",
                  borderColor: "#0dcaf0",
                  pointBackgroundColor: "#ff0",
                  pointBorderColor: "#f00",
                  data: [420, 120, 212, 339, 120, 430, 339, 180, 410]
                }
              ],
            }}
          />
          {/* <CWidgetStatsB
              className="mb-3"
              color="primary"
              inverse
              progress={{ color: 'white',value: 75 }}
              text="Widget helper text"
              title="Widget title"
              value="89.9%"
            /> */}

          <MDBRow className='mt-2'>
            <MDBCol>
              <MDBCard background='primary' className='text-white text-center mb-3'>
                <MDBCardBody className='m-auto'>
                  <NavLink to="basic">Registeration</NavLink>
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
                  <NavLink to="total">Daily Time Record</NavLink>
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
      </MDBContainer>
    );
  };
}

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});

export default connect(mapStateToProps,null)(DashBoard)