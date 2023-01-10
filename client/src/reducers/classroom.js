import {
  CLASSROOM_REG_SUCCESS,
  CLASSROOM_REG_FAIL,
  GET_CLASSROOM_INFO_SUCCESS,
  GET_CLASSROOM_INFO_ERROR,
  CLASSROOM_MEMBER_UPDATE_SUCCESS,
  CLASSROOM_MEMBER_UPDATE_FAIL,
  GET_STUDENTS_SUCCESS,
  GET_STUDENTS_ERROR
} from "../actions/types";

// * Use: Meeting Reducer
// * Desc: Handles the meeting registeration states
// * Testing: Passed ✔ (09-04-2022)

const initialState = {
  code: "",
  grade: "",
  section: "",
  school: "",
  classTeacher: "",
  loading: true,
  error: {},
  teachers: null,
  students: null,
  loadingTeachers: true,
  loadingStudents: true,
};

export default function classroomReducer (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CLASSROOM_REG_SUCCESS:
    case GET_CLASSROOM_INFO_SUCCESS:
      return {
        ...state,
        code: payload.code,
        grade: payload.grade,
        section: payload.section,
        school: payload.school,
        classTeacher: payload.classTeacher,
        students: payload.students ? payload.students : null,
        teachers: payload.teachers ? payload.teachers : null,
        loadingTeachers: false,
        loadingStudents: false,
        loading: false,
      };
    case CLASSROOM_REG_FAIL:
    case GET_CLASSROOM_INFO_ERROR:
      return {
        ...state,
        loading: false,
      };
    case CLASSROOM_MEMBER_UPDATE_SUCCESS:
      return {
        ...state,
        teachers: payload.teachers,
        students: payload.students,
      };
    case GET_STUDENTS_SUCCESS:
      return {
        ...state,
        students: payload,
        loadingStudents: false,
      };
    case GET_STUDENTS_ERROR:
    case CLASSROOM_MEMBER_UPDATE_FAIL:
    default:
      return state;
  }
}
