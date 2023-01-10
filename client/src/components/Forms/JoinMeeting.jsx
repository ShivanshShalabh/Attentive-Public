import React, { useState } from "react";
import "../../styles/form.css";
import { connect } from "react-redux";
import { checkMeetingPassword } from "../../actions/joinMeeting";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCurrentProfile } from "../../actions/profile";
// * Use: Join a meeting
// * Desc: Renders the join meeting form
// * Access: Authorized
// * Testing: Passed ✔ (09-04-2022)

const Join = ({
  checkMeetingPassword,
  getCurrentProfile,
  profile,
  joinMeeting,
  user,
}) => {
  useEffect(() => {
    const setMeetingName = async () => {
      const meetingInfo = await getCurrentProfile();
      if (formData)
        setFormData({
          ...formData,
          userName: meetingInfo.meetingName || user?.name
        });
      };
      setMeetingName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: profile?.profile?.meetingName || user?.name,
    meetingId: joinMeeting["meetingId"] || "",
    meetingPassword: "",
  });
  const { userName, meetingId, meetingPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const correctPassword = await checkMeetingPassword({
      meetingId,
      meetingPassword,
      meetingName: userName,
    });
    if (correctPassword === true) {
      const pathRoute = `/meeting/join/${meetingId}`;
      navigate(pathRoute, { replace: true }, { state: userName });
    }
  };
  return (
    <form method="POST" onSubmit={onSubmit}>
      <div id="meeting-id">
        <span> Meeting Id: </span>
        <input
          required
          type="text"
          name="meetingId"
          id="meetingId"
          value={meetingId}
          onChange={(e) => onChange(e)}
        />
      </div>
      <div id="password">
        <span> Password: </span>
        <input
          required
          type="password"
          name="meetingPassword"
          id="meetingPassword"
          minLength="6"
          maxLength="12"
          value={meetingPassword}
          onChange={(e) => onChange(e)}
        />
      </div>
      <div id="joining-name">
        <span> Name: </span>

        <input
          required
          type="text"
          name="userName"
          id="userName"
          maxLength="25"
          value={userName}
          onChange={(e) => onChange(e)}
        />
      </div>
      <div>
        <button type="submit">
          Join Now
        </button>
      </div>
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    joinMeeting: state.joinMeeting,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, { checkMeetingPassword, getCurrentProfile })(Join);
