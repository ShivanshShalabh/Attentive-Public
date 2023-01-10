import {
  GET_SCHOOL_TEACHERS_SUCCESS,
  GET_SCHOOL_TEACHERS_ERROR,
  GET_SCHOOL_STUDENTS_SUCCESS,
  GET_SCHOOL_STUDENTS_ERROR,
  GET_SCHOOL_INFO_SUCCESS,
  GET_SCHOOL_INFO_ERROR,
  SCHOOL_MEMBER_UPDATE_SUCCESS,
  SCHOOL_MEMBER_UPDATE_FAIL,
} from "../actions/types";

// * Use: School Reducer
// * Desc: Handles the school, techers and students states
// * Testing: Passed ✔ (09-04-2022)

const initialState = {
  school: null,
  loadingSchool: true,
  teachers: null,
  students: null,
  loadingTeachers: true,
  loadingStudents: true,
};

export default function authReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_SCHOOL_TEACHERS_SUCCESS:
      return {
        ...state,
        teachers: payload,
        loadingTeachers: false,
      };
    case GET_SCHOOL_TEACHERS_ERROR:
      return {
        ...state,
        loadingTeachers: false,
      };
    case GET_SCHOOL_STUDENTS_SUCCESS:
      return {
        ...state,
        students: payload,
        loadingStudents: false,
      };
    case GET_SCHOOL_STUDENTS_ERROR:
      return {
        ...state,
        loadingStudents: false,
      };
    case GET_SCHOOL_INFO_SUCCESS:
      return {
        ...state,
        school: payload,
        loadingSchool: false,
      };
    case GET_SCHOOL_INFO_ERROR:
      return {
        ...state,
        school: null,
        loadingSchool: false,
      };
    case SCHOOL_MEMBER_UPDATE_SUCCESS:
      return {
        ...state,
        teachers: payload.teachers,
        students: payload.students,
      };
    case SCHOOL_MEMBER_UPDATE_FAIL:
    default:
      return state;
  }
}
