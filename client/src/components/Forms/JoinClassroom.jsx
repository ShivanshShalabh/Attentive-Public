import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../Spinner";
import { getSchoolInfo } from "../../actions/school";
import { joinClassroom, loadUser } from "../../actions/auth";
import { setAlert } from "../../actions/alert";
import { STUDENT, TEACHER } from "../../utils/userTypes";
import { useNavigate } from "react-router-dom";
const JoinClassroom = ({
    user,
    school,
    getSchoolInfo,
    joinClassroom,
    setAlert,
    loadUser,
}) => {
    const navigate = useNavigate();
    useEffect(() => {
        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (user.school)
            getSchoolInfo({ schoolCode: user.school });
        if (!(user?.joinRequest?.classroom?.requestStatus?.approved ?? true)) {
            setAlert(`Your request to join ${user.joinRequest.classroom.grade} ${user.joinRequest.classroom.section} has been denied.`, "danger");
        }
        if (user && user.type)
            userType.current =
                user.type === TEACHER
                    ? "teachers"
                    : user.type === STUDENT
                        ? "students"
                        : "";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.loading]);
    const userType = useRef(null);
    const onSubmit = async (e) => {
        e.preventDefault();
        joinClassroom({ classGrade: grade, userType: userType.current, classSection: section, schoolCode: user.school });
        navigate("/");
    };
    const [grade, setGrade] = useState("");
    const [section, setSection] = useState("");
    const Form = () => (
        <form method="POST" onSubmit={(e) => onSubmit(e)}>
            <div>
                <span>Grade</span>
                <select
                    name="grade"
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                >
                    <option value="">Select Grade</option>
                    {
                        school.school &&
                        school.school.classrooms &&
                        Object.keys(school.school.classrooms).map((grade) => (
                            <option key={grade} value={grade}>
                                {grade}
                            </option>
                        ))
                    }
                </select>
            </div>
            <div>
                <span>Section</span>
                <select
                    name="section"
                    id="section"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                >
                    <option value="">Select Section</option>
                    {
                        school.school &&
                        school.school.classrooms &&
                        school.school.classrooms[grade] &&
                        school.school.classrooms[grade].map((section) => (
                            <option key={section} value={section}>
                                {section}
                            </option>
                        ))
                    }
                </select>
            </div>


            <div>
                <button type="submit">
                    Join
                </button>
            </div>

        </form>
    );

    return user.loading || school.loadingSchool ? (
        <Spinner />
    ) : user.school ? (user.classrooms.length && user.type !== TEACHER ? <h1>You are already registered to class {user.classrooms[0].grade} {user.classrooms[0].section}</h1>
        : user?.joinRequest?.classroom?.requestStatus?.processing ? <h1>Waiting for approval from your class teacher.</h1>
            : <>{Form()}</>)
        : <h1>Please join a school in order to join a classroom</h1>;
};
const mapStateToProps = (state) => ({
    user: state.auth.user,
    school: state.school,
});

JoinClassroom.propTypes = {
    user: PropTypes.object.isRequired,
    school: PropTypes.object.isRequired,
    setAlert: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
    getSchoolInfo,
    joinClassroom,
    setAlert,
    loadUser,
})(JoinClassroom);
