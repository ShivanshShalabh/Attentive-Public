import axios from "axios";
import { setAlert } from "./alert";
import { MEETING_PASSWORD_FAIL, MEETING_PASSWORD_SUCCESS } from "./types";

axios.defaults.baseURL = 'https://attentive.onrender.com/';

// * Use: Check meeting password
// * USER_TYPE: STUDENT, TEACHER
// * Desc: Checks if meeting password is correct
// * Testing: Passed ✔ (19-05-2022)

export const checkMeetingPassword =
  ({ meetingId, meetingPassword, meetingName }) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({ meetingId, meetingPassword });
    try {
      const res = await axios.post(
        "/api/meetings/check-password",
        body,
        config
      );
      if (res.data.errors) {
        res.data.errors.forEach((error) =>
          dispatch(setAlert(error.msg, "danger", 5000))
        );
        return false;
      } else {
        dispatch({
          type: MEETING_PASSWORD_SUCCESS,
          payload: {
            meetingId,
            meetingPassword,
            meetingName,
          },
        });
        return true;
      }
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors)
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      dispatch({
        type: MEETING_PASSWORD_FAIL,
        payload: {
          meetingId
        }
      });
      return false;
    }
  };
