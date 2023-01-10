import React, { useEffect, useState } from "react";
import "../../styles/form.css";
import { regMeeting, updateMeeting } from "../../actions/meeting";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getSingleMeeting } from "../../actions/meeting";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../Spinner";
import { v4 as uuid } from "uuid";
import { TEACHER } from '../../utils/userTypes';
// * Use: Register new meeting
// * Desc: Helps user to schedule a meeting
// * Access: Authorized
// * Testing: Passed ✔ (09-04-2022)

const RegMeeting = ({
  regMeeting,
  updateMeeting,
  getSingleMeeting,
  meeting: { meeting, loading },
  user
}) => {
  const navigate = useNavigate();
  const updatingMeetingId = useParams()["meetingId"] || undefined;
  const isUpdating = updatingMeetingId ? true : false;
  useEffect(() => {
    const checkIfMeetingExists = async () => {
      if (isUpdating) {
        const meetingExists = await getSingleMeeting({
          meetingId: updatingMeetingId,
        });
        if (!meetingExists) {
          navigate("/meeting/new");
        }
      }
    };
    checkIfMeetingExists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!loading && Object.keys(meeting).length) {
      const meetingDateDDMMYY = [
        new Date(meeting.date).toLocaleDateString("en-US", { year: "numeric" }),
        new Date(meeting.date).toLocaleDateString("en-US", {
          month: "2-digit",
        }),
        new Date(meeting.date).toLocaleDateString("en-US", { day: "2-digit" }),
      ].join("-");
      // extract meetingTime from meeting.time in format HH:MM AM/PM
      const meetingTimeIn12HrFormat = meeting.time.split(" ")[0];
      let AMPM = meeting.time.split(" ")[1]?.toUpperCase();
      console.log(meetingTimeIn12HrFormat,AMPM);
      const meetingTimeIn24HrFormat = AMPM === "PM"
        ? meetingTimeIn12HrFormat.split(":")[0] === "12"
          ? meetingTimeIn12HrFormat
          : `${parseInt(meetingTimeIn12HrFormat.split(":")[0]) + 12}:${meetingTimeIn12HrFormat.split(":")[1]}`
        : meetingTimeIn12HrFormat.split(":")[0] === "12"
          ? `00:${meetingTimeIn12HrFormat.split(":")[1]}`
          : meetingTimeIn12HrFormat;
      console.log(meetingTimeIn24HrFormat);


      setFormData({
        meetingName: meeting.name,
        meetingDate: meetingDateDDMMYY,
        meetingTime: meetingTimeIn24HrFormat,
        meetingId: updatingMeetingId,
        meetingPassword: meeting.password,
        participantsAudio: meeting.participantsPermissions.audio,
        participantsVideo: meeting.participantsPermissions.video,
        participantsChat: meeting.participantsPermissions.chat,
        botEnable: meeting.botEnable,
        frequency: meeting.botDetails.frequency,
        minTime: meeting.botDetails.minTime,
        meetingClassroom: meeting.classroom,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meeting]);
  const [formData, setFormData] = useState({
    meetingName: "",
    meetingDate: "",
    meetingTime: "",
    meetingId: uuid().slice(0, 6),
    meetingPassword: "",
    participantsAudio: true,
    participantsVideo: true,
    participantsChat: true,
    botEnable: true,
    frequency: 5,
    minTime: 6,
    meetingClassroom: ""
  });
  const {
    meetingName,
    meetingDate,
    meetingTime,
    meetingId,
    meetingPassword,
    participantsAudio,
    participantsVideo,
    participantsChat,
    botEnable,
    frequency,
    minTime,
    meetingClassroom
  } = formData;
  const botEnableOptions = () => (
    <>
      <div id="ss-frequency">
        <span>Frequency: </span>
        <p>
          1 snapshot per {" "}
          <input
            required
            type="number"
            name="frequency"
            id="ssfrequency"
            min="1"
            max="100"
            value={frequency}
            onChange={(e) => onChange(e)}
          />
          {" "} minutes
        </p>
      </div>
      <div id="min-time">
        <span> Minimum Attendance: </span>
        <p>
          <input
            required
            type="number"
            name="minTime"
            id="minTime"
            min="1"
            max="100"
            value={minTime}
            onChange={(e) => onChange(e)}
          />
        </p>
      </div>
    </>
  );
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



  const onSubmit = async (e) => {
    e.preventDefault();
    let body = {
      meetingName,
      meetingDate,
      meetingTime,
      meetingId,
      meetingPassword,
      participantsAudio,
      participantsVideo,
      participantsChat,
      botEnable,
      frequency: botEnable ? frequency : 0,
      minTime: botEnable ? minTime : 0,
      meetingClassroom
    };
    const successfullyProcessed = !isUpdating ? await regMeeting(body) : await updateMeeting(body);
    if (successfullyProcessed) { navigate("/meetings"); };
  };
  return !isUpdating || !loading ? (
    <form method="POST" onSubmit={onSubmit}>
      <div id="meeting-id">
        <span> Meeting Id: </span>
        <input
          required
          type="text"
          name="meetingId"
          id="meetingId"
          value={meetingId}
          readOnly={true}
          disabled={true}
        />
      </div>
      <div id="">
        <span> Meeting Name: </span>
        <input
          required
          type="text"
          name="meetingName"
          id="meetingName"
          value={meetingName}
          onChange={(e) => onChange(e)}
        />
      </div>
      <div id="">
        <span> Meeting Date: </span>
        <input
          required
          type="date"
          name="meetingDate"
          id="meetingDate"
          value={meetingDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => onChange(e)}
        />
      </div>
      <div id="">
        <span> Meeting Time: </span>
        <input
          required
          type="time"
          name="meetingTime"
          id="meetingTime"
          value={meetingTime}
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

      <div>
        <span>Attentive Bot</span>
        <input
          type="checkbox"
          name="botEnable"
          checked={botEnable}
          id="botEnable"
          onChange={(e) =>
            setFormData({
              ...formData,
              [e.target.name]: !formData[e.target.name],
            })
          }
        />
      </div>

      {botEnable && botEnableOptions()}
      {user.type === TEACHER && user.classrooms.length && <>
        <div>
          <span>Classroom</span>
          <select
            name="meetingClassroom"
            id="meetingClassroom"
            value={meetingClassroom}
            onChange={(e) => onChange(e)}
          >
            <option value="">Select a classroom</option>
            {user.classrooms.map((classroom) => (
              <option key={classroom.code} value={classroom.code}>
                {classroom.grade} {classroom.section}
              </option>
            ))}

          </select>
        </div>

      </>}

      <div>
        <button type="submit">
          {isUpdating ? "Update Meeting" : "Create Meeting"}{" "}

        </button>
      </div>
    </form>
  ) : (
    <Spinner />
  );
};

RegMeeting.propTypes = {
  regMeeting: PropTypes.func.isRequired,
  updateMeeting: PropTypes.func.isRequired,
  getSingleMeeting: PropTypes.func.isRequired,
  meeting: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  meeting: state.meeting,
  user: state.auth.user
});


export default connect(mapStateToProps, {
  regMeeting,
  updateMeeting,
  getSingleMeeting,
})(RegMeeting);
