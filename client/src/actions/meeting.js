import axios from "axios";
import {
  MEETING_REG_FAIL,
  MEETING_REG_SUCCESS,
  GET_MEETINGS,
  MEETINGS_ERROR,
  MEETING_DELETE_SUCCESS,
  MEETING_DELETE_FAIL,
  GET_SINGLE_MEETING_SUCCESS,
  GET_SINGLE_MEETING_ERROR,
  MEETING_UPDATE_FAIL,
  MEETING_UPDATE_SUCCESS,
} from "./types";
import { setAlert } from "./alert";

axios.defaults.baseURL = 'https://attentive.onrender.com/';

const convertTime = (time) => {
  const [hour, minute] = time.split(":");
  return `${hour > 12 ? hour - 12 : hour}:${minute} ${hour >= 12 ? "pm" : "am"}`;
};
// * Use: Register a meeting
// * USER_TYPE: TEACHER
// * Desc: Processes a meeting registration request
// * Testing: Passed ✔ (09-04-2022)

export const regMeeting =
  ({
    meetingName,
    meetingDate,
    meetingTime,
    meetingId,
    meetingPassword,
    participantsAudio,
    participantsVideo,
    participantsChat,
    botEnable,
    frequency,
    minTime,
    meetingClassroom,
  }) =>
    async (dispatch) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({
        meetingName,
        meetingDate,
        meetingTime,
        meetingId,
        meetingPassword,
        participantsAudio,
        participantsVideo,
        participantsChat,
        botEnable,
        frequency,
        minTime,
        meetingClassroom,
      });

      try {
        const res = await axios.post("/api/meetings/new", body, config);
        if (res.data.errors)
          res.data.errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", 5000));
          });
        else {
          dispatch({
            type: MEETING_REG_SUCCESS,
            payload: res.data,
          });
          dispatch(setAlert("Meeting registered successfully!", "success", 5000));
          return true;
        }
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors)
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        dispatch({
          type: MEETING_REG_FAIL,
        });
      }
      return false;
    };

// * Use: Get all meetings
// * USER_TYPE: TEACHER
// * Desc: Fetches all meetings from the database by the user's id
// * Testing: Passed ✔ (19-05-2022)

export const getAllMeetings = (isTeacher) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ isTeacher });

  try {
    const res = await axios.post("/api/meetings", body, config);
    // convert all the meeting dates to a date object
    res.data.forEach((meeting) => {
      meeting.date = new Date(meeting.date);
      meeting.time = convertTime(meeting.time);
    });

    dispatch({
      type: GET_MEETINGS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(
      setAlert(
        "Failed loading meeting data, try logging out and logging in again. If the error persits, contact admin.",
        "danger",
        5000
      )
    );

    dispatch({
      type: MEETINGS_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// * Use: Delete a meeting
// * USER_TYPE: TEACHER
// * Desc: Deletes a meeting from the database
// * Testing: Passed ✔ (19-05-2022)

export const deleteMeeting =
  ({ meetingId }) =>
    async (dispatch) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ meetingId });
      try {
        const res = await axios.post("/api/meetings/delete", body, config);
        if (res.data.errors)
          res.data.errors.forEach((error) =>
            dispatch(setAlert(error.msg, "danger", 5000))
          );
        else {
          dispatch({
            type: MEETING_DELETE_SUCCESS,
            payload: res.data,
          });
          dispatch(setAlert("Meeting deleted successfully!", "success", 5000));
        }
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors)
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        dispatch({
          type: MEETING_DELETE_FAIL,
        });
      }
    };

// * Use: Update a meeting
// * USER_TYPE: TEACHER
// * Desc: Updates a meeting in the database
// * Testing: Passed ✔ (19-05-2022)

export const updateMeeting =
  ({
    meetingName,
    meetingDate,
    meetingTime,
    meetingId,
    meetingPassword,
    participantsAudio,
    participantsVideo,
    participantsChat,
    botEnable,
    frequency,
    minTime,
    meetingClassroom
  }) =>
    async (dispatch) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({
        meetingName,
        meetingDate,
        meetingTime,
        meetingId,
        meetingPassword,
        participantsAudio,
        participantsVideo,
        participantsChat,
        botEnable,
        frequency,
        minTime,
        meetingClassroom
      });

      try {
        const res = await axios.post("/api/meetings/update", body, config);
        if (res.data.errors)
          res.data.errors.forEach((error) =>
            dispatch(setAlert(error.msg, "danger", 5000))
          );
        else {
          dispatch({
            type: MEETING_UPDATE_SUCCESS,
            payload: res.data,
          });
          dispatch(setAlert("Meeting updated successfully!", "success", 5000));
          return true;
        }
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors)
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        dispatch({
          type: MEETING_UPDATE_FAIL,
        });
      }
    };
// * Use: Get a single meeting info
// * USER_TYPE: STUDENT, TEACHER
// * Desc: Fetches a single meeting from the database by the meeting id
// * Testing: Passed ✔ (19-05-2022)

export const getSingleMeeting =
  ({ meetingId }) =>
    async (dispatch) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ meetingId });
      try {
        const res = await axios.post("/api/meetings/get-info", body, config);
        if (res.data.errors) {
          res.data.errors.forEach((error) =>
            dispatch(setAlert(error.msg, "danger", 5000))
          );
          return false;
        } else {
          res.data.date = new Date(res.data.date);
          res.data.time = convertTime(res.data.time);
          dispatch({
            type: GET_SINGLE_MEETING_SUCCESS,
            payload: res.data,
          });
          return res.data;
        }
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors)
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        dispatch({
          type: GET_SINGLE_MEETING_ERROR,
        });
        return false;
      }
    };
