import React, { Component } from 'react';

import axios from 'axios'
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';
import {
  MDBCol,MDBContainer,MDBRow,MDBBtn,MDBBtnGroup
} from 'mdb-react-ui-kit';
import {Form,Modal} from 'react-bootstrap';
import { FaEdit,FaTrash } from "react-icons/fa";

import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

import { nAllUpd } from '../store/Actions/BasicAction';

class LeaveDays extends Component {
  constructor(props) {
    super(props);
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1 > 9 ? date.getMonth()+1 : '0'+(date.getMonth()+1);
    let day = date.getDate() > 9 ? date.getDate() : '0'+date.getDate();
    this.state = {
      from:year+'-'+month+'-'+day,
      to:year+'-'+month+'-'+day,
      selNurse:0,
      isOpen:false,
      modal:{
        nurse_id:'',
        leave_id:'',
        from:'',
        to:'',
      }
    };
  }

  componentDidMount() {
  }

  setDate = (target,e) =>{
    this.setState({
      ...this.state,
      [target]:e.target.value
    });
  }
  setModalDate = (target,e) =>{
    this.setState({
      ...this.state,
      modal:{
        ...this.state.modal,
        [target]:e.target.value
      }
    });
  }

  onChangeNurse = (e) =>{
    this.setState({
      ...this.state,
      selNurse:e.target.value,
    });
  }

  addLeave = () =>{
    var _self = this;
    const {selNurse,from,to} = this.state;
    if(selNurse == 0){
      toastr.info("Please select nurse!");
    }else{
      this.setState({
        selNurse:0,
      });
      
      axios.post('leave/add',{
        nurse_id:selNurse,
        from:from,
        to:to,
      })
      .then(function (response) {
        toastr.info("Add LeaveDays Success!");
        _self.props.getLeave(response.data);
      })
      .catch(function (error) {
      });
    }
  }

  leaveModal = (isOpen,row) =>{
    console.log(row);
    if(isOpen){
      this.setState({
        ...this.state,
        isOpen:isOpen,
        modal:{
          nurse_id:row.nurse_id,
          leave_id:row.leave_id,
          from:row.leave_start,
          to:row.leave_end,
        }
      });
    }else{
      this.setState({
        ...this.state,
        isOpen:isOpen,
      });
    }
  }

  editConfirmLeave = () =>{
    var _self = this;
    this.setState({
      isOpen:false,
    });

    axios.post('leave/edit',{
      ...this.state.modal
    })
    .then(function (response) {
      toastr.info("Modify LeaveDays Success!");
      _self.props.getLeave(response.data);
    })
    .catch(function (error) {
    });
  }

  removeLeave = (row) =>{
    var _self = this;
    axios.post('leave/remove',{
      nurse_id:row.nurse_id,
      leave_id:row.leave_id,
    })
    .then(function (response) {
      toastr.info("Remove LeaveDays Success!");
      _self.props.getLeave(response.data);
    })
    .catch(function (error) {
    });
  }
  
  render() {
    const {from,to,selNurse,modal,isOpen} = this.state;
    const {basic} =this.props;
    
    const leaveColumns = [
      {
        name: "No",
        center:true,
        wrap:true,
        selector: (row) => row.no,
      },
      {
        name: "Staff ID",
        center:true,
        wrap:true,
        selector: (row) => row.nurse_short_id,
      },
      {
        name: "Staff Name",
        center:true,
        selector: (row) => row.name,
      },
      {
        name: "Leave Start",
        center:true,
        wrap:true,
        selector: (row) => row.leave_start,
      },
      {
        name: "Leave End",
        center:true,
        selector: (row) => row.leave_end,
      },
      {
        name: "Leave Days",
        center:true,
        wrap:true,
        selector: (row) => row.leave_days,
      },
      {
        name: "Daily Hours",
        center:true,
        wrap:true,
        selector: (row) => row.daily_hours,
      },
      {
        name: "Leave Hours",
        center:true,
        wrap:true,
        selector: (row) => row.leave_hours,
      },
      {
        name: "Action",
        center:true,
        wrap:true,
        cell: (row) => [
        <MDBBtnGroup key={row.leave_id}>
          <MDBBtn outline size="sm" className='my-1 ms-1' onClick={() =>this.leaveModal(true,row)}><FaEdit /></MDBBtn>
          <MDBBtn outline size="sm" className='my-1 me-1' onClick={() =>this.removeLeave(row)}><FaTrash /></MDBBtn>
        </MDBBtnGroup>
        ]
      }
    ];

    let leaveDatas = [];
    let rowCount = 0;
    basic.nurses.map((nurse)=>{
      nurse.leave.map((leave) =>{
        const from = new Date(leave.from);
        const to = new Date(leave.to);
        let leave_days = Math.ceil((to - from) / (1000 * 60 * 60 * 24))+1;
        rowCount++;
        leaveDatas.push({
          no:rowCount,
          nurse_id:nurse._id,
          nurse_short_id:nurse._id.slice(20),
          name:nurse.name,
          leave_id:leave.leave_id,
          leave_start:leave.from,
          leave_end:leave.to,
          leave_days:leave_days,
          daily_hours:8,
          leave_hours:8*leave_days
        });
      });
    });

    return (
      <MDBContainer>
          <div className="pt-5 text-center text-dark">
            <h1 className="mt-3">LEAVE DAYS</h1>
          </div>
          <MDBRow className=" align-items-center justify-content-center">
            <MDBCol md="2">
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
            </MDBCol>
            <MDBCol md="2">
              <Form.Group>
                    <Form.Control type="date" value={from} max={to}  onChange = {(e) =>this.setDate('from',e)} />
              </Form.Group>
            </MDBCol>
            <MDBCol md="2">
              <Form.Group>
                    <Form.Control type="date" value={to} min={from}  onChange = {(e) =>this.setDate('to',e)} />
              </Form.Group>
            </MDBCol>
            <MDBCol md="2">
              <MDBBtn outline rounded  color='primary' onClick={() =>this.addLeave()}>Add Leave</MDBBtn>
            </MDBCol>
          </MDBRow>
          <MDBRow className='mt-5'>   
            <DataTable
                columns={leaveColumns} 
                data={leaveDatas}
                fixedHeader
                fixedHeaderScrollHeight={'60vh'}
            />
          </MDBRow>
          <Modal show={isOpen}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => this.leaveModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Leave Modify</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <MDBRow>
                <MDBCol>
                  <Form.Control type="date" value={modal.from} max={modal.to}  onChange = {(e) =>this.setModalDate('from',e)} />
                </MDBCol>
              </MDBRow>
              <MDBRow className="mt-2">
                <MDBCol>
                  <Form.Control type="date" value={modal.to} min={modal.from}  onChange = {(e) =>this.setModalDate('to',e)} />
                </MDBCol>
              </MDBRow>
            </Modal.Body>
            <Modal.Footer>
              <MDBBtn variant="secondary" onClick={() => this.leaveModal(false)}>
                Close
              </MDBBtn>
              <MDBBtn variant="primary" onClick={() => this.editConfirmLeave()}>
                Save
              </MDBBtn>
            </Modal.Footer>
          </Modal> 
      </MDBContainer>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
  getLeave:(data) =>dispatch(nAllUpd(data))
});

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});

export default connect(mapStateToProps,mapDispatchToProps)(LeaveDays)