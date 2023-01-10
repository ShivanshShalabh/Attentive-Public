import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../Spinner";
import randomString from "../../utils/randomString";
import { registerClassroom, getClassroom } from "../../actions/classroom";
const CreateClassroom = ({
  profile,
  registerClassroom,
  getClassroom,
  classroom,
}) => {
  useEffect(() => {
    if (profile?.school) setSchoolCode(profile.school);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.loading]);
  useEffect(() => {
    setClassCode(randomString(6));
    getClassroom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    registerClassroom({
      schoolCode,
      classGrade,
      classCode,
      classSection,
    });
  };
  const [classCode, setClassCode] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [classSection, setClassSection] = useState("");
  const [schoolCode, setSchoolCode] = useState("");

  const Form = () => (
    <form method="POST" onSubmit={(e) => onSubmit(e)}>
      <div>
        <span> School Code: </span>
        <input
          required
          type="text"
          name="schoolCode"
          id="schoolCode"
          value={schoolCode}
          readOnly={true}
        />
      </div>

      <div>
        <span>Grade:</span>{" "}
        <input
          required
          type="number"
          name="classGrade"
          value={classGrade}
          max={12}
          min={1}
          onChange={(e) => setClassGrade(e.target.value)}
        />
      </div>

      <div>
        <span>Section:</span>{" "}
        <input
          required
          type="text"
          name="classSection"
          value={classSection}
          maxLength={1}
          onChange={(e) => setClassSection(e.target.value.toUpperCase())}
        ></input>
      </div>
      <div style={{"justify-content":"space-around"}}>
        <input type="text" readOnly={true} style={{"max-width":"30%"}} value={classCode} name="classCode" />
        <button type="button" style={{"margin":"unset"}} onClick={() => setClassCode(randomString(6))}>
          {" "} New Code{" "}
        </button>
      </div>
      <div>
        <button type="submit">
          Create Classroom
        </button>
      </div>
    </form>
  );

  return profile.loading ? (
    <Spinner />
  ) : profile.school ? (
    classroom.code ? (
      <h3>
        You have already registered class {classroom.grade} {classroom.section}{" "}
      </h3>
    ) : (
      Form()
    )
  ) : null;
};
const mapStateToProps = (state) => ({
  profile: state.auth.user,
  classroom: state.classroom,
});

CreateClassroom.propTypes = {
  profile: PropTypes.object.isRequired,
  classroom: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, { registerClassroom, getClassroom })(
  CreateClassroom
);
