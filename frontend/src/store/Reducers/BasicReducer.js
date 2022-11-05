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

const initialState = {
  nurses: [],
  patients: [],
  holidays: [],
  user:{},
  monthNames:monthNames,
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
        user: action.data.user,
      };
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