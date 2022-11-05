import React, { Component } from "react";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";
import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import { IoMdDownload } from "react-icons/io";
import { CSVLink } from "react-csv";
import { Form } from "react-bootstrap";
import "../css/App.css";
import Autocomplete from "react-autocomplete";
class FTE extends Component {
  constructor(props) {
    super(props);

    let date = new Date();
    let year = date.getFullYear();

    this.state = {
      selYear: year,
      selNurse: 0,
      selNurseValue: "",
      selMonth: "00",
      selDesignation: -1,
    };
  }
  onChangeYear = (e) => {
    this.setState({
      ...this.state,
      selYear: e.target.value,
    });
  };
  onChangeDesignation = (e) => {
    this.setState({
      ...this.state,
      selDesignation: e.target.value,
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
  onChangeMonth = (e) => {
    this.setState({
      ...this.state,
      selMonth: e.target.value,
    });
  };
  getTotals(data, key) {
    let total = 0;
    data.forEach((item) => {
      total += item[key] ? item[key] : 0;
    });
    return total;
  }

  swap(json) {
    let ret = [];
    for (var key in json) {
      ret[json[key]] = key;
    }
    return ret;
  }

  render() {
    const { selYear, selMonth, selDesignation, selNurseValue, selNurse } =
      this.state;

    const { basic } = this.props;

    let monthNames = basic.monthNames;
    let monthNumbers = this.swap(monthNames);
    let Mon = Object.keys(monthNames);
    let NoMon = Object.values(monthNames);
    const MonthSelect = Mon.map((month, index) => (
      <option key={index} value={NoMon[index]}>{month}</option>
    ));

    const FTEColumns = [
      {
        name: "Emp Code",
        center: true,
        wrap: true,
        width: "120px",
        selector: (row) => row.code,
      },
      {
        name: "Name",
        center: true,
        wrap: true,
        width: "120px",
        selector: (row) => row.name,
      },
      {
        name: "Designation",
        center: true,
        wrap: true,
        width: "120px",
        selector: (row) => row.designation,
      },
      {
        name: "Month Days",
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
        name: "Leaves",
        center: true,
        wrap: true,
        selector: (row) => row.leaves,
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
        width: "150px",
        selector: (row) => row.workingdays,
      },
      {
        name: "Working Hours available",
        center: true,
        wrap: true,
        width: "170px",
        selector: (row) => row.totalhours,
      },
      {
        name: "Hours Worked",
        center: true,
        wrap: true,
        selector: (row) => row.hour,
      },
      {
        name: "Overtime",
        center: true,
        wrap: true,
        selector: (row) => row.overtime,
      },
    ];

    let FTEDatas = [];
    let thour = 0;
    let tohour = 0;
    let otime = 0;
    let headers = [
      { label: "Emp Code", key: "code" },
      { label: "Name", key: "name" },
      { label: "Designation", key: "designation" },
      { label: "Month Days", key: "days" },
      { label: "Sundays", key: "sundays" },
      { label: "Leaves", key: "leaves" },
      { label: "Holidays", key: "holidays" },
      { label: "Net Working Days", key: "workingdays" },
      { label: "Working Hours Available", key: "totalhours" },
      { label: "Hours Worked", key: "hour" },
      { label: "Overtime", key: "overtime" },
    ];

    let nurseList = [];
    let nurseAutoList = [];
    basic.nurses.map((nurse) => {
      nurseList[nurse._id] = nurse.name;
      if (nurse.name?.includes(selNurseValue)) {
        nurseAutoList.push({
          label: nurse.name,
          key: nurse._id,
        });
      }
    });

    let dataExistInYear = 0;

    basic.nurses.map((nurse) => {
      if (
        (selDesignation == "-1" || parseInt(nurse.level) == selDesignation) &&
        (nurse._id == selNurse || selNurse == 0)
      ) {
        nurse.rota.map((data) => {
          if (selYear == new Date(data.date).getFullYear()) {
            dataExistInYear = 1;
          }
        });

        if (dataExistInYear == 1) {
          //get holidays per month
          let holidays = basic.holidays;
          let holidaysPerMonth = [];
          holidays.map((holiday) => {
            let key = monthNumbers[holiday.slice(0, 2)];
            if (holidaysPerMonth[key] == undefined) {
              holidaysPerMonth[key] = [];
            }
            holidaysPerMonth[key].push(
              selYear + "-" + selMonth + "-" + holiday
            );
          });
          //get sundays per month
          let sundaysPerMonth = [];
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
          //leave days
          let leaves = nurse.leave ? nurse.leave : [];

          let leavedaysPerMonth = [];
          for (let leave of leaves) {
            let from = new Date(leave.from);
            let to = new Date(leave.to);
            for (let betweenDay = from; betweenDay <= to; ) {
              let year = betweenDay.getFullYear();
              let month =
                betweenDay.getMonth() + 1 > 9
                  ? betweenDay.getMonth() + 1
                  : "0" + (betweenDay.getMonth() + 1);
              let day =
                betweenDay.getDate() > 9
                  ? betweenDay.getDate()
                  : "0" + betweenDay.getDate();
              if (year == selYear) {
                let key = monthNumbers[month];
                if (leavedaysPerMonth[key] == undefined) {
                  leavedaysPerMonth[key] = [];
                }
                leavedaysPerMonth[key].push(year + "-" + month + "-" + day);
              }
              betweenDay.setDate(betweenDay.getDate() + 1);
            }
          }
          //datatable set

          let rotaPerMonth = [];
          for (let monthValue in monthNames) {
            if (monthNames[monthValue] == selMonth) {
              let daysInMonth = new Date(
                selYear,
                monthNames[monthValue],
                0
              ).getDate();
              if (leavedaysPerMonth[monthValue] == undefined) {
                leavedaysPerMonth[monthValue] = [];
              }
              if (holidaysPerMonth[monthValue] == undefined) {
                holidaysPerMonth[monthValue] = [];
              }
              if (sundaysPerMonth[monthValue] == undefined) {
                sundaysPerMonth[monthValue] = [];
              }

              let offDays = [
                ...leavedaysPerMonth[monthValue],
                ...holidaysPerMonth[monthValue],
                ...sundaysPerMonth[monthValue],
              ];
              offDays = [...new Set(offDays)];

              //rota hours per month

              let rotas = nurse.rota;
              rotaPerMonth[monthValue] = 0;
              //rota calculate

              rotas.map((rota) => {
                if (selYear == new Date(rota.date).getFullYear()) {
                  let month = monthNumbers[[rota.date.slice(5, 7)]];

                  if (rotaPerMonth[month] == undefined) {
                  } else {
                    rotaPerMonth[month] += rota.hour;
                    thour += rota.hour;
                  }
                }
              });

              let row = {
                month: monthValue,
                days: daysInMonth,
                code: nurse.code,
                name: nurse.name,
                leave: leaves,
                designation: nurse.level == 0 ? "Registered" : "Assistant",
                sundays: sundaysPerMonth[monthValue].length,
                holidays: holidaysPerMonth[monthValue].length,
                leavedays: leavedaysPerMonth[monthValue].length,
                leaves: leavedaysPerMonth[monthValue].length,
                workingdays: daysInMonth - offDays.length,
                hour: rotaPerMonth[monthValue],

                totalhours: 8 * (daysInMonth - offDays.length),
                overtime:
                  rotaPerMonth[monthValue] - 8 * (daysInMonth - offDays.length),
              };
              tohour += row.totalhours;
              otime += row.overtime;
              FTEDatas.push(row);
            }
          }
        }
      }
    });
    FTEDatas.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

    let total = {
      code: "Total",
      hour: thour,
      totalhours: tohour,
      overtime: otime,
    };
    FTEDatas.push(total);
    const conditionalRowStyles = [
      {
        when: (row) => row.rotation == 1,
        style: (row) => ({
          backgroundColor:
            row.day % 2 == 1 ? "rgb(160,160,160)" : "rgb(192,192,192)",
        }),
      },
    ];

    return (
      <MDBContainer>
        <div className="pt-5 text-center text-dark">
          <h1 className="mt-3">Full Time Equivalent (FTE) </h1>
        </div>
        <MDBRow className=" align-items-center justify-content-center">
          <MDBCol className="autocomplete col-md-3 ncard">
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
          <MDBCol md="2">
            <Form.Select
              aria-label="select"
              value={selDesignation}
              onChange={(e) => this.onChangeDesignation(e)}
            >
              <option value="-1">Designation</option>
              <option value="0">Registered</option>
              <option value="1">Assistant</option>
            </Form.Select>
          </MDBCol>
          <MDBCol md="2">
            <Form.Group>
              <Form.Control
                type="number"
                value={selYear}
                placeholder="Year"
                onChange={(e) => this.onChangeYear(e)}
              />
            </Form.Group>
          </MDBCol>
          <MDBCol md="2">
            <Form.Select
              aria-label="select"
              value={selMonth}
              onChange={(e) => this.onChangeMonth(e)}
            >
              <option value="00">Month</option>
              {MonthSelect}
            </Form.Select>
          </MDBCol>
          <MDBCol md="2">
            <CSVLink
              headers={headers}
              data={FTEDatas}
              filename={"FTE.csv"}
              className="btn btn-success "
              target="_blank"
            >
              <IoMdDownload />
              Export
            </CSVLink>
          </MDBCol>
        </MDBRow>

        <MDBRow className="mt-2 workingTable">
          <DataTable
            columns={FTEColumns}
            data={FTEDatas}
            fixedHeader
            striped
            conditionalRowStyles={conditionalRowStyles}
            fixedHeaderScrollHeight={"60vh"}
            pagination
          />
        </MDBRow>
      </MDBContainer>
    );
  }
}

const mapStateToProps = (BasicData) => ({
  basic: BasicData.BasicData,
});
export default connect(mapStateToProps, null)(FTE);
