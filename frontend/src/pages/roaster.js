import React, { Component } from 'react';
import './../App.css';
import './../react-confirm-alert.css';

import axios from 'axios'
import {Form} from 'react-bootstrap';
import { MDBContainer } from 'mdb-react-ui-kit';
import DataTable from 'react-data-table-component';
import {connect} from 'react-redux'
import {confirmAlert} from 'react-confirm-alert'
import TimePicker from 'react-bootstrap-time-picker';

import {
  npUpd
} from '../store/Actions/BasicAction';

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'


class Roaster extends Component {

  constructor(props) {
      super(props);
      this.state = {
        isEditable:false,
        selPatient:0,
        selYear:new Date().getFullYear(),
        selMonth:new Date().getMonth()+1,
        selMultiDay:1,
        assigns:[],
        assignPerDay:[],
      };
  }

  componentDidMount() {
  }

  save = () =>{
    const {basic} = this.props;
    const {isEditable,selPatient,selYear,selMonth,assigns} = this.state;
    if(isEditable){
      const _self = this;
      this.setState({
        ...this.state,
        isEditable:false,
      });
      
      axios.post('rota/assign',{
        patient_id:selPatient,
        year:selYear,
        month:selMonth,
        assignData:assigns
      })
      .then(function (response) {
        _self.props.assign(response.data);
      })
      .catch(function (error) {
      });

    }else{
      let assigns = [];
      let assignPerDay = [];
      let newAssign = [];
      let month = selYear+'-'+(selMonth<10?+'0'+String(selMonth):selMonth);
      let daysInMonth = new Date(selYear, selMonth, 0).getDate();

      if(selPatient !== 0){
        for(let i = 0; i < daysInMonth;i++){
          assignPerDay[i+1] = 0;
        }

        basic.nurses.map((nurse,nurseIndex)=>{
          nurse.rota.map((rota,rotaIndex)=>{
            if(rota.patient_id == selPatient && rota.date.includes(month)){
              let day = rota.date.slice(8)*1;
              assignPerDay[day]++;
              assigns.push({
                date : rota.date,
                day:day,
                nurse_name : nurse.name,
                nurse_short_id : nurse._id.slice(20),
                nurse_id : nurse._id,
                designation : nurse.level == 0 ? "Assistant" : "Registered",
                duty_start : rota.duty_start,
                duty_end : rota.duty_end,
                hour : rota.hour,
              })
            }
          });
        });
        
        for(let i = 0; i < daysInMonth;i++){
          if(assignPerDay[(i+1)*1] == 0){
            assignPerDay[(i+1)*1] = 1;
            newAssign.date = month+'-'+(i<9?+'0'+String(i+1):i+1);
            newAssign.day = (i+1)*1;
            newAssign.nurse_name = 'NA';
            newAssign.nurse_short_id = 'NA';
            newAssign.nurse_id = 'NA';
            newAssign.designation = 'NA';
            newAssign.duty_start = 'NA';
            newAssign.duty_end = 'NA';
            newAssign.hour = 'NA';
            
            assigns = [...assigns,{...newAssign}];
          }
        }
        assigns.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : ((a.duty_start > b.duty_start) ? 1 : ((b.duty_start > a.duty_start) ? -1 : 0))));

        let total = 0;
        for(var i in assignPerDay){
          for(var j=1;j<=assignPerDay[i];j++){
            assigns[total].rotation = j;
            total++;
          }
        }

      this.setState({
        ...this.state,
        isEditable:true,
        assigns:[...assigns],
        assignPerDay:[...assignPerDay]
      });
    }
  }
}

  multiAssign = () =>{
    const {isEditable,selPatient,selYear,selMonth,assigns,assignPerDay,selMultiDay} = this.state;
    
    let month = selYear+'-'+(selMonth<10?+'0'+String(selMonth):selMonth);

    let newAssign={};
    newAssign.date = month+'-'+(selMultiDay<9?+'0'+String(selMultiDay):selMultiDay);
    newAssign.day = (this.state.selMultiDay)*1;
    newAssign.rotation = assignPerDay[selMultiDay]+1;
    newAssign.nurse_name = 'NA';
    newAssign.nurse_name = 'NA';
    newAssign.nurse_short_id = 'NA';
    newAssign.nurse_id = 'NA';
    newAssign.designation = 'NA';
    newAssign.duty_start = 'NA';
    newAssign.duty_end = 'NA';
    newAssign.hour = 'NA';

    let n=0;
    assignPerDay[selMultiDay]++;
    for(let i = 1; i < selMultiDay*1+1; i++) {
      n += assignPerDay[i];
    }
    assigns.splice( n-1, 0,newAssign);

    this.setState({
      ...this.state,
      assigns:[...assigns],
      assignPerDay:[...assignPerDay]
    })
  }

  onChangePatient = (e) =>{
    this.setState({
      ...this.state,
      selPatient:e.target.value,
      isEditable:false,
    });
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
  onChangeMultiDay = (e) =>{
    this.setState({
      ...this.state,
      selMultiDay:e.target.value,
    });
  }
  onChangeNurse = (e,row) =>{
    const {basic} = this.props;
    let {assigns} = this.state; 

    assigns.map((assign,assignIndex) =>{
      if(assign.day == row.day && assign.rotation == row.rotation){
        basic.nurses.map((nurse,index) =>{
          if(nurse._id == e.target.value){
            assigns[assignIndex].nurse_name = nurse.name;
            assigns[assignIndex].nurse_id = nurse._id;
            assigns[assignIndex].nurse_short_id = nurse._id.slice(20);
            assigns[assignIndex].designation = nurse.level == 0 ? "Assistant" : "Registered" ;
          }
        })
      }
    });

    this.setState({
      ...this.state,
      assigns:[...assigns]
    });
  }
  onChangeDutyStart = (e,row) =>{
    
    const {basic} = this.props;
    let {assigns,selPatient} = this.state;
    var _self = this;
    var hour = parseInt(e/3600)>9?parseInt(e/3600):'0'+parseInt(e/3600);
    var min = (e%3600) == 0 ?"00":"30";
    var _start = hour+":"+min;
    var rotas;
    var isduplicate = false;

    var assignCount = assigns.length;
    var isAssign = false;
    
    let step = function(){
      return new Promise(function(resolve){   
        assigns.map((assign,index)=>{
          console.log(assign.duty_start,assign.duty_end,_start)
          if(assign.rotation !== row.rotation && assign.date == row.date && assign.duty_start != "NA" && assign.duty_end != "NA" &&  assign.duty_start<_start && assign.duty_end>_start){
            isAssign = true;
            toastr.info("Already Assign Hour!");
          }
          if(index == assignCount-1 && isAssign == false){
            resolve();
          }
        });
      }).then(function(){
        return new Promise(function(resolve){
          basic.nurses.map((nurse)=>{
            if(nurse._id == row.nurse_id){
              rotas = nurse.rota.length;
              if(rotas == 0){
                resolve();
              }
              nurse.rota.map((rota,rotaIndex)=>{
                if(rota.date == row.date && rota.duty_start<_start && rota.duty_end>_start){
                  isduplicate = true;
                  basic.patients.map((patient)=>{
                    if(rota.patient_id != selPatient && rota.patient_id == patient._id){
                      confirmAlert({
                        title: 'Duplicate Time',
                        message: 'Nurse is allocated for '+rota.duty_start+' to '+rota.duty_end+' to '+patient.name+'. You want to overwrite?',
                        buttons: [
                          {
                            label: 'Yes',
                            onClick: () => {  
                              resolve();   
                            }
                          },
                          {
                            label: 'No',
                            onClick: () => {
                            }
                          }
                        ]
                      });
                    }
                  });
                }
                if(rotaIndex == rotas-1 && isduplicate == false){
                  resolve();
                }
              });
            }
          });
        }).then(function(){
          assigns.map((assign,assignIndex) =>{
            if(assign.day == row.day && assign.rotation == row.rotation){
              basic.nurses.map((nurse) =>{
              if(nurse._id == row.nurse_id){
                assigns[assignIndex].duty_start = _start;
                  if(assigns[assignIndex].duty_end != 'NA'){
                    assigns[assignIndex].hour = Math.abs(assigns[assignIndex].duty_end.split(':')[0]-assigns[assignIndex].duty_start.split(':')[0]);
                  }
                }
              })
            }
          });
      
          _self.setState({
            ..._self.state,
            assigns:[...assigns]
          });
        });
      });
    }
    step();
  }
  onChangeDutyEnd = (e,row) =>{
    const {basic} = this.props;
    let {assigns,selPatient} = this.state; 
    var _self = this;
    var hour = parseInt(e/3600)>9?parseInt(e/3600):'0'+parseInt(e/3600);
    var min = (e%3600) == 0 ?"00":"30";
    var _end = hour+":"+min;
    var rotas;
    var isduplicate = false;
    
    var assignCount = assigns.length;
    var isAssign = false;

    let step = function(){
      return new Promise(function(resolve){   
        assigns.map((assign,index)=>{
          console.log(assign.duty_start,assign.duty_end,row.duty_start,_end)
          if(assign.rotation !== row.rotation && assign.date == row.date && assign.duty_start != "NA" && assign.duty_end != "NA" &&  assign.duty_end<row.duty_start && assign.duty_start>_end){
            isAssign = true;
            toastr.info("Already Assign Hour!");
          }
          if(index == assignCount-1 && isAssign == false){
            resolve();
          }
        });
      }).then(function(){
        return new Promise(function(resolve){
          basic.nurses.map((nurse)=>{
            if(nurse._id == row.nurse_id){
              rotas = nurse.rota.length;
              if(rotas == 0){
                resolve();
              }
              nurse.rota.map((rota,rotaIndex)=>{
                if(rota.date == row.date && rota.duty_end>row.duty_start && rota.duty_start<_end){
                  basic.patients.map((patient)=>{
                    if(rota.patient_id != selPatient && rota.patient_id == patient._id){
                      isduplicate = true;
                      confirmAlert({
                        title: 'Duplicate Time',
                        message: 'Nurse is allocated for '+rota.duty_start+' to '+rota.duty_end+' to '+patient.name+'. You want to overwrite?',
                        buttons: [
                          {
                            label: 'Yes',
                            onClick: () => {  
                              resolve();   
                            }
                          },
                          {
                            label: 'No',
                            onClick: () => {
                            }
                          }
                        ]
                      });
                    }
                  });
                }
                if(rotaIndex == rotas-1 && isduplicate == false){
                  resolve();
                }
              });
            }
          });
        }).then(function(){
          assigns.map((assign,assignIndex) =>{
            if(assign.day == row.day && assign.rotation == row.rotation){
              basic.nurses.map((nurse) =>{
              if(nurse._id == row.nurse_id){
                assigns[assignIndex].duty_end = _end;
                  if(assigns[assignIndex].duty_end != 'NA'){
                    assigns[assignIndex].hour = Math.abs(assigns[assignIndex].duty_end.split(':')[0]-assigns[assignIndex].duty_start.split(':')[0]);
                  }
                }
              })
            }
          });
      
          _self.setState({
            ..._self.state,
            assigns:[...assigns]
          });
        });
      });
    }
    step();
  }


  render() {
    const {basic} = this.props;
    const {selPatient,selMonth,selYear,selMultiDay,isEditable,assigns,assignPerDay} = this.state;
    let assignColumns = [];
    let assignDatas =[];
    let assignPerDayDatas =[];
    let newAssign = [];
    let assignHour;
    let month = selYear+'-'+(selMonth<10?+'0'+String(selMonth):selMonth);
    let daysInMonth = new Date(selYear, selMonth, 0). getDate();

    if(isEditable){
      assignColumns =[
        {
          name: "Date",
          center:true,
          wrap:true,
          selector: (row) => row.date,
        },{
          name: "Rotation No",
          center:true,
          wrap:true,
          selector: (row) => row.rotation,
        },
        {
          name: "Emp Name",
          center:true,
          wrap:true,
          width:'200px',
          cell: (row) => 
            <Form.Select aria-label="patient select" value={row._nurse_id} onChange = {(e) =>this.onChangeNurse(e,row)}>
              <option value="0" >Select Nurse</option>
              {
                
                basic.nurses.map((nurse,index) =>{
                  assignHour = 208;
                  
                  basic.nurses.map((_nurse,index) =>{
                    if(_nurse._id == nurse._id){
                      _nurse.rota.map(rota =>{
                        if(rota.date.includes(month) && rota.patient_id != selPatient){
                          assignHour -= rota.hour;
                        }
                      });
                    }
                  });

                  assigns.map((assign)=>{
                    if(assign.nurse_id == nurse._id && assign.hour != "NA"){
                      assignHour -= assign.hour;
                    }
                  });
                  return <option key = {index} value={nurse._id} className="assign" selected ={nurse._id == row.nurse_id?"selected":''}>{nurse.name}{"("+assignHour+")"}</option>
                })
              }
            </Form.Select>,
        },
        {
          name: "Emp ID",
          center:true,
          wrap:true,
          selector: (row) => row.nurse_short_id,
        },
        {
          name: "Designation",
          center:true,
          wrap:true,
          width:'100px',
          selector: (row) => row.designation,
        },
        {
          name: "Duty Start",
          center:true,
          wrap:true,
          width:'140px',
          cell: (row) => 
            <TimePicker start="08:00" end="20:00" step={30} value={row.duty_start == "NA"?"12:00":row.duty_start} disabled={row.nurse_id=="NA"?'disabled':''} onChange = {(e) =>this.onChangeDutyStart(e,row)} />
        },
        {
          name: "Duty End",
          center:true,
          wrap:true,
          width:'140px',
          selector: (row) => 
          <TimePicker start={row.duty_start == "NA"?"08:00":row.duty_start} end="20:00" step={30}  value={row.duty_end == "NA"?"12:00":row.duty_end} disabled={row.duty_start=="NA"?'disabled':''} onChange = {(e) =>this.onChangeDutyEnd(e,row)} />
        },
        {
          name: "Hour",
          center:true,
          wrap:true,
          width:'80px',
          selector: (row) => row.hour,
        },
      ];

      assignDatas = assigns;
      assignPerDayDatas = assignPerDay;
    }else{
      assignColumns =[
        {
          name: "Date",
          center:true,
          wrap:true,
          selector: (row) => row.date,
        },{
          name: "Rotation No",
          center:true,
          wrap:true,
          selector: (row) => row.rotation,
        },
        {
          name: "Emp Name",
          center:true,
          wrap:true,
          selector: (row) => row.nurse_name,
        },
        {
          name: "Emp ID",
          center:true,
          wrap:true,
          selector: (row) => row.nurse_short_id,
        },
        {
          name: "Designation",
          center:true,
          wrap:true,
          selector: (row) => row.designation,
        },
        {
          name: "Duty Start",
          center:true,
          wrap:true,
          selector: (row) => row.duty_start,
        },
        {
          name: "Duty End",
          center:true,
          wrap:true,
          selector: (row) => row.duty_end,
        },
        {
          name: "Hour",
          center:true,
          wrap:true,
          selector: (row) => row.hour,
        },
      ];

      if(selPatient != 0){

        for(let i = 0; i < daysInMonth;i++){
          assignPerDayDatas[i+1] = 0;
        }

        basic.nurses.map((nurse,nurseIndex)=>{
          nurse.rota.map((rota,rotaIndex)=>{
            if(rota.patient_id == selPatient && rota.date.includes(month)){
              let day = rota.date.slice(8)*1;
              assignPerDayDatas[day]++;
              assignDatas.push({
                date : rota.date,
                day : day,
                nurse_name : nurse.name,
                nurse_short_id : nurse._id.slice(20),
                nurse_id : nurse._id,
                designation : nurse.level == 0 ? "Assistant" : "Registered",
                duty_start : rota.duty_start,
                duty_end : rota.duty_end,
                hour : rota.hour,
              })
            }
          });
        });
        
        for(let i = 0; i < daysInMonth;i++){
          if(assignPerDayDatas[(i+1)*1] == 0){
            assignPerDayDatas[(i+1)*1] = 1;
            newAssign.date = month+'-'+(i<9?+'0'+String(i+1):i+1);
            newAssign.day = (i+1)*1;
            newAssign.nurse_name = 'NA';
            newAssign.nurse_short_id = 'NA';
            newAssign.nurse_id = 'NA';
            newAssign.designation = 'NA';
            newAssign.duty_start = 'NA';
            newAssign.duty_end = 'NA';
            newAssign.hour = 'NA';
            
            assignDatas = [...assignDatas,{...newAssign}];
          }
        }

        assignDatas.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : ((a.duty_start > b.duty_start) ? 1 : ((b.duty_start > a.duty_start) ? -1 : 0))));
        
        let total = 0;
        for(var i in assignPerDayDatas){
          for(var j=1;j<=assignPerDayDatas[i];j++){
            assignDatas[total].rotation = j;
            total++;
          }
        }
    
      }
    }

    const conditionalRowStyles = [
      {
        when: (row) => row.day%2 === 1,
        style: {
          backgroundColor: "rgba(225,225,225)"
        }
      }
    ];

    return (
      <MDBContainer>
        <div className="pt-5 text-center text-dark">
          <h1 className="mt-3">DUTY ROASTER</h1>
        </div>
        <div className="row lex align-items-center justify-content-center">
          <div className="col-md-3 col-xs-5">
            <Form.Group>
              <Form.Select aria-label="patient select" value={selPatient} onChange = {(e) =>this.onChangePatient(e)}>
                <option value="0" >Select Patient</option>
                {
                  basic.patients.map((value,index) =>{
                    return <option key = {index} value={value._id}>{value.name}</option>
                  })
                }
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-md-2 col-xs-3">
            <Form.Group>
              <Form.Control type="number" value={selYear} placeholder="Year"  min={2022} max={new Date().getFullYear()} onChange = {(e) =>this.onChangeYear(e)}/>
            </Form.Group>
          </div>
          <div className="col-md-1 col-xs-3">
            <Form.Group>
              <Form.Control type="number" value={selMonth} placeholder="Month" min={1} max={12}  onChange = {(e) =>this.onChangeMonth(e)}/>
            </Form.Group>
          </div>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary" onClick={() =>this.save()}>{isEditable?'save':'edit'}</button>
          </div>
          <div className='col-md-2'>
            <Form.Group>
              <Form.Control type="number" value={selMultiDay} placeholder="Month" min={1} max={daysInMonth}  onChange = {(e) =>this.onChangeMultiDay(e)}/>
            </Form.Group>
          </div>
          <div className='col-md-2'>
            <button type="button" className="btn btn-primary" onClick={() =>this.multiAssign()} disabled = {isEditable?'':'disabled'}>multi assign</button>
          </div>
        </div>
        <div className='row p-2'>
          <DataTable 
            columns={assignColumns} 
            data={assignDatas}
            fixedHeader
            striped
            fixedHeaderScrollHeight={'60vh'}
            conditionalRowStyles={conditionalRowStyles}
            pagination />
        </div>
      </MDBContainer>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
  assign:(data) =>dispatch(npUpd(data))
});

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});
export default connect(mapStateToProps,mapDispatchToProps)(Roaster)
