import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getAllMeetings } from "../../actions/meeting";
import PropTypes from "prop-types";
import "../../styles/all-meetings.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteMeeting } from "../../actions/meeting";
import Spinner from "../Spinner";
import { getClassroom } from "../../actions/classroom";
import { faTrashAlt, faPen, } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { TEACHER } from "../../utils/userTypes";
import { setAlert } from "../../actions/alert";

// -------------------------------------------------->

// * Use:  All Meetings
// * Desc:  Shows all the meetings created by the user
// * Access:  Public

const AllMeetings = ({
  getAllMeetings,
  getClassroom,
  deleteMeeting,
  setAlert,
  meeting: { myMeetings, loading },
  user,
}) => {
  const navigate = useNavigate();
  const [classroomsInfo, setClassroomsInfo] = useState({});
  const meetingDateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  // -------------------------------------------------->

  useEffect(() => {
    getAllMeetings({ isTeacher: (true ? user.type === TEACHER : false) });
    let meetingDict = {};
    myMeetings.forEach((meeting) => {
      meetingDict[meeting.id] = false;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------->

  useEffect(() => {
    if (myMeetings)
      myMeetings.map(async (meeting) => {
        if (meeting.classroom && !classroomsInfo[meeting.classroom]) {
          let classroom = await getClassroom(meeting.classroom);
          classroom = `${classroom.grade} ${classroom.section}`;
          setClassroomsInfo({ ...classroomsInfo, [meeting.classroom]: classroom });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myMeetings]);

  // -------------------------------------------------->


  const deleteMyMeeting = (meetingId) => window.confirm("Are you sure you want to delete this meeting?") && deleteMeeting({ meetingId: meetingId });
  
  // -------------------------------------------------->

  return !loading ? (
    <div className="cnt-wrapper cnt-1">
      <h2>All Meetings</h2>
      <div className="meeting-container cnt-1">
        <div className="summary-heading">
          <div className="meeting-name">Meeting Name</div>
          <div className="time-date">Time | Date</div>
          {user.type === TEACHER && <>          <div className="edit">Edit</div>
            <div className="delete">Delete</div></>}
        </div>
        {myMeetings.map((meeting) => (
          <details key={meeting.id} open={user.type === TEACHER ? false : true}>
            <summary>
              <div className="meeting-name">{meeting.name}</div>
              <div className="time-date">
                {meeting.time +
                  " | " +
                  new Date(meeting.date).toLocaleDateString("en-US", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  })}
              </div>

              {user.type === TEACHER && <>      <div className="edit blue"
                onClick={() => {
                  navigate(`/meeting/update/${meeting.id}`);
                }
                }
              >
                <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>

              </div>

                <div
                  className="delete red"
                  onClick={() => deleteMyMeeting(meeting.id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>

                </div></>}
            </summary>
            <div className="meeting-other-info-container">
              {user.type === TEACHER && <><div className="meeting-info-div">
                <div className="meeting-id">
                  {" "}
                  Meeting Id:  <span>{meeting.id}</span>
                </div>
                <div className="meeting-title">
                  Meeting Name:
                  <span> {meeting.name}</span>
                </div>
                <div className="meeting-date">
                  Meeting Date: <span>{new Date(meeting.date).toLocaleDateString("en-US", meetingDateOptions)}</span>
                </div>
                <div className="meeting-time">
                  Meeting Time: <span>{meeting.time}</span>
                </div>
                <div className="meeting-password">
                  Meeting Password: <span> {meeting.password} </span>{" "}
                </div>
                <div className="meeting-bot-status">
                  Bot Enabled: <span> {meeting.botEnable ? "Enabled" : "Disabled"}</span>
                </div>
                {meeting.botEnable ? (
                  <>
                    <div className="meeting-frequency">
                      Frequency: <span>  1 snapshot every {meeting.botDetails.frequency} minutes</span>
                    </div>
                    <div className="meeting-minTime">
                      Minimum Time: <span>  {meeting.botDetails.minTime}</span>
                    </div>
                  </>
                ) : null}
                {user.type === TEACHER &&
                  <div className="meeting-classroom">
                    Class:  <span>{meeting.classroom ? classroomsInfo[meeting.classroom] || "Loading..." : "NA"}</span>
                  </div>
                }
                <div className="meeting-participant-audio">
                  Participant Audio: <span>
                    {meeting.participantsPermissions.audio ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="meeting-participant-video">
                  Participant Video: <span>
                    {meeting.participantsPermissions.video ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="meeting-participant-chat">
                  Participant Chat: <span>
                    {meeting.participantsPermissions.chat ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
                <hr /></>}
              <div
                className={`meeting-invitation-div ${!(user.type === TEACHER) && "text-center"}`}>
                <div className="invitation-cnt" onClick={() => {
                  navigator.clipboard.writeText(`${user.name} is inviting you to a scheduled meeting.\nTopic: ${meeting.name}\n${user.type === TEACHER && meeting.classroom && ("Class:" + classroomsInfo[meeting.classroom])}\nDate: ${new Date(meeting.date).toLocaleDateString("en-US", meetingDateOptions)}\nTime: ${(meeting.time)}\nMeeting ID: ${meeting.id}\nPasscode: ${meeting.password}\n`);
                  setAlert("Copied to clipboard", "success");
                }
                }>
                  <div className="meeting-invitation-title">Invitation</div>
                  <div>
                    <p>{user.name} is inviting you to a scheduled meeting.</p>
                    <p>Topic:  {meeting.name}</p>
                    {
                      user.type === TEACHER && meeting.classroom && (
                        <p>Class:  {classroomsInfo[meeting.classroom]}</p>
                      )
                    }
                    <p>
                      Date: {" "}
                      {new Date(meeting.date).toLocaleDateString(
                        "en-US",
                        meetingDateOptions
                      )}
                    </p>
                    <p>
                      Time:  {(meeting.time)}
                    </p>
                    <p>Meeting ID:  {meeting.id}</p>
                    <p>Passcode:  {meeting.password}</p>
                  </div>
                </div>
                <p className="note note-2">Click on the invitation to copy</p>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div >
  ) : (
    <Spinner />
  );
};

AllMeetings.propTypes = {
  getAllMeetings: PropTypes.func.isRequired,
  meeting: PropTypes.object.isRequired,
  getClassroom: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    meeting: state.meeting,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, {
  getAllMeetings,
  deleteMeeting,
  setAlert,
  getClassroom
})(AllMeetings);
