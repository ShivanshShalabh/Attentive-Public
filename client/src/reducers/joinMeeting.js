// * Use: Join Meeting Reducer
// * Desc: Handles the meeting registeration states
// * Testing: Passed ✔ (09-04-2022)

import {
  MEETING_JOINED,
  MEETING_JOIN_ERROR,
  MEETING_PASSWORD_FAIL,
  MEETING_PASSWORD_SUCCESS,
} from "../actions/types";

const initialState = {
  meetingId: "",
  meetingPassword: "",
  meetingName: "",
  error: {},
  loading: true,
};

export default function joinMeetingReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case MEETING_JOINED:
    case MEETING_PASSWORD_SUCCESS:
      return {
        ...state,
        meetingId: payload.meetingId,
        meetingPassword: payload.meetingPassword,
        meetingName: payload.meetingName,
        loading: false,
      };
    case MEETING_JOIN_ERROR:
    case MEETING_PASSWORD_FAIL:
      return {
        ...state,
        meetingId: payload.meetingId,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
