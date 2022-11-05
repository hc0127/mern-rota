import {
  INITIAL,
  TOKENCHECK,
  HSET,
  NINSERT,
  NUPDATE,
  NDELETE,
  NAUPDATE,
  PINSERT,
  PUPDATE,
  PAUPDATE,
  PDELETE,
} from "../Types";
import history from "./../../history"

export const getAllDatas = (data) => {
  const user = JSON.parse(sessionStorage.getItem("data"));
  return {
    type: INITIAL,
    data: {
      nurses: data.nurse,
      patients: data.patient,
      holidays: data.holiday,
      user:user,
    },
  };
};

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