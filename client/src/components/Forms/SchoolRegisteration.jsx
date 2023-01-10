import React, { useState } from "react";
import { registerSchool } from "../../actions/auth";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";
import { setAlert } from "../../actions/alert";
const SchoolRegisteration = ({ registerSchool, profile, setAlert }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    schoolBoard: "",
    schoolAffiliationCode: "",
    schoolUDISE: "",
    schoolCode: "",
  });
  const {
    schoolName,
    schoolAddress,
    schoolBoard,
    schoolAffiliationCode,
    schoolUDISE,
    schoolCode,
  } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    registerSchool({
      schoolName,
      schoolAddress,
      schoolBoard,
      schoolAffiliationCode,
      schoolUDISE,
      schoolCode,
    });
    setAlert(`You have successfully registered your school.`, "success");
    navigate("/");
  };
  return profile.loading ? (
    <Spinner />
  ) : profile.school ? (
    <h1>
      {profile.school} is already registered using this account. You can
      register only one school per accoount
    </h1>
  ) : (
    <form method="POST" onSubmit={(e) => onSubmit(e)}>
      <div>
        <span> School Name: </span>
        <input
          required
          type="text"
          name="schoolName"
          id="schoolName"
          maxLength={50}
          value={schoolName}
          onChange={(e) => onChange(e)}
        />
      </div>
      <div>
        <span> School Address </span>
        <textarea
          required
          type="text"
          name="schoolAddress"
          id="schoolAddress"
          maxLength={100}
          value={schoolAddress}
          onChange={(e) => onChange(e)}
        />
      </div>
      <div>
        <span> School Board: </span>
        <input
          required
          type="text"
          name="schoolBoard"
          id="schoolBoard"
          value={schoolBoard}
          maxLength={40}
          onChange={(e) => onChange(e)}
        />
      </div>
      <div>
        <span> Affiliation Code: </span>
        <input
          required
          type="text"
          name="schoolAffiliationCode"
          id="schoolAffiliationCode"
          maxLength={20}
          value={schoolAffiliationCode}
          onChange={(e) => onChange(e)}
        />
      </div>

      <div>
        <span> UDISE Code: </span>
        <input
          required
          type="text"
          name="schoolUDISE"
          id="schoolUDISE"
          minLength={11}
          maxLength={11}
          value={schoolUDISE}
          onChange={(e) => onChange(e)}
        />
      </div>

      <div>
        <span> School Code: </span>
        <input
          required
          type="text"
          name="schoolCode"
          id="schoolCode"
          maxLength={10}
          minLength={4}
          value={schoolCode}
          onChange={(e) => onChange(e)}
        />
      </div>
      <div>
        <button type="submit">
          Register School
        </button>
      </div>
    </form>
  );
};
const mapStateToProps = (state) => ({
  profile: state.auth.user,
});

SchoolRegisteration.propTypes = {
  registerSchool: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { registerSchool })(
  SchoolRegisteration,
  setAlert
);
