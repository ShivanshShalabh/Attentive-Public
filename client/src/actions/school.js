import axios from "axios";
import {
  GET_SCHOOL_INFO_ERROR,
  GET_SCHOOL_INFO_SUCCESS,
  GET_SCHOOL_STUDENTS_ERROR,
  GET_SCHOOL_STUDENTS_SUCCESS,
  GET_SCHOOL_TEACHERS_ERROR,
  GET_SCHOOL_TEACHERS_SUCCESS,

  SCHOOL_MEMBER_UPDATE_FAIL,
  SCHOOL_MEMBER_UPDATE_SUCCESS,
} from "./types";
import { setAlert } from "./alert";

axios.defaults.baseURL = 'https://attentive.onrender.com/';

// * USE: Get all teachers in a school
// * USER_TYPE: SCHOOL_ADMIN
// * Desc: Fetches all teachers in a school by admin (req.user) id
// * Testing: Passed ✔ (19-05-2022)

export const getAllTeachers = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/school/teachers/all");
    dispatch({
      type: GET_SCHOOL_TEACHERS_SUCCESS,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: GET_SCHOOL_TEACHERS_ERROR,
    });
  }
};

// * USE: Get all students in a school
// * USER_TYPE: SCHOOL_ADMIN
// * Desc: Fetches all student in a school by admin (req.user) id
// * Testing: Passed ✔ (19-05-2022)

export const getAllStudents = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/school/students/all");
    dispatch({
      type: GET_SCHOOL_STUDENTS_SUCCESS,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: GET_SCHOOL_STUDENTS_ERROR,
    });
  }
};

// * USE: Get school info
// * USER_TYPE: ANY
// * Desc: Fetches school info by school id
// * Testing: Passed ✔ (19-05-2022)

export const getSchoolInfo =
  ({ schoolCode }) =>
    async (dispatch) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ schoolCode });
      try {
        const res = await axios.post("/api/school/get-info", body, config);
        if (res.data.errors) {
          res.data.errors.forEach((error) =>
            dispatch(setAlert(error.msg, "danger", 5000))
          );
          return false;
        } else {
          dispatch({
            type: GET_SCHOOL_INFO_SUCCESS,
            payload: res.data,
          });
          return res.data;
        }
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors)
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        dispatch({
          type: GET_SCHOOL_INFO_ERROR,
        });
        return false;
      }
    };

// * USE: Get school info
// * USER_TYPE: SCHOOL_ADMIN
// * Desc: Fetches school info by school id

export const actionMembers =
  ({ memberId, memberType, actionType }) =>
    async (dispatch) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ memberId, memberType, actionType });
      try {
        const res = await axios.post("/api/school/actionMember", body, config);
        if (res.data.errors) {
          res.data.errors.forEach((error) =>
            dispatch(setAlert(error.msg, "danger", 5000))
          );
          return false;
        } else {
          dispatch({
            type: SCHOOL_MEMBER_UPDATE_SUCCESS,
            payload: res.data,
          });
          return res.data;
        }
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors)
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        dispatch({
          type: SCHOOL_MEMBER_UPDATE_FAIL,
        });
        return false;
      }
    };
