import {
  GET_MEETINGS,
  GET_SINGLE_MEETING_ERROR,
  GET_SINGLE_MEETING_SUCCESS,
  MEETINGS_ERROR,
  MEETING_DELETE_FAIL,
  MEETING_DELETE_SUCCESS,
  MEETING_REG_FAIL,
  MEETING_REG_SUCCESS,
  MEETING_UPDATE_FAIL,
  MEETING_UPDATE_SUCCESS,
} from "../actions/types";

// * Use: Meeting Reducer
// * Desc: Handles the meeting registeration states
// * Testing: Passed ✔ (09-04-2022)

const initialState = {
  myMeetings: [],
  meeting: {},
  loading: true,
  error: {},
};

export default function meetingReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_MEETINGS:
    case MEETING_DELETE_SUCCESS:
      return {
        ...state,
        myMeetings: payload,
        loading: false,
      };
    case MEETING_REG_SUCCESS:
    case GET_SINGLE_MEETING_SUCCESS:
    case MEETING_UPDATE_SUCCESS:
      return {
        ...state,
        meeting: payload,
        loading: false,
      };

    case MEETING_REG_FAIL:
    case MEETINGS_ERROR:
    case MEETING_DELETE_FAIL:
    case GET_SINGLE_MEETING_ERROR:
    case MEETING_UPDATE_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
