import {
  INITIAL,
  NINSERT,NUPDATE,NDELETE,
  PINSERT,PUPDATE,LDELETE,NPUPDATE,
  LINSERT,LUPDATE,PDELETE, TOKENCHECK,
} from '../Types';

const initialState = {
  nurses: [],
  patients: [],
  levels: [],
  };

export default function BasicReducer(state = initialState, action) {
  let key;
  switch (action.type) {
    case INITIAL:
      return {
        ...state,
        nurses: action.data.nurses,
        patients: action.data.patients,
        levels: action.data.levels,
      };
    case NINSERT:
      return {
        ...state,
        nurses:[...state.nurses,{...action.nurse}]
      };
    case NUPDATE:
      state.nurses.map((nurse,index)=>{
        if(nurse._id == action.nurse._id){
          key = index;
        }
      });
      state.nurses[key] = {...action.nurse};
      return {
        ...state,
        nurses:[...state.nurses],
      };
    case NDELETE:
      state.nurses.map((nurse,index)=>{
        if(nurse._id == action._id){
          key = index;
        }
      });
      console.log(key,state.nurses);
      state.nurses.splice(key,1);
      console.log(state.nurses);
      return {
        ...state,
        nurses:[...state.nurses],
      };
    case PINSERT:
      return {
        ...state,
        patients:[...state.patients,{...action.patient}]
      };
    case PUPDATE: 
      state.patients.map((patient,index)=>{
        if(patient._id == action.patient._id){
          key = index;
        }
      });
      state.patients[key] = {...action.patient};
      return {
        ...state,
        patients:[...state.patients],
      };
    case PDELETE:
      state.patients.map((patient,index)=>{
        if(patient._id == action._id){
          key = index;
        }
      });
      console.log(key,state.patients);
      state.patients.splice(key,1);
      console.log(state.patients);
      return {
        ...state,
        patients:[...state.patients],
      };
    case NPUPDATE: 
      state.nurses = action.nurses;
      return {
        ...state,
        nurses:[...state.nurses],
      };
    case LINSERT:
      return {
        ...state,
        levels:[...state.levels,{...action.level}]
      };
    case LUPDATE: 
      state.levels.map((level,index)=>{
        if(level._id == action.level._id){
          key = index;
        }
      });
      state.levels[key] = {...action.level};
      return {
        ...state,
        levels:[...state.levels],
      };
    case LDELETE:
      state.levels.map((level,index)=>{
        if(level._id == action._id){
          key = index;
        }
      });
      console.log(key,state.levels);
      state.levels.splice(key,1);
      console.log(state.levels);
      return {
        ...state,
        levels:[...state.levels],
      };
    case TOKENCHECK:{
      return {
        ...state,
        nurses: action.data.nurses,
        patients: action.data.patients,
        levels: action.data.levels,
      };
    }
    default:
      return state;
  }
}