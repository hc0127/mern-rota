import React, { Component } from 'react';
import './../App.css';
import axios from '../config/server.config'
import {
  DropdownButton,Dropdown,Button,Tab,Tabs,
  Row,Col,Modal,Form,FloatingLabel
} from 'react-bootstrap';
import {MDBContainer,MDBIcon,MDBBtn,MDBTabs,MDBRow,MDBCol} from 'mdb-react-ui-kit'
import DataTable from 'react-data-table-component';
import {
  nIns,nUpd,nDel,pIns,pUpd,pDel,lIns,lUpd,lDel,
} from './../store/Actions/BasicAction';
import {connect} from 'react-redux'

class Basic extends Component {
  constructor(props) {
      super(props);
      this.state = {
        nurse:{
          open:false,
          action_id:'0',
          modal:{
            name:'',
            address:'',
            image:'',
            cell:'',
            country:'',
            experience:'',
            date:'',
            workexp:'',
            level:'',
          }
        },patient:{
          open:false,
          action_id:'0',
          modal:{
            name:'',
            address:'',
            image:'',
            cell:'',
          }
        },level:{
          open:false,
          action_id:'0',
          modal:{
            level:'',
            rate:'',
          }
        }
      };
  }
  //Nurse Manage
  nurseModal = (open,data)  =>{
    if(data !== null && data != undefined){
      this.setState({
        nurse:{
          ...this.state.nurse,
          open:open,
          action_id:data._id,
          modal:{
            ...this.state.nurse.modal,
            ...data
          }
        }
      }); 
    }else{
      this.setState({
        nurse:{
          ...this.state.nurse,
          open:open,
          action_id:'0',
          modal:{
          }
        }
      });
    }
  }
  removeNurse = (data) =>{
    const _self = this;
    axios.post('nurse/remove',{
      _id:data._id
    })
    .then(function (response) {
      const _id = response.data._id;
      _self.props.nurseRemove(_id);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  nurseConfirm = () =>{
    const _self = this;
    this.setState({
      ...this.state,
      nurse:{
        ...this.state.nurse,
        open:false,
      }
    });
    
    axios.post('nurse/add',{
      ...this.state.nurse.modal,id:this.state.nurse.action_id
    })
    .then(function (response) {
      const res = response.data;
      const data = res.data;
      if(res.state === 'insert'){
        _self.props.nurseInsert(data);
      }else{
        console.log('aa',data._id)
        _self.props.nurseUpdate(data);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  onNurseImageChange = (e,_self) =>{
    var file = e.target.files[0];
    var reader = new FileReader();
    var image;
    reader.onloadend = function() {
      image = reader.result;
      _self.setState({
        nurse:{

          ..._self.state.nurse,
          modal:{
            ..._self.state.nurse.modal,
            image:image,
          }
        }
      })
    }
    reader.readAsDataURL(file);
  }
  nurseModalChange = (target,e) =>{
    this.setState({
      nurse:{
        ...this.state.nurse,
        modal:{
          ...this.state.nurse.modal,
          [target]:e.target.value
        }
      }
    });
  }
  //Patient Manage
  patientModal = (open,data)  =>{
    if(data !== null && data != undefined){
      this.setState({
        patient:{
          ...this.state.patient,
          open:open,
          action_id:data._id,
          modal:{
            ...this.state.patient.modal,
            ...data
          }
        }
      }); 
    }else{
      this.setState({
        patient:{
          ...this.state.patient,
          open:open,
          action_id:'0',
          modal:{
          }
        }
      });
    }
  }
  removePatient = (data) =>{
    const _self = this;
    axios.post('patient/remove',{
      _id:data._id
    })
    .then(function (response) {
      const _id = response.data._id;
      _self.props.patientRemove(_id);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  patientConfirm = () =>{
    const _self = this;
    this.setState({
      ...this.state,
      patient:{
        ...this.state.patient,
        open:false,
      }
    });
    
    axios.post('patient/add',{
      ...this.state.patient.modal,id:this.state.patient.action_id
    })
    .then(function (response) {
      const res = response.data;
      const data = res.data;
      if(res.state === 'insert'){
        _self.props.patientInsert(data);
      }else{
        _self.props.patientUpdate(data);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  onPatientImageChange = (e,_self) =>{
    var file = e.target.files[0];
    var reader = new FileReader();
    var image;
    reader.onloadend = function() {
      image = reader.result;
      _self.setState({
        patient:{
          ..._self.state.patient,
          modal:{
            ..._self.state.patient.modal,
            image:image,
          }
        }
      })
    }
    reader.readAsDataURL(file);
  }
  patientModalChange = (target,e) =>{
    this.setState({
      patient:{
        ...this.state.patient,
        modal:{
          ...this.state.patient.modal,
          [target]:e.target.value
        }
      }
    });
  }

  //Level Manage
  levelModal = (open,data)  =>{
    if(data !== null && data != undefined){
      this.setState({
        level:{
          ...this.state.level,
          open:open,
          action_id:data._id,
          modal:{
            ...this.state.level.modal,
            ...data
          }
        }
      }); 
    }else{
      this.setState({
        level:{
          ...this.state.level,
          open:open,
          action_id:'0',
          modal:{
          }
        }
      });
    }
  }
  removeLevel = (data) =>{
    const _self = this;
    axios.post('level/remove',{
      _id:data._id
    })
    .then(function (response) {
      const _id = response.data._id;
      _self.props.levelRemove(_id);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  levelConfirm = () =>{
    const _self = this;
    this.setState({
      ...this.state,
      level:{
        ...this.state.level,
        open:false,
      }
    });
    
    axios.post('level/add',{
      ...this.state.level.modal,id:this.state.level.action_id
    })
    .then(function (response) {
      const res = response.data;
      const data = res.data;
      if(res.state === 'insert'){
        _self.props.levelInsert(data);
      }else{
        _self.props.levelUpdate(data);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  levelModalChange = (target,e) =>{
    this.setState({
      level:{
        ...this.state.level,
        modal:{
          ...this.state.level.modal,
          [target]:e.target.value
        }
      }
    });
  }

  componentDidMount() {
  }

  render() {
      const {basic} = this.props;
      const {nurse,patient,level} = this.state;
      console.log('render',basic);

      const nurseColumns = [
        {
          name: "Full Name",
          center:true,
          wrap:true,
          width:'150px',
          selector: (row) => row.name,
        },
        {
          name: "Address",
          center:true,
          wrap:true,
          width:'150px',
          selector: (row) => row.address,
        },
        {
          name: "Image",
          center:true,
          wrap:true,
          width:'70px',
          cell: (d) => <img src={d.image} style={{width:'30px',height:'40px'}} />
        },
        {
          name: "Cell",
          center:true,
          selector: (row) => row.cell,
          sortable: true
        },
        {
          name: "Country",
          center:true,
          wrap:true,
          selector: (row) => row.country,
        },
        {
          name: "Experience",
          center:true,
          wrap:true,
          selector: (row) => row.experience,
        },
        {
          name: "JoinDate",
          center:true,
          wrap:true,
          selector: (row) => row.date,
          sortable: true
        },
        {
          name: "WorkExp",
          center:true,
          wrap:true,
          selector: (row) => row.workexp
        },
        {
          name: "Action",
          center:true,
          wrap:true,
          sortable: false,
          cell: (d) => [
            <DropdownButton key={d._id} id="dropdown-basic-button" title="Action" style={{width:'100px'}}>
              <Dropdown.Item href="#" onClick={() => this.nurseModal(true,d)}>edit</Dropdown.Item>
              <Dropdown.Item href= "#" onClick={() => this.removeNurse(d)}>delete</Dropdown.Item>
            </DropdownButton>
          ]
        }
      ];

      const patientColumns = [
        {
          name: "Full Name",
          center:true,
          wrap:true,
          width:'30%',
          selector: (row) => row.name,
        },
        {
          name: "Address",
          center:true,
          wrap:true,
          width:'30%',
          selector: (row) => row.address,
        },
        {
          name: "Image",
          center:true,
          wrap:true,
          width:'70px',
          cell: (d) => <img src={d.image} style={{width:'30px',height:'40px'}} />
        },
        {
          name: "Cell",
          center:true,
          width:'100px',
          selector: (row) => row.cell,
          sortable: true
        },
        {
          name: "Action",
          center:true,
          wrap:true,
          sortable: false,
          cell: (d) => [
            <DropdownButton key={d._id} id="dropdown-basic-button" title="Action" style={{width:'100px'}}>
              <Dropdown.Item href="#" onClick={() => this.patientModal(true,d)}>edit</Dropdown.Item>
              <Dropdown.Item href= "#" onClick={() => this.removePatient(d)}>delete</Dropdown.Item>
            </DropdownButton>
          ]
        }
      ];
      
      const levelColumns = [
        {
          name: "Level",
          center:true,
          wrap:true,
          selector: (row) => row.level,
        },
        {
          name: "Rate",
          center:true,
          wrap:true,
          selector: (row) => row.rate,
        },
        {
          name: "Action",
          center:true,
          cell: (d) => [
            <DropdownButton key={d._id} id="dropdown-basic-button" title="Action" style={{width:'100px'}}>
              <Dropdown.Item href="#" onClick={() => this.levelModal(true,d)}>edit</Dropdown.Item>
              <Dropdown.Item href= "#" onClick={() => this.removeLevel(d)}>delete</Dropdown.Item>
            </DropdownButton>
          ]
        }
      ];

      return (
          <MDBContainer>
              <div className="pt-5 text-center text-dark">
                <h1 className="mt-3">BASIC DATA</h1>
              </div>
              <Row>
                <Col>
                    <Tabs id="basic_tab" defaultActiveKey="nurse">
                        <Tab eventKey="nurse" key={1} title="nurse" className='p-2'>
                          <Button variant="primary" onClick={() => this.nurseModal(true,null)}>Add Nurse</Button>
                          <div className='p-2'>
                            <DataTable
                              id="nurseTable"
                              columns={nurseColumns} 
                              data={basic.nurses} 
                              fixedHeader
                              fixedHeaderScrollHeight={'300px'}
                              herader={'300px'}
                              pagination/>
                          </div>
                        </Tab>
                        <Tab eventKey="patient" key={2} title="patient" className='p-2'>
                          <Button variant="primary" onClick={() => this.patientModal(true)}>Add Patient</Button>
                          <div className='p-2'>
                            <DataTable
                              columns={patientColumns} 
                              data={basic.patients}
                              fixedHeader
                              fixedHeaderScrollHeight={'300px'}
                              pagination/>
                          </div>
                        </Tab>
                        <Tab eventKey="level" key={3} title="level" className='p-2'>
                          <Button variant="primary" onClick={() => this.levelModal(true)}>Add Level</Button>
                          <div className='p-2'>
                            <DataTable 
                              columns={levelColumns} 
                              data={basic.levels}
                              fixedHeader
                              fixedHeaderScrollHeight={'300px'}
                              height={'300px'}
                              pagination />
                          </div>
                        </Tab>
                    </Tabs>
                </Col>
              </Row>
              <Modal show={nurse.open}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => this.nurseModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Nurse {nurse.action_id == '0'?'Insert':'Edit'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="row mb-2 text-center">
                    <div className='col-md-6'>
                      <img alt="No Image" src={nurse.modal.image} style={{width:'90px',height:'120px'}}></img>
                    </div>
                    <div className='col-md-6'>
                      <Form.Group controlId="ImageInput" className="mt-3">
                        <Form.Label>Select Image File</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={(e) =>this.onNurseImageChange(e,this)} />
                      </Form.Group>
                    </div>
                  </div>
                  <div className='row'>
                    <Col>
                      <FloatingLabel
                        controlId="NameInput"
                        label="Full Name"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={nurse.modal.name} onChange={(e) => this.nurseModalChange('name',e)} placeholder="Full Name" />
                      </FloatingLabel>
                    </Col>
                    <Col>
                      <FloatingLabel 
                        controlId="AddressInput" 
                        label="Address"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={nurse.modal.address} onChange={(e) => this.nurseModalChange('address',e)} placeholder="Address" />
                      </FloatingLabel>
                    </Col>
                  </div>
                  <div className='row'>
                    <div className='col-md-3'>
                      <FloatingLabel
                        controlId="CellInput"
                        label="Cell Number"
                        className="mb-3"
                      >
                        <Form.Control type="number" value={nurse.modal.cell} onChange={(e) => this.nurseModalChange('cell',e)} placeholder="Cell Number" />
                      </FloatingLabel>
                    </div>
                    <div className='col-md-3'>
                      <FloatingLabel 
                        controlId="DateInput" 
                        label="Joining Date"
                        className="mb-3"
                      >
                        <Form.Control type="date" value={nurse.modal.date} onChange={(e) => this.nurseModalChange('date',e)} placeholder="Joining Date" />
                      </FloatingLabel>
                    </div>
                    <div className='col-md-6'>
                      <FloatingLabel 
                        controlId="CountryInput" 
                        label="Original Country"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={nurse.modal.country} onChange={(e) => this.nurseModalChange('country',e)} placeholder="Original Country" />
                      </FloatingLabel>
                    </div>
                  </div>
                  <div>
                    <Col>
                      <FloatingLabel
                        controlId="ExperienceInput"
                        label="Experience"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={nurse.modal.experience} onChange={(e) => this.nurseModalChange('experience',e)} placeholder="Experience" />
                      </FloatingLabel>
                    </Col>
                    <Col>
                      <FloatingLabel 
                        controlId="WorkingExperienceInput" 
                        label="Working Experience"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={nurse.modal.workexp} onChange={(e) => this.nurseModalChange('workexp',e)} placeholder="Working Experience" />
                      </FloatingLabel>
                    </Col>
                    <Col>
                      <Form.Select aria-label="patient select" value={nurse.modal.level} onChange = {(e) =>this.nurseModalChange('level',e)}>
                        <option value="0" >Select Level</option>
                        {
                          basic.levels.map((level,index) =>{
                            return <option key = {index} value={level.level} selected ={level.level == nurse.modal.level ?"selected":''}>{level.level}</option>
                          })
                        }
                      </Form.Select>
                    </Col>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button type="button" className='btn btn-secondary' onClick={() => this.nurseModal(false)}>
                    Close
                  </button>
                  <button  type="button" className='btn btn-primary' onClick={() => this.nurseConfirm()}>
                    Save
                  </button>
                </Modal.Footer>
              </Modal>   

              <Modal show={patient.open}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => this.patientModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Patient {patient.action_id == '0'?'Insert':'Edit'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row className="mb-2 text-center">
                    <Col xs={6}>
                      <img alt="No Image" src={patient.modal.image} style={{width:'90px',height:'120px'}}></img>
                    </Col>
                    <Col>
                      <Form.Group controlId="ImageInput" className="mt-3">
                        <Form.Label>Select Image File</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={(e) =>this.onPatientImageChange(e,this)} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FloatingLabel
                        controlId="NameInput"
                        label="Full Name"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={patient.modal.name} onChange={(e) => this.patientModalChange('name',e)} placeholder="Full Name" />
                      </FloatingLabel>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FloatingLabel 
                        controlId="AddressInput" 
                        label="Address"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={patient.modal.address} onChange={(e) => this.patientModalChange('address',e)} placeholder="Address" />
                      </FloatingLabel>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FloatingLabel
                        controlId="CellInput"
                        label="Cell Number"
                        className="mb-3"
                      >
                        <Form.Control type="number" value={patient.modal.cell} onChange={(e) => this.patientModalChange('cell',e)} placeholder="Cell Number" />
                      </FloatingLabel>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.patientModal(false)}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={() => this.patientConfirm()}>
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>   
                   
              <Modal show={level.open}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                onHide={() => this.levelModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Level {level.action_id == '0'?'Insert':'Edit'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row>
                    <Col>
                      <FloatingLabel
                        controlId="LevelInput"
                        label="Level"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={level.modal.level} onChange={(e) => this.levelModalChange('level',e)} placeholder="Level" />
                      </FloatingLabel>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <FloatingLabel 
                        controlId="RateInput" 
                        label="Rate"
                        className="mb-3"
                      >
                        <Form.Control type="text" value={level.modal.rate} onChange={(e) => this.levelModalChange('rate',e)} placeholder="Rat" />
                      </FloatingLabel>
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => this.levelModal(false)}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={() => this.levelConfirm()}>
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>  
          </MDBContainer>
      )
  }
}

const mapDispatchToProps = (dispatch) => ({
    nurseInsert:(data) =>dispatch(nIns(data)),
    nurseUpdate:(data) =>dispatch(nUpd(data)),
    nurseRemove:(_id) =>dispatch(nDel(_id)),
    patientInsert:(data) =>dispatch(pIns(data)),
    patientUpdate:(data) =>dispatch(pUpd(data)),
    patientRemove:(_id) =>dispatch(pDel(_id)),
    levelInsert:(data) =>dispatch(lIns(data)),
    levelUpdate:(data) =>dispatch(lUpd(data)),
    levelRemove:(_id) =>dispatch(lDel(_id)),
});

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});

export default connect(mapStateToProps,mapDispatchToProps)(Basic)