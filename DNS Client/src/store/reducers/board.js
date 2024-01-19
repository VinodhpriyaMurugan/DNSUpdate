import {
  ADD_TASK,MOVE_TASK,GET_BOARD
} from './../types'

const initialState = {
  modalShow:false
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_TASK: {
      return {
          ...state
         
      }
  }

  case MOVE_TASK: {
      return {
        ...state,
        ...payload
      }
  }
  case GET_BOARD:{
    return {
      ...state,
      ...payload
    }
  }
  default:
    return state;
  }
}
