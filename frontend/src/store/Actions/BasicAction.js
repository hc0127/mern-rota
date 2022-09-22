import {
  INITIAL,
  NINSERT,NUPDATE,NDELETE,
  PINSERT,PUPDATE,LDELETE,NPUPDATE,
  LINSERT,LUPDATE,PDELETE,TOKENCHECK
} from '../Types';
import { createBrowserHistory  } from 'history';

export const getAllDatas = (data) => {
  return ({
    type: INITIAL,
    data:{
      nurses: data.nurse, 
      patients: data.patient, 
      levels: data.level, 
    }
  });
}

export const nIns = (data) => {
  return ({
    type: NINSERT,
    nurse: data,
  });
};
export const nUpd = (data) => {
  return ({
    type: NUPDATE,
    nurse: data,
  });
};
export const nDel = (_id) => {
  return ({
    type: NDELETE,
    _id: _id
  });
};
export const pIns = (data) => {
  return ({
    type: PINSERT,
    patient: data,
  });
};
export const pUpd = (data) => {
  return ({
    type: PUPDATE,
    patient: data,
  });
};
export const pDel = (_id) => {
  return ({
    type: PDELETE,
    _id: _id
  });
};

export const npUpd = (data) =>{
  return({
    type:NPUPDATE,
    nurses:data.NurseDatas,
  });
}

export const lIns = (data) => {
  return ({
    type: LINSERT,
    level: data,
  });
};
export const lUpd = (data) => {
  return ({
    type: LUPDATE,
    level: data,
  });
};
export const lDel = (_id) => {
  return ({
    type: LDELETE,
    _id: _id
  });
};
export const setToken = (data) =>{
  const history = createBrowserHistory();
  history.push('/');
  history.go('/');
  sessionStorage.setItem('token',JSON.stringify(data.token));
  return ({
    type:TOKENCHECK,
    data:data,
  });
};
export const logOut = () =>{
  console.log('aaa');
  const history = createBrowserHistory();
  history.push('/login');
  history.go('/login');
  sessionStorage.removeItem('token');
  return ({
  });
};