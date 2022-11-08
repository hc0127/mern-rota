import {
  INITIAL,
  HSET,
  NINSERT,
  NUPDATE,
  NDELETE,
  NAUPDATE,
  PINSERT,
  PUPDATE,
  PAUPDATE,
  PDELETE,
  RADD,
  RDELETE,
  RSTATUSCHANGE,
} from "../Types";
import history from "./../../history";

import {socket} from "./../../config/server.config.js";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

toastr.options = {
  positionClass: "toast-top-full-width",
  hideDuration: 3000,
  timeOut: 3000,
};

export const getAllDatas = (data,dispatch) => {
  const user = JSON.parse(sessionStorage.getItem("data"));
  let blockId;
  
  socket.on("request", data => {
    toastr.clear();
    switch(data.request){
      case "/nurse/add":
        setTimeout(() => toastr.info("nurse add/edit request!"), 300);
        blockId = data.data._id;
      break; 
      case "/nurse/remove":
        setTimeout(() => toastr.info("nurse remove request!"), 300);
        blockId = data.data._id;
      break; 
      case "/patient/add":
        setTimeout(() => toastr.info("patient add/edit request!"), 300);
        blockId = data.data._id;
      break; 
      case "/patient/remove":
        setTimeout(() => toastr.info("patient remove request!"), 300);
        blockId = data.data._id;
      break; 
      case "/basic/holiday/get":
        setTimeout(() => toastr.info("holiday setting request!"), 300);
        blockId = data.data.date;
      break; 
      case "/leave/add":
        setTimeout(() => toastr.info("leave add request!"), 300);
        blockId = data.data.nurse_id;
      break; 
      case "/leave/edit":
        setTimeout(() => toastr.info("leave edit request!"), 300);
        blockId = data.data.nurse_id;
      break; 
      case "/leave/remove":
        setTimeout(() => toastr.info("leave remove request!"), 300);
        blockId = data.data.nurse_id;
      break; 
      case "/rota/assign":
        setTimeout(() => toastr.info("request!"), 300);
        blockId = 'roaster';
      break; 
    }
    dispatch({
        type: RADD,
        request:data,
        blockId:blockId,
    });
  });
  socket.on("approve", data => {
    toastr.clear();
    switch(data.request){
      case "/nurse/add":
        setTimeout(() => toastr.info("nurse add/edit approved!"), 300);
        blockId = data.data._id;
        if(data.insert == true){
          dispatch(nIns(data.data));
        }else{
          dispatch(nUpd(data.data));
        }
      break; 
      case "/nurse/remove":
        setTimeout(() => toastr.info("nurse remove approved!"), 300);
        blockId = data.data._id;
        dispatch(nDel(data.data._id));
      break; 
      case "/patient/add":
        setTimeout(() => toastr.info("patient add/edit approved!"), 300);
        blockId = data.data._id;
        if(data.insert == true){
          dispatch(pIns(data.data));
        }else{
          dispatch(pUpd(data.data));
        }
      break; 
      case "/patient/remove":
        setTimeout(() => toastr.info("patient remove approved!"), 300);
        blockId = data.data._id;
        dispatch(pDel(data.data._id));
      break; 
      case "/basic/holiday/get":
        setTimeout(() => toastr.info("holiday setting approved!"), 300);
        blockId = data.data.date;
        dispatch(hSet(data));
      break; 
      case "/leave/add":
        setTimeout(() => toastr.info("leave add approved!"), 300);
        blockId = data.data.nurse_id;
        dispatch(nAllUpd(data));
      break; 
      case "/leave/edit":
        setTimeout(() => toastr.info("leave edit approved!"), 300);
        blockId = data.data.nurse_id;
        dispatch(nAllUpd(data));
      break; 
      case "/leave/remove":
        setTimeout(() => toastr.info("leave remove approved!"), 300);
        blockId = data.data.nurse_id;
        dispatch(nAllUpd(data));
      break; 
      case "/rota/assign":
        setTimeout(() => toastr.info("approved!"), 300);
        blockId = "roaster";
        dispatch(nAllUpd(data));
      break; 
    }
    dispatch({
        type: RSTATUSCHANGE,
        request:data,
        blockId:blockId,
    });
  });
  socket.on("reject", data => {
    toastr.clear();
    switch(data.request){
      case "/nurse/add":
        setTimeout(() => toastr.info("nurse add/edit rejected!"), 300);
        blockId = data.data._id;
      break; 
      case "/nurse/remove":
        setTimeout(() => toastr.info("nurse remove rejected!"), 300);
        blockId = data.data._id;
      break; 
      case "/patient/add":
        setTimeout(() => toastr.info("patient add/edit rejected!"), 300);
        blockId = data.data._id;
      break; 
      case "/patient/remove":
        setTimeout(() => toastr.info("patient remove rejected!"), 300);
        blockId = data.data._id;
      break; 
      case "/basic/holiday/get":
        setTimeout(() => toastr.info("holiday setting rejected!"), 300);
        blockId = data.data.date;
      break; 
      case "/leave/add":
        setTimeout(() => toastr.info("leave add rejected!"), 300);
        blockId = data.data.nuse_id;
      break; 
      case "/leave/edit":
        setTimeout(() => toastr.info("leave edit rejected!"), 300);
        blockId = data.data.nuse_id;
      break; 
      case "/leave/remove":
        setTimeout(() => toastr.info("leave remove rejected!"), 300);
        blockId = data.data.nuse_id;
      break; 
      case "/rota/assign":
        setTimeout(() => toastr.info("rejected!"), 300);
        blockId = "roaster";
      break; 
    }
    dispatch({
        type: RSTATUSCHANGE,
        request:data,
        blockId:blockId,
    });
  });
  socket.on("adminedit", data => {
    toastr.clear();
    switch(data.request){
      case "/nurse/add":
        setTimeout(() => toastr.info("admin  added/edited nurse!"), 300);
        if(data.insert == true){
          dispatch(nIns(data.data));
        }else{
          dispatch(nUpd(data.data));
        }
      break; 
      case "/nurse/remove":
        setTimeout(() => toastr.info("admin removed nurse!"), 300);
        dispatch(nDel(data._id));
      break; 
      case "/patient/add":
        setTimeout(() => toastr.info("admin added/edited patient!"), 300);
        dispatch(pDel(data._id));
      break; 
      case "/patient/remove":
        setTimeout(() => toastr.info("admin removed patient!"), 300);
        dispatch(pDel(data._id));
      break; 
      case "/basic/holiday/get":
        setTimeout(() => toastr.info("admin set holiday!"), 300);
        dispatch(hSet(data));
      break; 
      case "/leave/add":
        setTimeout(() => toastr.info("admin added leave!"), 300);
        dispatch(nAllUpd(data));
      break; 
      case "/leave/edit":
        setTimeout(() => toastr.info("admin edited leave!"), 300);
        dispatch(nAllUpd(data));
      break; 
      case "/leave/remove":
        setTimeout(() => toastr.info("admin removed leave!"), 300);
        dispatch(nAllUpd(data));
      break; 
      case "/rota/assign":
        console.log(data);
        setTimeout(() => toastr.info("admin set duty roaster!"), 300);
        dispatch(nAllUpd(data));
      break; 
    }
  });
  socket.on("close",request => {
    dispatch({
      type:RDELETE,
      _id:request._id,
    })
  })

  return {
    type: INITIAL,
    data: {
      nurses: data.nurse,
      patients: data.patient,
      holidays: data.holiday,
      requests: data.request,
      user:user,
    },
  };
};

export const addRequest = (data) => {
  return {
    type:RADD,
    request:data,
  }
}

export const nIns = (data) => {
  return {
    type: NINSERT,
    nurse: data,
  };
};
export const nUpd = (data) => {
  return {
    type: NUPDATE,
    nurse: data,
  };
};
export const nDel = (_id) => {
  return {
    type: NDELETE,
    _id: _id,
  };
};
export const pIns = (data) => {
  return {
    type: PINSERT,
    patient: data,
  };
};
export const pUpd = (data) => {
  return {
    type: PUPDATE,
    patient: data,
  };
};
export const pDel = (_id) => {
  return {
    type: PDELETE,
    _id: _id,
  };
};

export const nAllUpd = (data) => {
  return {
    type: NAUPDATE,
    nurses: data.NurseDatas,
  };
};

export const pAllUpd = (data) => {
  return {
    type: PAUPDATE,
    patients: data.patients,
  };
};

export const hSet = (data) =>{
  return{
    type:HSET,
    holidays:data.holiday,
  };
}

export const setToken = (user) =>{
  history.push("/");
  history.go("/");
  sessionStorage.setItem("data", JSON.stringify(user));
  return {};
};

export const logOut = () =>{
  history.push("/login");
  history.go("/login");
  sessionStorage.removeItem("data");
  return {};
};