import React, { Component } from 'react';
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
      let day = new Date(year,month,0).getDate();
      
      this.state = {
        type:0,
        from:year+'-'+month+'-'+'01',
        to:year+'-'+month+'-'+day,
        selNurse:0
      };
  }
  setDate = (target,e) =>{
    this.setState({
      ...this.state,
      [target]:e.target.value
    });
  }
  onChangeNurse = (e) =>{
    this.setState({
      ...this.state,
      selNurse:e.target.value
    });
  }
  componentDidMount() {
  }
  
  render() {
    const {basic} = this.props;
    const {from,to,selNurse} = this.state;

    let totalColumns = [];
    let totalDatas = [];
    let details = [];

    totalColumns.push({
        name: "Date",
        center:true,
        wrap:true,
        selector: (row) => row.date,
      }
      // ,{
      //   name: "Detail",
      //   center:true,
      //   wrap:true,
      //   width:'70%',
      //   selector: (row) => row.detail,
      // }
      ,{
        name: "Patient",
        center:true,
        wrap:true,
        width:'20vw%',
        sortable:true,
        selector: (row) => row.patient,
      }
      ,{
        name: "Duty Start",
        center:true,
        wrap:true,
        width:'20vw',
        sortable:true,
        selector: (row) => row.duty_start,
      }
      ,{
        name: "Duty End",
        center:true,
        wrap:true,
        width:'20vw',
        sortable:true,
        selector: (row) => row.duty_end,
      }
      ,{
        name: "Hour",
        center:true,
        wrap:true,
        sortable:true,
        selector: (row) => row.hour,
    });

    //show data per individual
    let dates = [];
    for (var d = new Date(from); d <= new Date(to); d.setDate(d.getDate() + 1)) {
        let year = d.getFullYear();
        let month = d.getMonth()+1 > 9 ? d.getMonth()+1 : '0'+(d.getMonth()+1);
        let day = d.getDate() > 9 ? d.getDate() : '0'+d.getDate();
        let dateFormat = year+'-'+month+'-'+day;
        dates.push(dateFormat);
      }
    
    let patientList = [];
    basic.patients.map((patient) =>{
      patientList[patient._id] = patient.name;
    });

    let hours = {};
    let leavedays = [];
    let thour = 0;

    basic.nurses.map((nurse) =>{
      if(nurse._id == selNurse){
        let leaves = nurse.leave?nurse.leave:[];

        for(let leave of leaves){
          let leavefrom = new Date(leave.from);
          let leaveto = new Date(leave.to);
          for(let betweenDay = leavefrom;betweenDay <= leaveto;){
            let between = betweenDay.toISOString().slice(0,10);
            if(between >= from && between <= to){
              leavedays.push(between);
            }
            betweenDay.setDate(betweenDay.getDate() + 1);
          }
        }

        nurse.rota.map((rota)=>{
          if(rota.date >= from && rota.date <= to){
            // if(details[rota.date] == undefined){
            //   details[rota.date] = patientList[rota.patient_id]+"("+rota.duty_start+"~"+rota.duty_end+"-"+rota.hour+"hour)";
            //   hours[rota.date] = rota.hour;
            // }else{
            //   details[rota.date] += ","+patientList[rota.patient_id]+"("+rota.duty_start+"~"+rota.duty_end+"-"+rota.hour+"hour)";
            //   hours[rota.date] += rota.hour;
            // }
            thour += rota.hour;
            let row = {
              date:rota.date,
              patient:patientList[rota.patient_id],
              duty_start:rota.duty_start,
              duty_end:rota.duty_end,
              hour:rota.hour,
            }
            totalDatas.push(row);
          }
        });
      }
    });

    if(selNurse != 0){
      // for(var i of dates){
      //   let row = {
      //     date:i,
      //     detail:details[i]?details[i]:leavedays.includes(i)?'Off Day':'N/A',
      //     hour:hours[i]?hours[i]:0,
      //   };
      //   totalDatas.push(row);
      // }
      
      let thour = Object.values(hours).reduce((a,b) => a+b,0);
      
      let total = {
        date:'Total',
        // detail:'',
        hour:thour
      }
      totalDatas.push(total);
    }

    //show all nurse data.
    // details['date'] = [];
    // for (var d = new Date(from); d <= new Date(to); d.setDate(d.getDate() + 1)) {
      //   let year = d.getFullYear();
      //   let month = d.getMonth()+1 > 9 ? d.getMonth()+1 : '0'+(d.getMonth()+1);
      //   let day = d.getDate() > 9 ? d.getDate() : '0'+d.getDate();
      //   let dateFormat = year+'-'+month+'-'+day;
      //   details['date'].push(dateFormat);
      // }

    // basic.nurses.map((nurse,nurseIndex) =>{
    //   totalColumns.push({
    //     name: nurse.name,
    //     center:true,
    //     wrap:true,
    //     selector: (row) => row[nurseIndex],
    //   });

    //   if(details[nurseIndex] == undefined){
    //     details[nurseIndex] = [];
    //   }

    //   nurse.rota.map((rota) =>{
    //     if(from<rota.date && rota.date<= to){
    //       let date = rota.date;
    //       if(details[nurseIndex][date] == undefined){
    //         details[nurseIndex][date] = rota.hour;
    //       }else{
    //         details[nurseIndex][date] += rota.hour;
    //       }
    //     }
    //   });
    //   for (var d = new Date(from); d <= new Date(to); d.setDate(d.getDate() + 1)) {
    //     let year = d.getFullYear();
    //     let month = d.getMonth()+1 > 9 ? d.getMonth()+1 : '0'+(d.getMonth()+1);
    //     let day = d.getDate() > 9 ? d.getDate() : '0'+d.getDate();
    //     let dateFormat = year+'-'+month+'-'+day;
    //     if(details[nurseIndex][dateFormat] == undefined){
    //       details[nurseIndex][dateFormat] = 0;
    //     }
    //     details[nurseIndex].sort((a,b) => (a.date > b.date) ? 1 : (a.date < b.date ? -1 : 0));
    //   }
    // });

    // let dates = details['date'];
    // for(var i of dates){
    //   let row = [];
    //   row.date = i;
    //   for(var j in details){
    //     if(j != "date"){
    //       let hour = details[j][i];
    //       row[j] = hour;
    //     }
    //   }
    //   totalDatas.push(row);
    // }

    return (
      <MDBContainer>
        <div className="pt-5 text-center text-dark">
          <h1 className="mt-3">DAILY TIME RECORD</h1>
        </div>
        <div className='row'>
          <div className='col'>
              <div className="row lex align-items-center justify-content-center">
                <div className='col-md-3'>
                  <Form.Group>
                    <Form.Select aria-label="patient select" value={selNurse} onChange = {(e) =>this.onChangeNurse(e)}>
                      <option value="0" >Select Nurse</option>
                      {
                        basic.nurses.map((value,index) =>{
                          return <option key = {index} value={value._id}>{value.name}</option>
                        })
                      }
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className='col-md-3'>
                  <Form.Group>
                    <Form.Control type="date" value={from} max={to}  onChange = {(e) =>this.setDate('from',e)} />
                  </Form.Group>
                </div>
                <div className='col-md-3'>
                  <Form.Group>
                    <Form.Control type="date" value={to} min={from}  onChange = {(e) =>this.setDate('to',e)}/>
                  </Form.Group>
                </div>
            </div>
            <div className='p-2'>
              <DataTable 
                columns={totalColumns} 
                data={totalDatas}
                striped
                fixedHeader
                fixedHeaderScrollHeight={'60vh'}
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