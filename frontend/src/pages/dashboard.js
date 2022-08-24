import React, { Component } from 'react';
import './../App.css';
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';
import {
    MDBContainer,MDBRow
} from 'mdb-react-ui-kit'
// import basic from './basic';

class DashBoard extends Component {
  constructor(props) {
      super(props);
  }
  componentDidMount() {
  }
  
  render() {
    const {basic,level} =this.props;
    
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

    let nurseDatas =[];
    let levels=[];

    basic.levels.map((level) =>{
      levels = [...levels,level.level]
      let nurseData = {
          type:level.level,
          members:0,
          available:0,
          assigned:0,
          overtime:0,
          utilization:0
      }
      nurseDatas.push(nurseData);
    });
    let levelCount = levels.length;

    let totalNurse = {
      type:'Total',
      members:0,
      available:0,
      assigned:0,
      overtime:0,
      utilization:0
    }

    nurseDatas.push(totalNurse);

    console.log(nurseDatas);

    basic.nurses.map((nurse) =>{
      let nurseLevel = levels.indexOf(nurse.level);
        nurseDatas[nurseLevel].members++;
        nurseDatas[levelCount].members++;
        nurse.rota.map((rota) =>{
            nurseDatas[nurseLevel].available += rota.hour*1;
            nurseDatas[levelCount].available += rota.hour*1;
            nurseDatas[nurseLevel].assigned += rota.hour*1;
            nurseDatas[levelCount].assigned += rota.hour*1;
        });
    });

    for(var i of nurseDatas){
      console.log(i);
    }
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