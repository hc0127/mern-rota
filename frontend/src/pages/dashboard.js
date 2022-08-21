import React, { Component } from 'react';
import './../App.css';
import {Form} from 'react-bootstrap';
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';
import {
    MDBContainer,MDBRow,MDBCol,MDBCard,MDBCardHeader,MDBCardTitle,MDBCardBody,MDBCardText
} from 'mdb-react-ui-kit'
import basic from './basic';

class DashBoard extends Component {
  constructor(props) {
      super(props);
  }
  componentDidMount() {
  }
  
  render() {
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

    let nurseDatas = [
        {
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
        }
    ];

    basic.nurses.map((nurse) =>{
        nurseDatas[nurse.level-1].members++;
        nurseDatas[2].members++;
        nurse.rota.map((rota) =>{
            nurseDatas[nurse.level-1].available += rota.hour*1;
            nurseDatas[2].available += rota.hour*1;
            nurseDatas[nurse.level-1].assigned += rota.hour*1;
            nurseDatas[2].assigned += rota.hour*1;
        });
    });

    nurseDatas.map((nurseData) =>{
        nurseData.overtime = nurseData.assigned*1 - nurseData.available*1;
        nurseData.utilization = (nurseData.assigned*1 / nurseData.available*1) * 100 + '%';
    });

    return (
      <MDBContainer>
        <div className="pt-5 text-center text-dark">
          <MDBRow className='mt-5'>   
                <DataTable
                    columns={nurseColumns} 
                    data={nurseDatas}
                    fixedHeader
                    height={'300px'}
                />
          </MDBRow>
        </div>
      </MDBContainer>
    );
  };
}

const mapStateToProps = (BasicData) => ({
  basic:BasicData.BasicData
});
export default connect(mapStateToProps,null)(DashBoard)