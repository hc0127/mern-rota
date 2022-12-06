import React, { Component } from "react";
import "../css/App.css";
import axios from "axios";
import { connect } from "react-redux";
import DataTable from "react-data-table-component";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBBtn,
  MDBBtnGroup,
} from "mdb-react-ui-kit";
import { CSVLink } from "react-csv";
import { IoMdDownload } from "react-icons/io";
import { Form, Modal } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import Autocomplete from "react-autocomplete";
import { nAllUpd } from "../store/Actions/BasicAction";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import { FaRegFilePdf } from "react-icons/fa";
import { Object } from "core-js";

class LeaveDays extends Component {
  constructor(props) {
    super(props);
    let date = new Date();
    let year = date.getFullYear();
    let month =
      date.getMonth() + 1 > 9
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1);
    let day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    this.state = {
      selView: 1,
      selYear: year,
      selMonth: month,
      from: year + "-" + month + "-" + day,
      to: year + "-" + month + "-" + day,
      selFilter: "",
      selNurse: 0,
      selNurseValue: "",
      selType: 0,
      isOpen: false,
      modal: {
        nurse_id: "",
        leave_id: "",
        type: "",
        from: "",
        to: "",
      },
    };
  }

  componentDidMount() {}
  setDate = (target, e) => {
    this.setState({
      ...this.state,
      [target]: e.target.value,
    });
  };
  setModalDate = (target, e) => {
    this.setState({
      ...this.state,
      modal: {
        ...this.state.modal,
        [target]: e.target.value,
      },
    });
  };

  filterChange = (e) => {
    this.setState({
      ...this.state,
      selFilter: e.target.value,
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
  onChangeType = (e) => {
    this.setState({
      ...this.state,
      selType: e.target.value,
    });
  };
  onChangeView = (target, e) => {
    this.setState({
      ...this.state,
      [target]: e.target.value,
    });
  };

  addLeave = () => {
    const { selNurse, selType, from, to } = this.state;
    if (selNurse == 0) {
      toastr.info("Please select nurse!");
    } else {
      this.setState({
        selNurse: 0,
      });

      const { requestblocks } = this.props.basic;
      if(requestblocks.includes(selNurse) || requestblocks.includes("roaster")){
        toastr.clear();
        setTimeout(() => toastr.warning("This item cannot be requested! Please wait until approver approve the transfer request."), 300);
        return;
      }

      axios
        .post("leave/add", {
          nurse_id: selNurse,
          type: selType,
          from: from,
          to: to,
        })
        .then(function (response) {
          const res = response.data;
          if(res.state == "error"){
            toastr.clear();
            setTimeout(() => toastr.info("holiday setting error!"), 3000);
          }
        })
        .catch(function (error) {});
    }
  };

  leaveModal = (isOpen, row) => {
    if (isOpen) {
      this.setState({
        ...this.state,
        isOpen: isOpen,
        modal: {
          nurse_id: row.nurse_id,
          leave_id: row.leave_id,
          type: row.type,
          from: row.leave_start,
          to: row.leave_end,
        },
      });
    } else {
      this.setState({
        ...this.state,
        isOpen: isOpen,
      });
    }
  };

  editConfirmLeave = () => {
    this.setState({
      isOpen: false,
    });

    const { requestblocks } = this.props.basic;
    if(requestblocks.includes(this.state.modal.nurse_id) || requestblocks.includes("roaster")){
      toastr.clear();
      setTimeout(() => toastr.warning("This item cannot be requested! Please wait until approver approve the transfer request."), 300);
      return;
    }

    axios
      .post("leave/edit", {
        ...this.state.modal,
      })
      .then(function (response) {
        const res = response.data;
        if(res.state == "error"){
          toastr.clear();
          setTimeout(() => toastr.info("holiday setting error!"), 3000);
        }
      })
      .catch(function (error) {});
  };

  removeLeave = (row) => {
    const { requestblocks } = this.props.basic;
    if(requestblocks.includes(row.nurse_id) || requestblocks.includes("roaster")){
      toastr.clear();
      setTimeout(() => toastr.warning("This item cannot be requested! Please wait until approver approve the transfer request."), 300);
      return;
    }
    axios
      .post("leave/remove", {
        nurse_id: row.nurse_id,
        leave_id: row.leave_id,
      })
      .then(function (response) {
        const res = response.data;
        if(res.state == "error"){
          toastr.clear();
          setTimeout(() => toastr.info("holiday setting error!"), 3000);
        }
      })
      .catch(function (error) {});
  };

  getLeaveType(row) {
    if (row.type == 1) {
      row.leave_type = "Annual Leave";
    } else if (row.type == 2) {
      row.leave_type = "Sick Leave";
    } else if (row.type == 3) {
      row.leave_type = "Maternity leave";
    } else if (row.type == 4) {
      row.leave_type = "Other Leave";
    }
    return row.leave_type;
  }

  render() {
    const {
      from,
      to,
      selNurse,
      selNurseValue,
      selType,
      modal,
      isOpen,
      selView,
      selYear,
      selMonth,
      selFilter,
    } = this.state;
    const { basic } = this.props;
    const { user } = this.props.basic;
    
    let leaveColumns = [];
    leaveColumns.push(
      {
        name: "No",
        center: true,
        wrap: true,
        selector: (row) => row.no,
      },
      {
        name: "Image",
        center: true,
        wrap: true,
        width: "70px",
        cell: (row) => (
          <img src={row.image} style={{ width: "65px", height: "50px" }} />
        ),
      },
      {
        name: "Staff ID",
        center: true,
        wrap: true,
        selector: (row) => row.nurse_short_id,
      },
      {
        name: "Staff Name",
        center: true,
        selector: (row) => row.name,
      },
      {
        name: "Staff Designation",
        center: true,
        width: "120px",
        selector: (row) => row.designation,
      }
    );
    if (selView == 1) {
      leaveColumns.push(
        {
          name: "Leave Type",
          center: true,
          selector: (row) => row.leave_type,
        },
        {
          name: "Leave Start",
          center: true,
          wrap: true,
          selector: (row) => row.leave_start,
        },
        {
          name: "Leave End",
          center: true,
          selector: (row) => row.leave_end,
        }
      );
    } else {
      leaveColumns.push({
        name: "Leave Periods",
        center: true,
        wrap: true,
        width: "300px",
        selector: (row) => row.leave_periods,
      });
    }
    leaveColumns.push(
      {
        name: "Leave Days",
        center: true,
        wrap: true,
        selector: (row) => row.leave_days,
      },
      {
        name: "Daily Hours",
        center: true,
        wrap: true,
        selector: (row) => row.daily_hours,
      },
      {
        name: "Leave Hours",
        center: true,
        wrap: true,
        selector: (row) => row.leave_hours,
      }
    );
    if (selView == 1 && user.hasOwnProperty("role") && user.role !== 1) {
      leaveColumns.push({
        name: "Action",
        center: true,
        wrap: true,
        cell: (row) => [
          <MDBBtnGroup key={row.leave_id}>
            <MDBBtn
              outline
              color="success"
              size="sm"
              className="my-1 ms-1"
              onClick={() => this.leaveModal(true, row)}
            >
              <FaEdit />
            </MDBBtn>
            <MDBBtn
              outline
              color="success"
              size="sm"
              className="my-1 me-1"
              onClick={() => this.removeLeave(row)}
            >
              <FaTrash />
            </MDBBtn>
          </MDBBtnGroup>,
        ],
      });
    }

    let nurseList = [];
    let nurseAutoList = [];

    basic.nurses.map((nurse) => {
      nurseList[nurse._id] = nurse.name;
      if (nurse.name && nurse.name.includes(selNurseValue)) {
        nurseAutoList.push({
          label: nurse.name,
          key: nurse._id,
        });
      }
    });

    let leaveDatas = [];
    let headers = [
      { label: "No", key: "no" },
      { label: "Staff ID", key: "nurse_short_id" },
      { label: "Staff Name", key: "name" },
      { label: "Staff Designation", key: "designation" },
      { label: "Leave Type", key: "leave_type" },
      { label: "Leave Start", key: "leave_start" },
      { label: "Leave End", key: "leave_end" },
      { label: "Leave Days", key: "leave_days" },
      { label: "Daily Hours", key: "daily_hours" },
      { label: "Leave Hours", key: "leave_hours" },
    ];

    let rowCount = 0;
    basic.nurses.map((nurse) => {
      let total_leave_days = 0;
      let leave_periods = [];
      nurse.leave.map((leave) => {
        let month = selYear + "-" + selMonth;
        let daysInMonth = new Date(selYear, selMonth, 0).getDate();
        if (leave.from.startsWith(month) || leave.to.startsWith(month)) {
          let from = new Date(leave.from);
          let to = new Date(leave.to);
          let leave_days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;
          if (selView == 2) {
            if (!leave.from.startsWith(month)) {
              leave_days = parseInt(leave.to?.slice(8, 10));
              leave_periods.push("(1~" + parseInt(leave.to?.slice(8)) + ")");
            } else if (!leave.to.startsWith(month)) {
              leave_days =
                Math.ceil(
                  (new Date(selYear + "-" + selMonth + "-" + daysInMonth) -
                    from) /
                    (1000 * 60 * 60 * 24)
                ) + 1;
              leave_periods.push(
                "(" + parseInt(leave.from?.slice(8)) + "~" + daysInMonth + ")"
              );
            } else {
              leave_periods.push(
                "(" +
                  parseInt(leave.from?.slice(8)) +
                  "~" +
                  parseInt(leave.to?.slice(8)) +
                  ")"
              );
            }
            total_leave_days += leave_days;
          }
          if (selView == 1) {
            rowCount++;
            leaveDatas.push({
              no: rowCount,
              image: nurse.image,
              nurse_id: nurse._id,
              nurse_short_id: nurse._id?.slice(20),
              name: nurse.name,
              designation: nurse.level == 0 ? "Registered" : "Assistant",
              leave_type: this.getLeaveType(leave),
              leave_id: leave.leave_id,
              leave_start: leave.from,
              leave_end: leave.to,
              leave_days: leave_days,
              daily_hours: 8,
              leave_hours: 8 * leave_days,
            });
          }
        }
      });
      if (selView == 2) {
        if (total_leave_days != 0) {
          rowCount++;
          leaveDatas.push({
            no: rowCount,
            image: nurse.image,
            nurse_id: nurse._id,
            nurse_short_id: nurse._id.slice(20),
            name: nurse.name,
            designation: nurse.level == 0 ? "Registered" : "Assistant",
            leave_periods: leave_periods.join(","),
            leave_days: total_leave_days,
            daily_hours: 8,
            leave_hours: 8 * total_leave_days,
          });
        }
      }
    });

    let monthNames = basic.monthNames;
    let Mon = Object.keys(monthNames);
    let NoMon = Object.values(monthNames);

    const MonthSelect = Mon.map((month, index) => (
      <option key={index} value={NoMon[index]}>{month}</option>
    ));
    leaveDatas.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

    function generate() {
      const doc = new jsPDF("a4", "pt", "letter");

      var img = new Image();
      var src = "https://i.postimg.cc/wMgr6Tr0/converted.jpg";
      img.src = src;

      const rows = [];

      const columns = [];
      headers.map((key) => columns.push({ header: key.label }));

      leaveDatas.map((key) =>
        rows.push(
          Object.values([
            key.no,
            key.nurse_short_id,
            key.name,
            key.designation,
            key.leave_type,
            key.leave_start,
            key.leave_end,
            key.leave_days,
            key.daily_hours,
            key.leave_hours,
          ])
        )
      );

      doc.setFontSize(20);
      doc.addImage(img, "JPEG", 420, 15, 160, 30);
      doc.text(247, 80, "Leave Days");

      doc.autoTable(columns, rows, {
        margin: { top: 100, left: 30, right: 30, bottom: 50 },
        theme: "grid",
      });
      leaveDatas.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
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
      doc.save("leave.pdf");
    }

    return (
      <MDBContainer>
        <div className="pt-5 text-center text-dark">
          <h1 className="mt-3">LEAVE DAYS</h1>
        </div>
        {user.hasOwnProperty("role") && user.role !== 1 &&
        <MDBRow className=" align-items-center justify-content-center ">
          <MDBCol className=" autocomplete col-md-2 ncard">
            <Autocomplete
              getItemValue={(item) => item.label}
              items={nurseAutoList}
              inputProps={{
                placeholder: "Select Nurses",
              }}
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
            <Form.Group>
              <Form.Select
                aria-label="nurse select"
                value={selType}
                onChange={(e) => this.onChangeType(e)}
              >
                <option value="">Select Leave</option>
                <option value="1">Annual leave</option>
                <option value="2">sick leave</option>
                <option value="3">Maternity leave</option>
                <option value="4">Other Leave</option>
              </Form.Select>
            </Form.Group>
          </MDBCol>
          <MDBCol md="2">
            <Form.Group>
              <Form.Control
                type="date"
                value={from}
                max={to}
                onChange={(e) => this.setDate("from", e)}
              />
            </Form.Group>
          </MDBCol>
          <MDBCol md="2">
            <Form.Group>
              <Form.Control
                type="date"
                value={to}
                min={from}
                onChange={(e) => this.setDate("to", e)}
              />
            </Form.Group>
          </MDBCol>
          <MDBCol md="2">
            <MDBBtn
              outline
              rounded
              color="success"
              onClick={() => this.addLeave()}
            >
              Add Leave
            </MDBBtn>
          </MDBCol>
        </MDBRow>
        }
        <MDBRow className="mt-3 align-items-center justify-content-center">
          <MDBCol md="2">
            <Form.Group>
              <Form.Select
                aria-label="nurse select"
                value={selView}
                onChange={(e) => this.onChangeView("selView", e)}
              >
                <option value="1">View Per Record</option>
                <option value="2">View Per Nurse</option>
              </Form.Select>
            </Form.Group>
          </MDBCol>
          <MDBCol md="2">
            <Form.Group>
              <Form.Control
                type="number"
                value={selYear}
                min={2000}
                onChange={(e) => this.onChangeView("selYear", e)}
              />
            </Form.Group>
          </MDBCol>
          <MDBCol md="2">
            <Form.Select
              aria-label="select"
              value={selMonth}
              onChange={(e) => this.onChangeView("selMonth", e)}
            >
              {MonthSelect}
            </Form.Select>
          </MDBCol>
          <MDBCol md="2">
            <CSVLink
              headers={headers}
              data={leaveDatas}
              filename={"leavedays.csv"}
              className="btn btn-success Pbtn-success1 "
              target="_blank"
            >
              <IoMdDownload />
              Export
            </CSVLink>
          </MDBCol>
          <MDBCol md="2">
            <button
              className="btn btn-success Pbtn-success2 "
              target="_blank"
              onClick={() => generate()}
            >
              <FaRegFilePdf /> PDF
            </button>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mt-2">
          <DataTable
            columns={leaveColumns}
            data={leaveDatas}
            fixedHeader
            fixedHeaderScrollHeight={"60vh"}
          />
        </MDBRow>
        <Modal
          show={isOpen}
          size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={() => this.leaveModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Leave Modify</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MDBRow>
              <MDBCol>
                <Form.Control
                  type="date"
                  value={modal.from}
                  max={modal.to}
                  onChange={(e) => this.setModalDate("from", e)}
                />
              </MDBCol>
            </MDBRow>
            <MDBRow className="mt-2">
              <MDBCol>
                <Form.Control
                  type="date"
                  value={modal.to}
                  min={modal.from}
                  onChange={(e) => this.setModalDate("to", e)}
                />
              </MDBCol>
            </MDBRow>
          </Modal.Body>
          <Modal.Footer>
            <MDBBtn color="secondary" onClick={() => this.leaveModal(false)}>
              Close
            </MDBBtn>
            <MDBBtn color="success" onClick={() => this.editConfirmLeave()}>
              Save
            </MDBBtn>
          </Modal.Footer>
        </Modal>
      </MDBContainer>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getLeave: (data) => dispatch(nAllUpd(data)),
});

const mapStateToProps = (BasicData) => ({
  basic: BasicData.BasicData,
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaveDays);
