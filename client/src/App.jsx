import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "./App.css";
import "./styles/typogrophy.css";
import { SCHOOL_ADMIN, STUDENT, TEACHER } from "./utils/userTypes";
import { loadUser } from "./actions/auth";
// Components
import Spinner from "./components/Spinner";
import Home from "./components/Home/Home";
import Join from "./components/Forms/JoinMeeting";
import SignUp from "./components/Forms/SignUp";
import Login from "./components/Forms/Login";
import Room from "./components/Meeting/Room";
import Alert from "./components/Alert";
import setAuthToken from "./utils/setAuthToken";
import PrivateRoute from "./components/PrivateRoute";
import RegMeeting from "./components/Forms/RegMeeting";
import Profile from "./components/Profile";
import AllMeetings from "./components/Meeting/AllMeetings";
import JoinSchool from "./components/Forms/JoinSchool";
import JoinClassroom from "./components/Forms/JoinClassroom";
import ClassroomMemberManage from "./components/Management/ClassroomMemberManage";
import Navbar from "./components/Navbar";
import SchoolRegisteration from "./components/Forms/SchoolRegisteration";
import TeacherManage from "./components/Management/TeacherManage";
import StudentManage from "./components/Management/StudentManage";
import CreateClassroom from "./components/Forms/CreateClassroom";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
    setshowNav(true);
  }, []);
  const [showNav, setshowNav] = useState(true);
  return (
    <Provider store={store}>
      <Router>
        <>
          {showNav && <Navbar />}
          <Alert />
          <Routes>
            <Route
              path="/meeting/join/:meetingIdURL"
              element={
                <PrivateRoute userType={[TEACHER, STUDENT]}>
                  {" "}
                  <Room showNavFunc={setshowNav} />{" "}
                </PrivateRoute>
              }
            />
            <>
              <Route path="/" element={<Home />} />
              <Route path="/spinner" element={<Spinner />} />
              <Route
                path="/meeting/join"
                element={
                  <PrivateRoute userType={[STUDENT, TEACHER]}>
                    {" "}
                    <Join />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/meeting/new"
                element={
                  <PrivateRoute userType={[TEACHER]}>
                    {" "}
                    <RegMeeting />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile/me"
                element={
                  <PrivateRoute userType={[STUDENT, TEACHER, SCHOOL_ADMIN]}>
                    {" "}
                    <Profile />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/meetings"
                element={
                  <PrivateRoute userType={[TEACHER, STUDENT]}>
                    {" "}
                    <AllMeetings />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/meeting/update/:meetingId"
                element={
                  <PrivateRoute userType={[TEACHER]}>
                    {" "}
                    <RegMeeting />{" "}
                  </PrivateRoute>
                }
              />

              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/school/register"
                element={
                  <PrivateRoute userType={[SCHOOL_ADMIN]}>
                    {" "}
                    <SchoolRegisteration />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/school/teachers"
                element={
                  <PrivateRoute userType={[SCHOOL_ADMIN]}>
                    {" "}
                    <TeacherManage />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/school/students"
                element={
                  <PrivateRoute userType={[SCHOOL_ADMIN]}>
                    {" "}
                    <StudentManage />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/school/join"
                element={
                  <PrivateRoute userType={[TEACHER, STUDENT]}>
                    {" "}
                    <JoinSchool />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/classroom/new"
                element={
                  <PrivateRoute userType={[TEACHER]}>
                    {" "}
                    <CreateClassroom />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/classroom/join"
                element={
                  <PrivateRoute userType={[STUDENT, TEACHER]}>
                    {" "}
                    <JoinClassroom />{" "}
                  </PrivateRoute>
                }
              />
              <Route
                path="/classroom/all"
                element={
                  <PrivateRoute userType={[TEACHER]}>
                    {" "}
                    <ClassroomMemberManage />{" "}
                  </PrivateRoute>
                }
              />
            </>
          </Routes>
        </>
      </Router>
    </Provider>
  );
};

export default App;
