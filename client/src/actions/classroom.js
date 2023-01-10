import axios from "axios";
import {
  CLASSROOM_MEMBER_UPDATE_FAIL,
  CLASSROOM_MEMBER_UPDATE_SUCCESS,
  CLASSROOM_REG_FAIL,
  CLASSROOM_REG_SUCCESS,
  GET_CLASSROOM_INFO_ERROR,
  GET_CLASSROOM_INFO_SUCCESS,
  GET_STUDENTS_SUCCESS,
  GET_STUDENTS_ERROR,
} from "./types";
import { setAlert } from "./alert";

axios.defaults.baseURL = 'https://attentive.onrender.com/';

// * USE: Get Classroom
// * USER_TYPE: TEACHER
// * Desc: Registers a classroom

export const getClassroom =
  (code = "") =>
    async (dispatch) => {
      if (!code) {
        try {
          const res = await axios.get("/api/classroom/get");
          dispatch({
            type: GET_CLASSROOM_INFO_SUCCESS,
            payload: res.data,
          });
          return res.data;
        } catch (err) {
          dispatch({
            type: GET_CLASSROOM_INFO_ERROR,
          });
        }
      } else {
        try {
          const res = await axios.get(`/api/classroom/get/${code}`);
          return res.data;
        } catch (err) {
          dispatch({
            type: GET_CLASSROOM_INFO_ERROR,
          });
        }
      }
    };
// * USE: Get students in a classroom
// * USER_TYPE: STUDENTS & Teachers of a classroom 
// * Desc: Registers a classroom

export const getStudentClassroom =
  (code = "") =>
    async (dispatch) => {
      if (!code) {
        try {
          const res = await axios.get("/api/classroom/get/students/");
          dispatch({
            type: GET_STUDENTS_SUCCESS,
            payload: res.data,
          });
          return res.data;
        } catch (err) {
          dispatch({
            type: GET_STUDENTS_ERROR,
          });
        }
      } else {
        try {
          const res = await axios.get(`/api/classroom/get/students/${code}`);
          dispatch({
            type: GET_STUDENTS_SUCCESS,
            payload: res.data,
          });
          return res.data;
        } catch (err) {
          dispatch({
            type: GET_STUDENTS_ERROR,
          });
        }
      }
    };

// * USE: Register a classroom
// * USER_TYPE: TEACHER
// * Desc: Registers a classroom
export const registerClassroom =
  ({ schoolCode, classGrade, classCode, classSection }) =>
    async (dispatch) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const body = JSON.stringify({
          schoolCode,
          classGrade,
          classCode,
          classSection,
        });
        const res = await axios.post("/api/classroom/register", body, config);
        if (res.data.errors) {
          res.data.errors.forEach((error) =>
            dispatch(setAlert(error.msg, "danger", 5000))
          );
          return false;
        } else {
          dispatch({
            type: CLASSROOM_REG_SUCCESS,
            payload: res.data,
          });
          dispatch(
            setAlert("Classroom registered successfully", "success", 5000)
          );
          return res.data;
        }
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
          type: CLASSROOM_REG_FAIL,
        });
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
        const res = await axios.post("/api/classroom/actionMember", body, config);
        if (res.data.errors) {
          res.data.errors.forEach((error) =>
            dispatch(setAlert(error.msg, "danger", 5000))
          );
          return false;
        } else {
          dispatch({
            type: CLASSROOM_MEMBER_UPDATE_SUCCESS,
            payload: res.data,
          });
          return res.data;
        }
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors)
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        dispatch({
          type: CLASSROOM_MEMBER_UPDATE_FAIL,
        });
        return false;
      }
    };
