import React, { Component } from 'react';
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';
import {
  MDBCol,MDBContainer,MDBRow
} from 'mdb-react-ui-kit';
import {Form} from 'react-bootstrap';

class WorkingDays extends Component {
  constructor(props) {
      super(props);

      let date = new Date();
      let year = date.getFullYear();
      
      this.state = {
        // selNurse:0,
        selYear:year
      };
  }
  componentDidMount() {
  }

  // onChangeNurse = (e) =>{
  //   this.setState({
  //     ...this.state,
  //     selNurse:e.target.value,
  //   });
  // }
  onChangeYear = (e) =>{
    this.setState({
      ...this.state,
      selYear:e.target.value,
    });
  }
  swap(json){
    let ret = [];
    for(var key in json){
      ret[json[key]] = key;
    }
    return ret;
  }
  
  render() {
    const {
      // selNurse,
      selYear
    } = this.state;
    const {basic} =this.props;
  
    const workingColumns = [
      {
        name: "Month",
        center:true,
        wrap:true,
        width:'100px',
        selector: (row) => row.month,
      },
      {
        name: "Days",
        center:true,
        wrap:true,
        width:'100px',
        selector: (row) => row.days,
      },
      {
        name: "Sundays",
        center:true,
        selector: (row) => row.sundays,
      },
      {
        name: "Holidays",
        center:true,
        wrap:true,
        width:'100px',
        selector: (row) => row.holidays,
      },
      // {
      //   name: "Leave Days",
      //   center:true,
      //   wrap:true,
      //   selector: (row) => row.leavedays,
      // },
      {
        name: "Net Working Days",
        center:true,
        selector: (row) => row.workingdays,
      },
      {
        name: "daily Hours",
        center:true,
        wrap:true,
        selector: (row) => row.hours,
      },
      {
        name: "Total Hours available",
        center:true,
        wrap:true,
        selector: (row) => row.totalhours,
      }
    ];

    let monthNames = basic.monthNames;
    let monthNumbers = this.swap(monthNames);

    let workingDatas = [];

    let holidays = basic.holidays;
    let leaves = [];
    
    let holidaysPerMonth = [];
    let sundaysPerMonth = [];
    let leavedaysPerMonth = [];
    //get leavedays per month
    // basic.nurses.map(nurse =>{
    //   if(nurse._id == selNurse){
    //     leaves = nurse.leave;
    //   }
    // });

    // for(let leave of leaves){
    //   let from = new Date(leave.from);
    //   let to = new Date(leave.to);
    //   for(let betweenDay = from;betweenDay <= to;){
    //     let year = betweenDay.getFullYear();
    //     let month = betweenDay.getMonth()+1>9?betweenDay.getMonth()+1:'0'+(betweenDay.getMonth()+1);
    //     let day = betweenDay.getDate()>9?betweenDay.getDate():'0'+betweenDay.getDate();
    //     if(year == selYear){
    //       let key = monthNumbers[month];
    //       if(leavedaysPerMonth[key] == undefined){leavedaysPerMonth[key] = [];}
    //       leavedaysPerMonth[key].push(year+'-'+month+'-'+day);
    //     }
    //     betweenDay.setDate(betweenDay.getDate() + 1);
    //   }
    // }
    //get holidays per month
    holidays.map(holiday =>{
      let key = monthNumbers[holiday.slice(0,2)];
      if(holidaysPerMonth[key] == undefined){holidaysPerMonth[key] = [];}
      holidaysPerMonth[key].push(selYear+'-'+holiday);
    });
    //get sundays per month
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
    //datatable set
    for(let selMonth in monthNames){
      let daysInMonth = new Date(selYear, monthNames[selMonth], 0).getDate();
      // if(leavedaysPerMonth[selMonth] == undefined){leavedaysPerMonth[selMonth] = [];}
      if(holidaysPerMonth[selMonth] == undefined){holidaysPerMonth[selMonth] = [];}
      if(sundaysPerMonth[selMonth] == undefined){sundaysPerMonth[selMonth] = [];}

      let offDays = [
        // ...leavedaysPerMonth[selMonth],
        ...holidaysPerMonth[selMonth],
        ...sundaysPerMonth[selMonth]];
      offDays = [...new Set(offDays)];
      let row={
        month:selMonth,
        days:daysInMonth,
        sundays:sundaysPerMonth[selMonth].length,
        holidays:holidaysPerMonth[selMonth].length,
        // leavedays:leavedaysPerMonth[selMonth].length,
        workingdays:daysInMonth - offDays.length,
        hours:8,
        totalhours:8*(daysInMonth - offDays.length)
      };

      workingDatas.push(row);
    }

    return (
      <MDBContainer>
          <div className="pt-5 text-center text-dark">
            <h1 className="mt-3">WORKING DAYS</h1>
          </div>
          <MDBRow className=" align-items-center justify-content-center">
            {/* <MDBCol md="2">
              <Form.Group>
                <Form.Select aria-label="nurse select" value={selNurse} onChange = {(e) =>this.onChangeNurse(e)}>
                <option value="0" >Select Nurse</option>
                {
                  basic.nurses.map((value,index) =>{
                    return <option key = {index} value={value._id}>{value.name}</option>
                  })
                }
                </Form.Select>
              </Form.Group>
            </MDBCol> */}
            <MDBCol md="2">
              <Form.Group>
                <Form.Control type="number" value={selYear} placeholder="Year"  onChange = {(e) =>this.onChangeYear(e)}/>
              </Form.Group>
            </MDBCol>
          </MDBRow>
          <MDBRow className='mt-2 workingTable'>   
            <DataTable
                columns={workingColumns} 
                data={workingDatas}
                fixedHeader
                fixedHeaderScrollHeight={'120vh'}
                striped
            />
          </MDBRow>
      </MDBContainer>
    );
  };
}

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});
export default connect(mapStateToProps,null)(WorkingDays)