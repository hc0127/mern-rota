import React, { Component } from 'react';
import './../App.css';
import axios from 'axios'
import {Form} from 'react-bootstrap';
import { MDBContainer } from 'mdb-react-ui-kit';
import DataTable from 'react-data-table-component';
import {connect} from 'react-redux'

import {
  npUpd
} from '../store/Actions/BasicAction';
import assign from './assign';

// import toastr from 'toastr'
// import 'toastr/build/toastr.min.css'


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
      console.log(assigns);
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
        console.log(error);
      });

    }else{
      let assigns = [];
      let assignPerDay = [];
      let newAssign = [];
      let month = selYear+'-'+(selMonth<10?+'0'+String(selMonth):selMonth);
      let daysInMonth = new Date(selYear, selMonth, 0).getDate();
      if(selPatient !== 0){
        assignPerDay[0] = 0;
        for(let i = 0; i < daysInMonth;i++){
          assignPerDay[i+1] = 1;
          newAssign.date = month+'-'+(i<9?+'0'+String(i+1):i+1);
          newAssign.day = (i+1);
          newAssign.rotation = 1;
          newAssign.nurse_name = 'NA';
          newAssign.nurse_short_id = 'NA';
          newAssign.nurse_id = 'NA';
          newAssign.designation = 'NA';
          newAssign.duty_start = 'NA';
          newAssign.duty_end = 'NA';
          newAssign.hour = 'NA';
  
          assigns = [...assigns,{...newAssign}];
        }
        
        // basic.nurses.map(nurse =>{
        
        // });
      
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
    let {assigns} = this.state; 

    console.log(row);
    assigns.map((assign,assignIndex) =>{
      if(assign.day == row.day && assign.rotation == row.rotation){
        basic.nurses.map((nurse,index) =>{
          if(nurse._id == row.nurse_id){
            assigns[assignIndex].duty_start = e.target.value;
            if(assigns[assignIndex].duty_end != 'NA'){
              assigns[assignIndex].hour = Math.abs(assigns[assignIndex].duty_end.split(':')[0]-assigns[assignIndex].duty_start.split(':')[0]);
            }
          }
        })
      }
    });

    this.setState({
      ...this.state,
      assigns:[...assigns]
    });
  }
  onChangeDutyEnd = (e,row) =>{
    const {basic} = this.props;
    let {assigns} = this.state; 

    assigns.map((assign,assignIndex) =>{
      if(assign.day == row.day && assign.rotation == row.rotation){
        basic.nurses.map((nurse,index) =>{
          if(nurse._id == row.nurse_id){
            assigns[assignIndex].duty_end = e.target.value;
            assigns[assignIndex].hour = Math.abs(assigns[assignIndex].duty_end.split(':')[0]-assigns[assignIndex].duty_start.split(':')[0]);
          }
        })
      }
    });

    this.setState({
      ...this.state,
      assigns:[...assigns]
    });
  }


  render() {
    const {basic} = this.props;
    const {selPatient,selMonth,selYear,selMultiDay,isEditable,assigns,assignPerDay} = this.state;
    let assignColumns = [];
    let assignDatas =[];
    let assignPerDayDatas =[];
    let newAssign = [];
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
                  return <option key = {index} value={nurse._id} selected ={nurse._id == row.nurse_id?"selected":''}>{nurse.name}</option>
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
          width:'160px',
          cell: (row) => [
            <Form.Group>
              <Form.Control type="time" value={row.duty_start} disabled={row.nurse_id=="NA"?'disabled':''} onChange = {(e) =>this.onChangeDutyStart(e,row)}/>
            </Form.Group>
          ]
        },
        {
          name: "Duty End",
          center:true,
          wrap:true,
          width:'160px',
          selector: (row) => [
            <Form.Group>
              <Form.Control type="time" value={row.duty_end} disabled={row.duty_start=="NA" ? 'disabled':''}  onChange = {(e) =>this.onChangeDutyEnd(e,row)}/>
            </Form.Group>
          ]
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
          assignPerDayDatas[(i+1)*1] = 1;
          newAssign.date = month+'-'+(i<9?+'0'+String(i+1):i+1);
          newAssign.day = (i+1)*1;
          newAssign.rotation = 1;
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
    }

    return (
      <MDBContainer>
        <div className="pt-5 text-center text-dark">
          <h1 className="mt-3">Duty Roaster</h1>
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
            fixedHeaderScrollHeight={'60vh'}
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
