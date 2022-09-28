import React, { Component } from 'react';
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';
import {
  MDBCol,MDBContainer,MDBRow
} from 'mdb-react-ui-kit';
import {Button, Form,OverlayTrigger,Tooltip} from 'react-bootstrap';

class PayRoll extends Component {
  constructor(props) {
      super(props);

      let date = new Date();
      let year = date.getFullYear();
      
      this.state = {
        selYear:year
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
    const {selYear} = this.state;
    const {basic} =this.props;

    let monthNames = basic.monthNames;
    let monthNumbers = this.swap(monthNames);

    let payrollColumns = [];
    payrollColumns.push({
      name: "Payroll",
      center:true,
      wrap:true,
      selector: (row) => row['nurse'],
    });
    for(let month in monthNames){
      payrollColumns.push({
        name:month,
        center:true,
        wrap:true,
        width:'75px',
        cell: (row) =>
        <OverlayTrigger
          key={row.leave_id}
          placement="top"
          overlay={
            <Tooltip  className="display-linebreak" style={{position:'fixed'}} >
              {row[month+"comment"]}
            </Tooltip>
          }
        >
          <p className="payroll hover">{row[month]?row[month].toLocaleString('en'):0}</p>
        </OverlayTrigger>
      });
    }
    
    payrollColumns.push({
      name: "Total",
      center:true,
      wrap:true,
      selector: (row) => row['total']?row['total'].toLocaleString('en'):0,
    });

    let payrollDatas = [];
    //get holidays per month
    let holidays = basic.holidays;
    let holidaysPerMonth = [];
    holidays.map(holiday =>{
      let key = monthNumbers[holiday.slice(0,2)];
      if(holidaysPerMonth[key] == undefined){holidaysPerMonth[key] = [];}
      holidaysPerMonth[key].push(selYear+'-'+holiday);
    });
    //get sundays per month
    let sundaysPerMonth = [];
    for(let selMonth in monthNumbers){
      let daysInMonth = new Date(selYear, selMonth, 0).getDate();
      let date = selYear+'-'+selMonth+'-01';
      let firstDate = new Date(date).getDay();
      if(firstDate == 0){firstDate = 1}else{firstDate = 7-firstDate+1}
      for(let selDay = firstDate;selDay < daysInMonth;selDay+=7){
        let day = selDay > 9?selDay:'0'+selDay;
        let key = monthNumbers[selMonth];
        if(sundaysPerMonth[key] == undefined){sundaysPerMonth[key] = [];}
        sundaysPerMonth[key].push(selYear+'-'+selMonth+'-'+day);
      }
    }
    
    if(selYear <= new Date().getFullYear()){
      basic.nurses.map((nurse) =>{
        let salary = nurse.basic_allowances+nurse.housing_allowances+nurse.other_allowances;
        let comment = "basic:"+nurse.basic_allowances+"\nhousing:"+nurse.housing_allowances+"\nother:"+nurse.other_allowances;
  
        //leave days
        let leaves = nurse.leave?nurse.leave:[];
        let leavedaysPerMonth = [];
        for(let leave of leaves){
          let from = new Date(leave.from);
          let to = new Date(leave.to);
          for(let betweenDay = from;betweenDay <= to;){
            let year = betweenDay.getFullYear();
            let month = betweenDay.getMonth()+1>9?betweenDay.getMonth()+1:'0'+(betweenDay.getMonth()+1);
            let day = betweenDay.getDate()>9?betweenDay.getDate():'0'+betweenDay.getDate();
            if(year == selYear){
              let key = monthNumbers[month];
              if(leavedaysPerMonth[key] == undefined){leavedaysPerMonth[key] = [];}
              leavedaysPerMonth[key].push(year+'-'+month+'-'+day);
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
          }
        });
        //datatable set
        let payrollPerMonth = []; 
        let payrollCommentPerMonth = []; 
        let offDaysPerMonth = [];
        let dutyHoursPerMonth = [];
        for(let selMonth in monthNames){
          let daysInMonth = new Date(selYear, monthNames[selMonth], 0).getDate();
          if(leavedaysPerMonth[selMonth] == undefined){leavedaysPerMonth[selMonth] = [];}
          if(holidaysPerMonth[selMonth] == undefined){holidaysPerMonth[selMonth] = [];}
          if(sundaysPerMonth[selMonth] == undefined){sundaysPerMonth[selMonth] = [];}
          
          offDaysPerMonth[selMonth] = [...leavedaysPerMonth[selMonth],...holidaysPerMonth[selMonth],...sundaysPerMonth[selMonth]];
          offDaysPerMonth[selMonth] = [...new Set(offDaysPerMonth[selMonth])];
          dutyHoursPerMonth[selMonth] = (daysInMonth-offDaysPerMonth[selMonth].length)*8;
          if(rotaPerMonth[selMonth] == undefined){rotaPerMonth[selMonth] = 0;}
          if(dutyHoursPerMonth[selMonth] < rotaPerMonth[selMonth]
            //  && rotaPerMonth[selMonth] >= 192
             ){
            let overtime = rotaPerMonth[selMonth] - dutyHoursPerMonth[selMonth];
            let holidayovertime = 0;
            if(rotaHolidayPerMonth[selMonth] != undefined){
              if(overtime <= rotaHolidayPerMonth[selMonth]){
                holidayovertime = overtime;
                overtime = 0;
              }else{
                overtime -= rotaHolidayPerMonth[selMonth];
                holidayovertime = rotaHolidayPerMonth[selMonth];
              }
            }
            
            payrollCommentPerMonth[selMonth] = comment+"\novertime:"+overtime+"hours"+"\nholiday overtime:"+holidayovertime+"hours";

            let basicPerDay = parseFloat(nurse.basic_allowances*15/365/8);
            let holidayPerDay = parseFloat(nurse.basic_allowances*18/365/8);

            payrollPerMonth[selMonth] = salary+parseInt(basicPerDay*overtime+holidayPerDay*holidayovertime);
          }else{
            payrollPerMonth[selMonth] = salary;
            payrollCommentPerMonth[selMonth] = comment;
          }
        }
        let row = {};
        row.nurse = nurse.name;
        row.total = 0;
        for(let month in monthNames){
          if(selYear == new Date().getFullYear()){
            if(parseInt(monthNames[month]) <= new Date().getMonth()+1){
              row[month] = payrollPerMonth[month];
              row[month+'comment'] = payrollCommentPerMonth[month];
              row.total += row[month];
            }else{
              row[month] = 0;
            }
          }
        }
        payrollDatas.push(row);
      });
  
      let total = {
        nurse:'total',
      }
      for(let month in monthNames){
        total[month] = this.getTotals(payrollDatas,month);
      }
      total['total'] = this.getTotals(payrollDatas,'total');
      payrollDatas.push(total);
    }


    const conditionalRowStyles = [
      {
        when: (row) => row.nurse == 'total',
        style: row => ({
          backgroundColor: 'rgb(160,160,160)',
        }),
      }
    ];

    return (
      <MDBContainer>
          <div className="pt-5 text-center text-dark">
            <h1 className="mt-3">PAY ROLL</h1>
          </div>
          <MDBRow className=" align-items-center justify-content-center">
            <MDBCol md="2">
              <Form.Group>
                <Form.Control type="number" value={selYear} placeholder="Year" onChange = {(e) =>this.onChangeYear(e)}/>
              </Form.Group>
            </MDBCol>
          </MDBRow>
          <MDBRow className='mt-2'>   
            <DataTable
                columns={payrollColumns} 
                data={payrollDatas}
                fixedHeader
                striped
                conditionalRowStyles={conditionalRowStyles}
                fixedHeaderScrollHeight={'60vh'}
                pagination
            />
          </MDBRow>
      </MDBContainer>
    );
  };
}

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});
export default connect(mapStateToProps,null)(PayRoll)