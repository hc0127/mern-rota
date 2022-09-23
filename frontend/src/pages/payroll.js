import React, { Component } from 'react';
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';
import {
  MDBCol,MDBContainer,MDBRow
} from 'mdb-react-ui-kit';
import {Form} from 'react-bootstrap';

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
        selector: (row) => row[month],
      });
    }
    
    payrollColumns.push({
      name: "Total",
      center:true,
      wrap:true,
      selector: (row) => row['total'],
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
      let date = selYear+selMonth+'-01';
      let firstDate = new Date(date).getDay();
      if(firstDate == 0){firstDate = 7}
      for(let selDay = 7- firstDate;selDay < daysInMonth;selDay+=7){
        let day = selDay > 9?selDay:'0'+selDay;
        
        let key = monthNumbers[selMonth];
        if(sundaysPerMonth[key] == undefined){sundaysPerMonth[key] = [];}
        sundaysPerMonth[key].push(selYear+'-'+selMonth+'-'+day);
      }
    }
    
    basic.nurses.map((nurse) =>{
      let salary = nurse.basic_allowances+nurse.housing_allowances+nurse.other_allowances;
      let basicPerDay = parseInt(nurse.basic_allowances*15/365/8);
      let holidayPerDay = parseInt(nurse.basic_allowances*18/365/8);

      //leave days
      let leaves = nurse.leave;
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
      rotas.map(rota =>{
        if(rota.date.startsWith(selYear)){
          let month = monthNumbers[[rota.date.slice(5,7)]];
          if(rotaPerMonth[month] == undefined){
            rotaPerMonth[month] = rota.hour;
          }else{
            rotaPerMonth[month] += rota.hour;
          }
        }
      });
      //datatable set
      let payrollPerMonth = []; 
      let offdaysPerMonth = [];
      let dutyHoursPerMonth = [];
      for(let selMonth in monthNames){
        let daysInMonth = new Date(selYear, monthNames[selMonth], 0).getDate();
        if(leavedaysPerMonth[selMonth] == undefined){leavedaysPerMonth[selMonth] = [];}
        if(holidaysPerMonth[selMonth] == undefined){holidaysPerMonth[selMonth] = [];}
        if(sundaysPerMonth[selMonth] == undefined){sundaysPerMonth[selMonth] = [];}

        offdaysPerMonth[selMonth] = [...leavedaysPerMonth[selMonth],...holidaysPerMonth[selMonth],...sundaysPerMonth[selMonth]];
        offdaysPerMonth[selMonth] = [...new Set(offdaysPerMonth[selMonth])];
        dutyHoursPerMonth[selMonth] = (daysInMonth-offdaysPerMonth[selMonth].length)*8;

        if(rotaPerMonth[selMonth] == undefined){rotaPerMonth[selMonth] = 0;}
        if(dutyHoursPerMonth[selMonth] >= rotaPerMonth[selMonth]){
          payrollPerMonth[selMonth] = salary;
        }else{
          let overtime = rotaPerMonth[selMonth] - dutyHoursPerMonth[selMonth];
          payrollPerMonth[selMonth] = salary+basicPerDay*overtime;
        }
      }
      let row = {};
      row.nurse = nurse.name;
      row.total = 0;
      for(let month in monthNames){
        row[month] = payrollPerMonth[month];
        row.total += row[month];
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
                <Form.Control type="number" value={selYear} placeholder="Year"  min={2022} onChange = {(e) =>this.onChangeYear(e)}/>
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