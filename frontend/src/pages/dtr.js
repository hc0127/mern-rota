import React, { Component } from "react";
import { Form } from "react-bootstrap";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBBtnGroup,
} from "mdb-react-ui-kit";
import "../css/App.css";
import { IoMdDownload } from "react-icons/io";
import { CSVLink } from "react-csv";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";
import Autocomplete from "react-autocomplete";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { FaRegFilePdf } from "react-icons/fa";
import { Object } from "core-js";

class DTR extends Component {
  constructor(props) {
    super(props);
    let date = new Date();
    let year = date.getFullYear();
    let month =
      date.getMonth() + 1 > 9
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1);
    let day = new Date(year, month, 0).getDate();

    this.state = {
      type: 0,
      from: year + "-" + month + "-" + "01",
      to: year + "-" + month + "-" + day,
      selNurse: 0,
      selNurseValue: "",
      selPatient: 0,
      selPatientValue: "",
    };
  }
  setDate = (target, e) => {
    this.setState({
      ...this.state,
      [target]: e.target.value,
    });
  };
  onChangeNurse = (e) => {
    this.setState({
      ...this.state,
      selNurse: 0,
      selNurseValue: e.target.value,
    });
  };
  OnSelectNurse = (val, item) => {
    this.setState({
      ...this.state,
      selNurse: item.key,
      selNurseValue: val,
    });
  };

  onChangePatient = (e) => {
    // console.log(e.target);
    this.setState({
      ...this.state,
      selPatient: 0,
      selPatientValue: e.target.value,
    });
  };

  onSelectPatient = (val, item) => {
    this.setState({
      ...this.state,
      selPatient: item.key,
      selPatientValue: val,
    });
  };

  componentDidMount() {}

  render() {
    const { basic } = this.props;
    const { from, to, selNurse, selNurseValue, selPatient, selPatientValue } =
      this.state;

    let totalColumns = [];
    let totalDatas = [];

    totalColumns.push(
      {
        name: "Date",
        center: true,
        wrap: true,
        sortable: true,
        selector: (row) => row.date,
      },
      {
        name: "Patient",
        center: true,
        wrap: true,
        width: "20vw%",
        sortable: true,
        selector: (row) => row.patient,
      },
      {
        name: "Duty Start",
        center: true,
        wrap: true,
        width: "20vw",
        sortable: true,
        selector: (row) => row.duty_start,
      },
      {
        name: "Duty End",
        center: true,
        wrap: true,
        width: "20vw",
        sortable: true,
        selector: (row) => row.duty_end,
      },
      {
        name: "Hour",
        center: true,
        wrap: true,
        sortable: true,
        selector: (row) => row.hour,
      }
    );

    //show data per individual
    let dates = [];
    for (
      var d = new Date(from);
      d <= new Date(to);
      d.setDate(d.getDate() + 1)
    ) {
      let year = d.getFullYear();
      let month =
        d.getMonth() + 1 > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
      let day = d.getDate() > 9 ? d.getDate() : "0" + d.getDate();
      let dateFormat = year + "-" + month + "-" + day;
      dates.push(dateFormat);
    }

    let nurseList = [];
    let nurseAutoList = [];

    basic.nurses.map((nurse) => {
      nurseList[nurse._id] = nurse.name;
      if (nurse.name.includes(selNurseValue)) {
        nurseAutoList.push({
          label: nurse.name,
          key: nurse._id,
        });
      }
    });

    let patientList = [];
    let patientAutoList = [];

    basic.patients.map((patient) => {
      patientList[patient._id] = patient.name;
      if (patient.name.includes(selPatientValue)) {
        patientAutoList.push({
          label: patient.name,
          key: patient._id,
        });
      }
    });

    let leavedays = [];
    let thour = 0;
    let headers = [
      { label: "Date", key: "date" },
      { label: "Patient", key: "patient" },
      { label: "Duty Start", key: "duty_start" },
      { label: "Duty End", key: "duty_end" },
      { label: "Hour", key: "hour" },
    ];

    basic.nurses.map((nurse) => {
      if (nurse._id == selNurse) {
        let leaves = nurse.leave ? nurse.leave : [];

        for (let leave of leaves) {
          let leavefrom = new Date(leave.from);
          let leaveto = new Date(leave.to);
          for (let betweenDay = leavefrom; betweenDay <= leaveto; ) {
            let between = betweenDay.toISOString().slice(0, 10);
            if (between >= from && between <= to) {
              leavedays.push(between);
            }
            betweenDay.setDate(betweenDay.getDate() + 1);
          }
        }

        nurse.rota.map((rota) => {
          if (rota.date >= from && rota.date <= to) {
            if (selPatient == 0) {
              thour += rota.hour;
              let row = {
                date: rota.date,
                patient: patientList[rota.patient_id],
                duty_start: rota.duty_start,
                duty_end: rota.duty_end,
                hour: rota.hour,
              };
              totalDatas.push(row);
            } else {
              if (rota.patient_id == selPatient) {
                thour += rota.hour;
                let row = {
                  date: rota.date,
                  patient: patientList[rota.patient_id],
                  duty_start: rota.duty_start,
                  duty_end: rota.duty_end,
                  hour: rota.hour,
                };
                totalDatas.push(row);
              }
            }
          }
        });
      }
    });

    if (selNurse != 0) {
      let total = {
        date: "Total",
        hour: thour,
      };
      totalDatas.push(total);
    }
    totalDatas.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0));

    function generate() {
      const doc = new jsPDF("a4", "pt", "letter");

      var img = new Image();
      var src = "https://i.postimg.cc/wMgr6Tr0/converted.jpg";
      img.src = src;

      const rows = [];

      const columns = [];
      //making dynamic header
      headers.map((key) => columns.push({ header: key.label }));

      totalDatas.map((key) =>
        rows.push(
          Object.values([
            key.date,
            key.patient,
            key.duty_start,
            key.duty_end,
            key.hour,
          ])
        )
      );

      doc.setFontSize(20);
      doc.addImage(img, "JPEG", 420, 15, 160, 30);
      doc.text(175, 80, "DAILY TIME RECORD (DTR)");

      doc.autoTable(columns, rows, {
        margin: { top: 100, left: 50, right: 50, bottom: 50 },
        theme: "grid",
      });
      totalDatas.sort((a, b) =>
        a.date > b.date ? 1 : b.date > a.date ? -1 : 0
      );
      doc.setFontSize(10);
      const pageCount = doc.internal.getNumberOfPages();

      for (var i = 1; i <= pageCount; i++) {
        // Go to page i
        doc.setPage(i);
        doc.text(
          String(i) + "/" + String(pageCount),
          325 - 20,
          805 - 30,
          null,
          null,
          "center"
        );
      }
      doc.save("dtr.pdf");
    }

    return (
      <MDBContainer>
        <div className="pt-5 text-center text-dark">
          <h1 className="mt-3">DAILY TIME RECORD (DTR)</h1>
        </div>
        <MDBRow>
          <MDBCol>
            <div className="row lex align-items-center justify-content-center">
              <MDBCol className="autocomplete ncard">
                <Autocomplete
                  getItemValue={(item) => item.label}
                  items={nurseAutoList}
                  inputProps={{ placeholder: "Select Nurses" }}
                  renderItem={(item, isHighlighted) => (
                    <div
                      style={{
                        background: isHighlighted ? "#2E86C1" : "white",
                        color: isHighlighted ? "white" : "black",
                        borderRadius: "1px",
                        backgroundColor: "white",
                        fontSize: "15px",
                        fontFamily: "Arial",
                      }}
                    >
                      {item.label}
                    </div>
                  )}
                  value={selNurseValue}
                  onChange={(e) => this.onChangeNurse(e)}
                  onSelect={(val, item) => this.OnSelectNurse(val, item)}
                />
              </MDBCol>
              <MDBCol className="autocomplete ncard">
                <Autocomplete
                  getItemValue={(item) => item.label}
                  items={patientAutoList}
                  inputProps={{ placeholder: "Select Patients" }}
                  renderItem={(item, isHighlighted) => (
                    <div
                      style={{
                        background: isHighlighted ? "#2E86C1" : "white",
                        color: isHighlighted ? "white" : "black",
                        borderRadius: "1px",
                        backgroundColor: "white",
                        fontSize: "15px",
                        fontFamily: "Arial",
                      }}
                    >
                      {item.label}
                    </div>
                  )}
                  value={selPatientValue}
                  onChange={(e) => this.onChangePatient(e)}
                  onSelect={(val, item) => this.onSelectPatient(val, item)}
                />
              </MDBCol>
              <MDBCol>
                <Form.Group>
                  <Form.Control
                    type="date"
                    value={from}
                    max={to}
                    onChange={(e) => this.setDate("from", e)}
                  />
                </Form.Group>
              </MDBCol>
              <MDBCol>
                <Form.Group>
                  <Form.Control
                    type="date"
                    value={to}
                    min={from}
                    onChange={(e) => this.setDate("to", e)}
                  />
                </Form.Group>
              </MDBCol>
              <MDBCol>
                <CSVLink
                  headers={headers}
                  data={totalDatas}
                  filename={"dtr.csv"}
                  className="btn btn-success Pbtn-success1"
                  target="_blank"
                >
                  <IoMdDownload />
                  Export
                </CSVLink>
              </MDBCol>
              <MDBCol>
                <button
                  className="btn btn-success Pbtn-success2"
                  target="_blank"
                  onClick={() => generate()}
                >
                  <FaRegFilePdf /> PDF
                </button>
              </MDBCol>
            </div>
            <div className="p-2">
              <DataTable
                columns={totalColumns}
                data={totalDatas}
                striped
                fixedHeader
                fixedHeaderScrollHeight={"60vh"}
              />
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    );
  }
}

const mapStateToProps = (BasicData) => ({
  basic: BasicData.BasicData,
});
export default connect(mapStateToProps, null)(DTR);
