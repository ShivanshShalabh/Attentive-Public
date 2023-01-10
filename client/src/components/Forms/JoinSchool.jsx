import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../Spinner";
import { getSchoolInfo } from "../../actions/school";
import { joinSchool, loadUser } from "../../actions/auth";
import { setAlert } from "../../actions/alert";
import { STUDENT, TEACHER } from "../../utils/userTypes";
import { useNavigate } from "react-router-dom";
const JoinSchool = ({
  user,
  school,
  getSchoolInfo,
  joinSchool,
  setAlert,
  loadUser,
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (
      user?.joinRequest?.school?.requestStatus &&
      !user.joinRequest.school.requestStatus.processing &&
      !user.joinRequest.school.requestStatus.approved
    )
      setAlert(
        `Your request to join school ${user.joinRequest.school.code} has been rejected. If you think this is an error, please contact the school admin.`,
        "danger"
      );
    if (user?.type)
      userType.current =
        user.type === TEACHER
          ? "teachers"
          : user.type === STUDENT
            ? "students"
            : "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.loading]);
  const userType = useRef(null);

  const [schoolCode, setSchoolCode] = useState("");
  const onSubmit = async (e) => {
    e.preventDefault();
    joinSchool({ schoolCode, userType: userType.current });
    setAlert(`Your request to join school ${schoolCode} was sent.`, "success");
    navigate("/");
  };

  const Form = () => (
    <form method="POST" onSubmit={(e) => onSubmit(e)}>
      <div>
        <span> School Code: </span>
        <input
          required
          type="text"
          name="schoolCode"
          id="schoolCode"
          maxLength="10"
          minLength="4"
          value={schoolCode}
          onChange={(e) => setSchoolCode(e.target.value)}
        />
      </div>
      {!school.loadingSchool && school.school && (
        <>
          <p>School Name: {school.school.name}</p>
          <p>School Address: {school.school.address}</p>
          <p>School Board: {school.school.board}</p>
          <p>School Affiliation Code: {school.school.affiliationCode}</p>
          <p>School UDISE: {school.school.udise}</p>
        </>
      )}
      <div>
        <button type="button"
          onClick={() => {
            if (schoolCode.length >= 4 && schoolCode.length < 11)
              getSchoolInfo({ schoolCode });
          }}
        >
          Get School Info
        </button>
      </div>
      {school.school && (
        <div>
          <button type="submit">
            Join
          </button>
        </div>
      )}
    </form>
  );

  return user.loading ? (
    <Spinner />
  ) : user.school ? (
    <p className="note">
      {user.school} is already registered using this account. You can
      register only one school per accoount
    </p>
  ) : user?.joinRequest?.school ? (
    user.joinRequest.school.requestStatus.processing ? (
      <p className="note">
        Your request to join {user.joinRequest.school.code} is pending. You
        will be notified once the school admin approves your request.
      </p>
    ) : user.joinRequest.school.requestStatus.approved ? (
      <p className="note">
        You have already joined {user.joinRequest.school.code}. You can manage
        your school from your user.
      </p>
    ) : (
      <>{Form()}</>
    )
  ) : (
    Form()
  );
};
const mapStateToProps = (state) => ({
  user: state.auth.user,
  school: state.school,
});

JoinSchool.propTypes = {
  user: PropTypes.object.isRequired,
  school: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
  loadUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  getSchoolInfo,
  joinSchool,
  setAlert,
  loadUser,
})(JoinSchool);
