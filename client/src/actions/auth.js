import axios from "axios";
import {
  CLASSROOM_JOIN_REQUEST_FAIL,
  CLASSROOM_JOIN_REQUEST_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_PROFILE,
  SCHOOL_REG_FAIL,
  SCHOOL_REG_SUCCESS,
  SCHOOL_LINKING_SUCCESS,
  SCHOOL_LINKING_FAIL,
} from "./types";
import { setAlert } from "./alert";

axios.defaults.baseURL = 'https://attentive.onrender.com/';

// * Use: Load User Action
// * Desc: Helps in fetching user data
// * Testing: Passed ✔ (09-04-2022)

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {

    try {
      const res = await axios.get("/api/auth");
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR,
      });
    }
  } else
    dispatch({
      type: AUTH_ERROR,
    });
};

// * Use: Register User Action
// * Desc: Register a user to the system
// * Testing: Passed ✔ (09-04-2022)

export const register =
  ({ userName, userEmail, userType, userPass, userPassConfirm }) =>
    async (dispatch) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({
        userName,
        userEmail,
        userType,
        userPass,
        userPassConfirm,
      });
      try {
        const res = await axios.post("/api/auth/registration", body, config);

        if (res.data.errors)
          res.data.errors.forEach((error) =>
            dispatch(setAlert(error.msg, "danger", 5000))
          );
        else {
          dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data,
          });
        }
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors)
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));

        dispatch({
          type: REGISTER_FAIL,
        });
      }
    };

// * Use: Register School Action
// * Desc: Register a school to the system
// * Testing: Passed ✔ (16-05-2022)

export const registerSchool =
  ({
    schoolName,
    schoolAddress,
    schoolBoard,
    schoolAffiliationCode,
    schoolUDISE,
    schoolCode,
  }) =>
    async (dispatch) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({
        schoolName,
        schoolAddress,
        schoolBoard,
        schoolAffiliationCode,
        schoolUDISE,
        schoolCode,
      });

      try {
        const res = await axios.post("/api/school/register", body, config);
        if (res.data.errors)
          res.data.errors.forEach((error) => {
            dispatch(setAlert(error.msg, "danger", 5000));
          });
        else {
          dispatch({
            type: SCHOOL_REG_SUCCESS,
            payload: res.data,
          });
          dispatch(setAlert("School registered successfully!", "success", 5000));
        }
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors)
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        dispatch({
          type: SCHOOL_REG_FAIL,
        });
      }
    };

// * Use: Login User Action
// * Desc: Process login request
// * Testing: Passed ✔ (09-04-2022)

export const login =
  ({ userEmail, userPass }) =>
    async (dispatch) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ userEmail, userPass });
      try {
        const res = await axios.post("/api/auth/login", body, config);
        if (res.data.errors)
          res.data.errors.forEach((error) =>
            dispatch(setAlert(error.msg, "danger", 5000))
          );
        else
          dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data,
          });
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors)
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        dispatch({
          type: LOGIN_FAIL,
        });
      }
    };

// * Use: Logout User Action
// * Desc: Logout user and clear local storage
// * Testing: Passed ✔ (09-04-2022)

export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

// * Use: Join a School Action
// * USER_TYPE: STUDENT, TEACHER
// * Desc: Sends a request to the server to join a school
// * Testing: Passed ✔ (19-05-2022)

export const joinSchool = ({ schoolCode, userType }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ schoolCode, userType });
  try {
    const res = await axios.post("/api/school/join", body, config);
    if (res.data.errors) {
      res.data.errors.forEach((error) =>
        dispatch(setAlert(error.msg, "danger", 5000))
      );
      return false;
    } else {
      dispatch({
        type: SCHOOL_LINKING_SUCCESS,
        payload: res.data,
      });
      return res.data;
    }
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors)
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    dispatch({
      type: SCHOOL_LINKING_FAIL,
    });
    return false;
  }
};

// * USE: Join a classroom
// * USER_TYPE: STUDENT, TEACHER
// * Desc: Join a classroom
export const joinClassroom =
  ({ userType, classGrade, classSection, schoolCode }) =>
    async (dispatch) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const body = JSON.stringify({
          userType, classGrade, classSection, schoolCode
        });
        const res = await axios.post("/api/classroom/join", body, config);
        if (res.data.errors) {
          res.data.errors.forEach((error) =>
            dispatch(setAlert(error.msg, "danger", 5000))
          );
          return false;
        } else {
          dispatch({
            type: CLASSROOM_JOIN_REQUEST_SUCCESS,
            payload: res.data,
          });
          dispatch(
            setAlert(`Request to join ${classGrade} ${classSection} sent`, "success", 5000)
          );
          return res.data;
        }
      } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
          type: CLASSROOM_JOIN_REQUEST_FAIL,
        });
      }
    };

