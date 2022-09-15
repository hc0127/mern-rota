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

    let nurseDatas = [{
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
    }];

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1 > 9 ? date.getMonth()+1 : '0'+(date.getMonth()+1);
    let beforemonth = date.getMonth() > 9 ? date.getMonth() : '0'+date.getMonth();
    let day = date.getDate() > 9 ? date.getDate() : '0'+date.getDate();
    let afterday = date.getDate()+1 > 9 ? date.getDate()+1 : '0'+(date.getDate()+1);

    let from = year+'-'+beforemonth+'-'+afterday;
    let to = year+'-'+month+'-'+day;

    basic.nurses.map((nurse) =>{
      let nurseLevel = nurse.level;
        nurseDatas[nurseLevel].members++;
        nurseDatas[2].members++;
        nurse.rota.map((rota) =>{
          if(rota.date >= from && rota.date <= to){
            nurseDatas[nurseLevel].assigned += rota.hour*1;
            nurseDatas[2].assigned += rota.hour*1;
          }
        });
    });
    nurseDatas.map((nurseData) =>{
        nurseData.available = nurseData.members * 208;
        nurseData.overtime = nurseData.assigned*1 - nurseData.available*1;
        nurseData.utilization = parseFloat(nurseData.assigned*1 / nurseData.available*1 * 100).toFixed(2) + '%';
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