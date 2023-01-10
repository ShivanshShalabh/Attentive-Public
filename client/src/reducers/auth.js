import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SCHOOL_REG_SUCCESS,
  SCHOOL_REG_FAIL,
  SCHOOL_LINKING_FAIL,
  SCHOOL_LINKING_SUCCESS,
  CLASSROOM_JOIN_REQUEST_FAIL,
  CLASSROOM_JOIN_REQUEST_SUCCESS
} from "../actions/types";
import setAuthToken from "../utils/setAuthToken";
// * Use: Auth Reducer
// * Desc: Handles the authentication
// * Testing: Passed ✔ (09-04-2022)

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  user: {},
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      setAuthToken(payload.token);
      return {
        ...state,
        token: payload.token,
        user: payload.user,
        isAuthenticated: true,
        loading: false,
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem("token");
      setAuthToken();
      return {
        ...state,
        token: null,
        loading: false,
        isAuthenticated: false,
        user: {},
      };
    case SCHOOL_REG_SUCCESS:
    case SCHOOL_LINKING_SUCCESS:
    case CLASSROOM_JOIN_REQUEST_SUCCESS:
      return {
        ...state,
        user: payload,
      };
    case SCHOOL_REG_FAIL:
    case SCHOOL_LINKING_FAIL:
    case CLASSROOM_JOIN_REQUEST_FAIL:
    default:
      return state;
  }
}
