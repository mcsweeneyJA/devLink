import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];
export default function(state = initialState, action) {
  //destruct action to just use type and data
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      //adds a new alert to the array (immutable)
      return [...state, payload];
    case REMOVE_ALERT:
      // remove specific alert?
      return state.filter(alert => alert.id !== payload);
    default:
      return state;
  }
}
