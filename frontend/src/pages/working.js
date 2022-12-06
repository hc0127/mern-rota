import React, { Component } from "react";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";
import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import { IoMdDownload } from "react-icons/io";
import { CSVLink } from "react-csv";
import { Form } from "react-bootstrap";
import { FaRegFilePdf } from "react-icons/fa";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import "./../css/App.css";
import { Object } from "core-js";

class WorkingDays extends Component {
  constructor(props) {
    super(props);

    let date = new Date();
    let year = date.getFullYear();

    this.state = {
      selYear: year,
    };
  }
  onChangeYear = (e) => {
    this.setState({
      ...this.state,
      selYear: e.target.value,
    });
  };
  swap(json) {
    let ret = [];
    for (var key in json) {
      ret[json[key]] = key;
    }
    return ret;
  }

  render() {
    const { selYear } = this.state;
    const { basic } = this.props;

    const workingColumns = [
      {
        name: "Month",
        center: true,
        wrap: true,
        width: "100px",
        selector: (row) => row.month,
      },
      {
        name: "Days",
        center: true,
        wrap: true,
        width: "100px",
        selector: (row) => row.days,
      },
      {
        name: "Sundays",
        center: true,
        selector: (row) => row.sundays,
      },
      {
        name: "Holidays",
        center: true,
        wrap: true,
        width: "100px",
        selector: (row) => row.holidays,
      },
      {
        name: "Net Working Days",
        center: true,
        selector: (row) => row.workingdays,
      },
      {
        name: "daily Hours",
        center: true,
        wrap: true,
        selector: (row) => row.hours,
      },
      {
        name: "Total Hours available",
        center: true,
        wrap: true,
        selector: (row) => row.totalhours,
      },
    ];

    let monthNames = basic.monthNames;
    let monthNumbers = this.swap(monthNames);

    let workingDatas = [];

    let holidays = basic.holidays;
    let headers = [
      { label: "Month", key: "month" },
      { label: "Days", key: "days" },
      { label: "Sundays", key: "sundays" },
      { label: "Holidays", key: "holidays" },
      { label: "Net Working Days", key: "workingdays" },
      { label: "daily Hours", key: "hours" },
      { label: "Total Hours available", key: "totalhours" },
    ];

    let holidaysPerMonth = [];
    let sundaysPerMonth = [];
    //get holidays per month
    holidays.map((holiday) => {
      let key = monthNumbers[holiday.slice(0, 2)];
      if (holidaysPerMonth[key] == undefined) {
        holidaysPerMonth[key] = [];
      }
      holidaysPerMonth[key].push(selYear + "-" + holiday);
    });
    //get sundays per month
    for (let selMonth in monthNumbers) {
      let daysInMonth = new Date(selYear, selMonth, 0).getDate();
      let date = selYear + "-" + selMonth + "-01";
      let firstDate = new Date(date).getDay();
      if (firstDate == 0) {
        firstDate = 1;
      } else {
        firstDate = 7 - firstDate + 1;
      }
      for (let selDay = firstDate; selDay < daysInMonth; selDay += 7) {
        let day = selDay > 9 ? selDay : "0" + selDay;

        let key = monthNumbers[selMonth];
        if (sundaysPerMonth[key] == undefined) {
          sundaysPerMonth[key] = [];
        }
        sundaysPerMonth[key].push(selYear + "-" + selMonth + "-" + day);
      }
    }
    //datatable set
    for (let selMonth in monthNames) {
      let daysInMonth = new Date(selYear, monthNames[selMonth], 0).getDate();
      if (holidaysPerMonth[selMonth] == undefined) {
        holidaysPerMonth[selMonth] = [];
      }
      if (sundaysPerMonth[selMonth] == undefined) {
        sundaysPerMonth[selMonth] = [];
      }

      let offDays = [
        ...holidaysPerMonth[selMonth],
        ...sundaysPerMonth[selMonth],
      ];
      offDays = [...new Set(offDays)];
      let row = {
        month: selMonth,
        days: daysInMonth,
        sundays: sundaysPerMonth[selMonth].length,
        holidays: holidaysPerMonth[selMonth].length,
        workingdays: daysInMonth - offDays.length,
        hours: 8,
        totalhours: 8 * (daysInMonth - offDays.length),
      };

      workingDatas.push(row);
    }

    function generate() {
      const doc = new jsPDF("a4", "pt", "letter");
      var img = new Image();
      var src = "https://i.postimg.cc/wMgr6Tr0/converted.jpg";
      img.src = src;
      const rows = [];

      const columns = [];
      // making dynamic headers
      headers.map((key) => columns.push({ header: key.label }));

      workingDatas.map((key) =>
        rows.push(
          Object.values([
            key.month,
            key.days,
            key.sundays,
            key.holidays,
            key.workingdays,
            key.hours,
            key.totalhours,
          ])
        )
      );
      doc.addImage(img, "JPEG", 420, 15, 160, 30);
      doc.setFontSize(20);
      doc.text(237, 80, "Working Days");
      doc.autoTable(columns, rows, {
        margin: { top: 100, left: 30, right: 30, bottom: 50 },
        theme: "grid",
      });
      doc.setFontSize(10);
      const pageCount = doc.internal.getNumberOfPages();

      for (var i = 1; i <= pageCount; i++) {
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
      doc.save("working.pdf");
    }

    return (
      <MDBContainer>
        <div className="pt-5 text-center text-dark">
          <h1 className="mt-3">WORKING DAYS</h1>
        </div>
        <MDBRow className=" align-items-center justify-content-center">
          <MDBCol md="2">
            <Form.Group>
              <Form.Control
                className="Rform-control1"
                type="number"
                value={selYear}
                placeholder="Year"
                onChange={(e) => this.onChangeYear(e)}
              />
            </Form.Group>
          </MDBCol>

          <MDBCol md="2">
            <CSVLink
              headers={headers}
              data={workingDatas}
              filename={"working.csv"}
              className="btn btn-success Rbtn-success1"
              target="_blank"
            >
              <IoMdDownload />
              Export
            </CSVLink>
          </MDBCol>
          <MDBCol md="2">
            <button
              className="btn btn-success  Rbtn-success2"
              target="_blank"
              onClick={() => {
                generate();
              }}
            >
              <FaRegFilePdf /> PDF
            </button>
          </MDBCol>
        </MDBRow>

        <MDBRow className="mt-2 workingTable">
          <DataTable
            columns={workingColumns}
            data={workingDatas}
            fixedHeader
            fixedHeaderScrollHeight={"120vh"}
            striped
          />
        </MDBRow>
      </MDBContainer>
    );
  }
}

const mapStateToProps = (BasicData) => ({
  basic: BasicData.BasicData,
});
export default connect(mapStateToProps, null)(WorkingDays);
