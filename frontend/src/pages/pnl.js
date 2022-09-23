import React, { Component } from 'react';
import {connect} from 'react-redux'
import DataTable from 'react-data-table-component';
import {
  MDBCol,MDBContainer,MDBRow
} from 'mdb-react-ui-kit';
import {Form} from 'react-bootstrap';

class PNL extends Component {
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
    let payrollDatas = [];

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
            <h1 className="mt-3">PROFIT & LOSS</h1>
          </div>
          <MDBRow className=" align-items-center justify-content-center">
            <MDBCol md="2">
              <Form.Group>
                <Form.Control type="number" value={selYear} placeholder="Year" onChange = {(e) =>this.onChangeYear(e)}/>
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
export default connect(mapStateToProps,null)(PNL)