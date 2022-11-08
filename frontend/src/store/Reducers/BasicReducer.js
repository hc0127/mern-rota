import {
  INITIAL,
  HSET,
  
  NINSERT,
  NUPDATE,
  NDELETE,
  NAUPDATE,

  PINSERT,
  PUPDATE,
  PDELETE,
  PAUPDATE,
  
  RADD,
  RDELETE,
  RSTATUSCHANGE,
} from "../Types";

const monthNames = [];
monthNames["Jan"] = "01";
monthNames["Feb"] = "02";
monthNames["Mar"] = "03";
monthNames["Apr"] = "04";
monthNames["May"] = "05";
monthNames["Jun"] = "06";
monthNames["Jul"] = "07";
monthNames["Aug"] = "08";
monthNames["Sep"] = "09";
monthNames["Oct"] = "10";
monthNames["Nov"] = "11";
monthNames["Dec"] = "12";

const requestTitles = [];
requestTitles["/nurse/add"] = "nurse add/edit";
requestTitles["/nurse/remove"] = "nurse remove";
requestTitles["/patient/add"] = "patient add/edit";
requestTitles["/patient/remove"] = "patient remove";
requestTitles["/basic/holiday/get"] = "holiday setting";
requestTitles["/leave/add"] = "leave add";
requestTitles["/leave/edit"] = "leave edit";
requestTitles["/leave/remove"] = "leave remove";
requestTitles["/rota/assign"] = "duty roaster assign";

const requestStatus = [];
requestStatus[1] = " request";
requestStatus[2] = " approved";
requestStatus[3] = " rejected";

const initialState = {
  nurses: [],
  patients: [],
  holidays: [],
  requests: [],
  requestblocks: [],
  user:{},
  monthNames:monthNames,
  requestTitles:requestTitles,
  requestStatus:requestStatus,
  };

export default function BasicReducer(state = initialState, action) {
  let key;
  switch (action.type) {
    case INITIAL:
      return {
        ...state,
        nurses: action.data.nurses,
        patients: action.data.patients,
        holidays: action.data.holidays,
        requests: action.data.requests,
        user: action.data.user,
      };

    case RADD:
      if(action.blockId != undefined){
        state.requestblocks = [...state.requestblocks,action.blockId];
      }
      return {
        ...state,
        requests: [...state.requests,action.request],
        requestblocks:[...state.requestblocks],
      }
    case RSTATUSCHANGE:
      state.requestblocks.map((block, index) => {
        if (block == action.blockId) {
          key = index;
        }
      });
      state.requestblocks.splice(key, 1);
      state.requests.map((request, index) => {
        if (request._id == action.request._id) {
          state.requests[index].status = action.request.status;
        }
      });
      return {
        ...state,
        requests: [...state.requests],
        requestblocks:[...state.requestblocks],
      }
    case RDELETE:
      state.requests.map((request, index) => {
        if (request._id == action._id) {
          key = index;
        }
      });
      state.requests.splice(key, 1);
      return {
        ...state,
        requests: [...state.requests],
      }

    case NINSERT:
      return {
        ...state,
        nurses: [...state.nurses, { ...action.nurse }],
      };
    case NUPDATE:
      state.nurses.map((nurse, index) => {
        if (nurse._id == action.nurse._id) {
          key = index;
        }
      });
      state.nurses[key] = { ...action.nurse };
      return {
        ...state,
        nurses: [...state.nurses],
      };
    case NDELETE:
      state.nurses.map((nurse, index) => {
        if (nurse._id == action._id) {
          key = index;
        }
      });
      state.nurses.splice(key, 1);
      return {
        ...state,
        nurses: [...state.nurses],
      };
    case NAUPDATE:
      state.nurses = action.nurses;
      return {
        ...state,
        nurses: [...state.nurses],
      };

    case PINSERT:
      return {
        ...state,
        patients: [...state.patients, { ...action.patient }],
      };
    case PUPDATE:
      state.patients.map((patient, index) => {
        if (patient._id == action.patient._id) {
          key = index;
        }
      });
      state.patients[key] = { ...action.patient };
      return {
        ...state,
        patients: [...state.patients],
      };
    case PDELETE:
      state.patients.map((patient, index) => {
        if (patient._id == action._id) {
          key = index;
        }
      });
      state.patients.splice(key, 1);
      return {
        ...state,
        patients: [...state.patients],
      };
    case PAUPDATE:
      state.patients = action.patients;
      return {
        ...state,
        patients: [...state.patients],
      };

    case HSET:
      return {
        ...state,
        holidays: [...action.holidays],
      };
    default:
      return state;
  }
}