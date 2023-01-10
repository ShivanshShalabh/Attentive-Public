import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { checkMeetingPassword } from "../../actions/joinMeeting";
import PropTypes from "prop-types";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";
import { getCurrentProfile } from "../../actions/profile";
import io from "socket.io-client";
import Peer from "peerjs";
import "../../styles/room.css";
import { getStudentClassroom } from "../../actions/classroom";
import { getSingleMeeting } from "../../actions/meeting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faVideoSlash,
  faMicrophone,
  faMicrophoneSlash,
  faRightFromBracket,
  faUsers,
  faTimesCircle,
  faPaperPlane,
  faEye,
  faEyeSlash,
  faSquareXmark,
  faCheckDouble,
  faDownload
} from "@fortawesome/free-solid-svg-icons";

// -------------------------------------------------->

const Room = ({
  joinMeeting: { meetingId, meetingPassword, meetingName },
  checkMeetingPassword,
  user: { profile, loading: loadingUser },
  getCurrentProfile,
  getStudentClassroom,
  getSingleMeeting,
  meetingState: { meeting: currentMeetingInfo, loading: loadingMeetingInfo },
  showNavFunc
}) => {
  // * Initialising states
  showNavFunc(false);
  let totalMarkedPresent = 0;
  const navigate = useNavigate();
  const [authCheck, setAuthCheck] = useState(false);
  const [remoteVideoRef, setRemoteVideoRef] = useState({});
  const myVideoRef = useRef(null);
  const [allMessages, setAllMessages] = useState([]);
  const [myMessage, setMyMessage] = useState("");
  const socketFunctions = useRef({});
  const [videoState, setVideoState] = useState(false);
  const [audioState, setAudioState] = useState(false);
  const [allParticipants, setAllParticipants] = useState({});
  const webcamRef = useRef(null);
  const [remoteVideoCollection, setRemoteVideoCollection] = useState([]);
  const [isPresent, setIsPresent] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [labeledDescriptors, setLabeledDescriptors] = useState("");
  const [botStatus, setBotStatus] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const botTimeInterval = useRef(null);
  const downloadAttendance = useRef(null);
  const allStudents = useRef([]);

  // -------------------------------------------------->

  useEffect(() => {
    const setupFunctions = async () => {
      // * MeetingId validation and getting meeting info
      const authCheckTemp = await checkMeetingPassword({
        meetingId,
        meetingPassword,
        meetingName,
      });
      if (!authCheckTemp) navigate("/meeting/join");
      setAuthCheck(authCheckTemp);

      await getSingleMeeting({
        meetingId
      });

      const userProfile = await getCurrentProfile();

      // -------------------------------------------------->

      // * Connect to media devices, socket.io 
      const socket = io.connect("https://attentive.onrender.com/");
      navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
        myVideoRef.current.srcObject = mediaStream;
        myVideoRef.current.play();
        myVideoRef.current.srcObject.getVideoTracks()[0].enabled = false;
        myVideoRef.current.srcObject.getAudioTracks()[0].enabled = false;
      });

      // -------------------------------------------------->
      // * Connect to peerjs

      const peer = new Peer();

      // important fuctions
      const call = (remotePeerId, peerUserId) => {
        let callVar = peer.call(remotePeerId, myVideoRef.current.srcObject, { metadata: { userId: userProfile.user } });
        callVar.on("stream", (remoteStream) => {
          setRemoteVideoRef((prevState) => ({
            ...prevState,
            [peerUserId]: remoteStream,
          }));
        });
      };
      peer.on("call", async (call) => {
        call.answer(myVideoRef.current.srcObject);
        let peerUserId = call.metadata.userId;
        call.on("stream", (remoteStream) => {
          setRemoteVideoRef((prevState) => ({
            ...prevState,
            [peerUserId]: remoteStream,
          }));
        });
      });

      // We have these socket function within peer.on open because we need to prevent calling peer before peer is connected and peer id is generated
      peer.on("open", (id) => {
        socket.on("user-connected", (meetingParticipants, userId, peerID) => {
          setAllParticipants(meetingParticipants);
          call(peerID, userId);
        });
        socket.on("user-disconnected", (userId) => {
          setRemoteVideoRef((prevState) => {
            if (prevState[userId]) delete prevState[userId];
            return { ...prevState };
          });
        });
        socket.on("update-participant-state", (meetingParticipants) => {
          setAllParticipants(meetingParticipants);
        });

        socket.emit("join-meeting", {
          meetingId: meetingId,
          meetingName: meetingName,
          userId: userProfile.user,
          peerID: id,
        });
      });

      // * Meeting socket functions
      const sendMessage = (message) => {
        const messageTime = `${new Date().getHours()} : ${new Date().getMinutes()}`;
        socket.emit("send-message", {
          meetingId,
          message,
          userId: userProfile.user,
          name: meetingName,
          time: messageTime,
        });
        setAllMessages((prev) => [
          ...prev,
          { message, userId: userProfile.user, name: meetingName, time: messageTime },
        ]);
        setMyMessage("");
      };

      const updateParticipantState = (state) => {
        socket.emit("update-participant-state", {
          meetingId,
          meetingName,
          userId: userProfile.user,
          audio: state?.audioState ?? audioState,
          video: state?.videoState ?? videoState,
          present: state?.isPresent ?? isPresent,
          botEnabled: state?.botEnabled ?? botStatus,
        });

      };
      const leaveMeeting = () => {
        socket.emit("leave-meeting", {
          meetingId,
          userId: userProfile.user,
        });
        navigate("/meeting/join");
        window.location.reload(false);

      };
      socketFunctions.current = {
        ...socketFunctions.current,
        updateParticipantState,
        leaveMeeting,
        sendMessage,
      };

      socket.on("recieve-message", ({ message, userId, time, name }) => setAllMessages((prev) => [...prev, { message, userId, time, name }]));
      socket.on("connect", () => socket.on("message", (msg) => msg));
      socket.on("user-updated", (meetingParticipants) => setAllParticipants(meetingParticipants));
      socket.on("user-disconnected", (userId) => {
        setRemoteVideoRef((prevState) => {
          delete prevState[userId];
          return { ...prevState };
        });
        setAllParticipants((prev) => {
          delete prev[userId];
          return { ...prev };
        }
        );
      }
      );
    };
    setupFunctions();
    // Function to prevent closing tab
    const handleTabClose = event => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------->
  // *Loading models for face recognition only if it is a classroom meeting
  useEffect(() => {
    const loadStudentListandJSLib = async () => {
      if (currentMeetingInfo?.classroom) {
        allStudents.current = await getStudentClassroom(currentMeetingInfo.classroom);
      }
      if (!modelsLoaded) {
        const ac = new AbortController();
        Promise.all([
          faceapi.nets.faceRecognitionNet.loadFromUri(
            process.env.PUBLIC_URL + "/models"
          ),
          faceapi.nets.faceLandmark68Net.loadFromUri(
            process.env.PUBLIC_URL + "/models"
          ),
          faceapi.nets.ssdMobilenetv1.loadFromUri(
            process.env.PUBLIC_URL + "/models"
          ),
        ])
          .then(() => { setModelsLoaded(true); })
          .catch((e) => console.log(e));
        return () => ac.abort();

      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
    loadStudentListandJSLib();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMeetingInfo]);

  // -------------------------------------------------->

  // *Converting the descriptors to Float32Array for face recognition
  useEffect(() => {
    if (profile?.labeledDescriptors) {
      let tempLabeledDescriptors = profile.labeledDescriptors;
      for (let i = 0; i < tempLabeledDescriptors.descriptors.length; i++) {
        tempLabeledDescriptors.descriptors[i] = new Float32Array(
          tempLabeledDescriptors.descriptors[i]
        );
      }
      setLabeledDescriptors(tempLabeledDescriptors);
    } else setLabeledDescriptors({});
  }, [profile]);

  // -------------------------------------------------->

  useEffect(() => {
    if (!socketFunctions.current["updateParticipantState"]) return;
    socketFunctions.current.updateParticipantState({
      videoState,
      audioState,
      isPresent,
      botEnabled: botStatus,
    });
  }, [videoState, audioState, isPresent, botStatus]);

  // -------------------------------------------------->

  // *Function to process the image and return if participant is present or not
  const processImage = async (image) => {
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
    if (detections.length > 0) {
      let tempLabeledDescriptors = labeledDescriptors;
      tempLabeledDescriptors["_descriptors"] =
        tempLabeledDescriptors.descriptors.map(
          (elem) => new Float32Array(elem)
        );
      tempLabeledDescriptors = new faceapi.LabeledFaceDescriptors(
        labeledDescriptors.label,
        tempLabeledDescriptors.descriptors
      );
      let faceMatcher = new faceapi.FaceMatcher(tempLabeledDescriptors, 0.8);
      const results = detections.map((d) =>
        faceMatcher.findBestMatch(d.descriptor)
      );
      if (results.length > 0) return true;
    }
    return false;
  };

  // -------------------------------------------------->

  //* Function to take snapshot and eval attendance
  const takeSnapshot = async () => {
    if (!modelsLoaded || isPresent) return;
    const tempProcessingImage = new Image();
    tempProcessingImage.src = webcamRef.current.getScreenshot();
    const response = await processImage(tempProcessingImage);
    totalMarkedPresent += response ? 1 : 0;
    if (
      !loadingMeetingInfo &&
      totalMarkedPresent >= currentMeetingInfo.botDetails.minTime
    ) {
      setIsPresent(true);
      clearInterval(botTimeInterval.current);
    }
  };

  // -------------------------------------------------->

  // *Camera component
  const MLCameraComponent = () => (
    <div className="ml-cam">
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={{
          width: 1280,
          height: 720,
          facingMode: "user",
        }}
      />
      <canvas></canvas>
    </div>
  );

  // -------------------------------------------------->

  // *Function to create and  download the attendance file
  const downloadTxtFile = () => {
    const element = document.createElement("a");
    let presentParticipants = [];
    let presentAbsentees = [];
    let absentees = [];
    let allParticipantsInMeeting = [];
    Object.keys(allParticipants).forEach((key) => {
      if (allParticipants[key].present)
        presentParticipants.push(allParticipants[key].name);
      else presentAbsentees.push(allParticipants[key].name);
      allParticipantsInMeeting.push(key);
    });

    const file = new Blob([`Meeting name: ${currentMeetingInfo.name}\nDate: ${new Date().toLocaleString('en-US')}\n\nPresent Participants:\n${presentParticipants.join("\n")}\n\nIn meeting but not present:\n${presentAbsentees.join("\n")}\n\nAbsentees:\n${absentees.join('\n')}`], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = `${currentMeetingInfo.name}_${new Date().toLocaleString('en-US')}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  // -------------------------------------------------->

  // * Click handlers
  const videoBtnHandler = () => myVideoRef?.current?.srcObject?.getVideoTracks &&
    setVideoState(prev => {
      myVideoRef.current.srcObject.getVideoTracks()[0].enabled = !prev;
      return !prev;
    });

  const audioBtnHandler = () => {
    setAudioState(prev => {
      myVideoRef.current.srcObject.getAudioTracks()[0].enabled = !prev;
      return !prev;
    });
  };

  const botBtnHandler = () =>
    !isPresent && profile?.labeledDescriptors && setBotStatus(prev => {
      if (!prev)
        botTimeInterval.current = setInterval(() => {
          takeSnapshot();
        }, 5000);
      else
        clearInterval(botTimeInterval.current);
      return !prev;
    });

  // -------------------------------------------------->

  // *Peer participants video component
  useEffect(() => {
    setRemoteVideoCollection(
      Object.keys(remoteVideoRef).map((key) => {
        if (key === profile.user) return null;
        return (
          <video
            className="remote-video"
            id={key}
            key={key}
            ref={async (video) => {
              const tempVideo = await video;
              // if (tempVideo === null) setTimeout(() => { }, 2000);
              if (tempVideo !== null) tempVideo.srcObject = remoteVideoRef[key];
              // else tempVideo.src = URL.createObjectURL(remoteVideoRef[key]);
              // tempVideo.srcObject = remoteVideoRef[key];
            }
            }
            autoPlay={true}
          ></video>
        );
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteVideoRef]);

  
  // -------------------------------------------------->

  return authCheck && !loadingUser ? (
    <main className="no-overflow">
      <div className="meeting-details">
        <div className="meeting-id">
          Room Id:
          <span> {currentMeetingInfo.id} </span>
        </div>
        <div className="meeting-password">
          Password:
          <span> {currentMeetingInfo.password}</span>
        </div>
      </div>
      <div className="main_container">
        <div className="video-gallery">
          <div id="my-video-container">
            <video src=""
              ref={myVideoRef}
              id="my-video"
              muted={true}
            ></video>
          </div>
          <div id="other-participants-video-container">
            {remoteVideoCollection}
          </div>
        </div>
        <div className="messages_parent_div " id="chat-div">
          <h4 className="meeting-room-h4">Chats</h4>

          <div className="messages_container">
            <ul id="message-inbox">
              {allMessages.map((elem) => (
                <li
                  className={`message ${elem.userId !== profile.user ? 'recieved' : 'sent'}`}
                  key={JSON.stringify(elem.time + Math.random())}
                >
                  <strong className="author">{elem.userId !== profile.user ? elem.name : "Me"}</strong>
                  <span className="message">{elem.message}</span>
                </li>
              ))}
            </ul>
            <div className="input_container">
              <input
                type="text"
                placeholder="Type your message here"
                value={myMessage}
                id="message-box"
                onChange={(e) => setMyMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    socketFunctions.current["sendMessage"](myMessage);
                  }
                }}
              />
              <FontAwesomeIcon icon={faPaperPlane} onClick={() => {
                if (myMessage)
                  socketFunctions.current["sendMessage"](myMessage);
              }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="control-panel">
        <div id="control-panel-video">
          <FontAwesomeIcon
            icon={videoState ? faVideo : faVideoSlash}
            className={`${videoState ? "green" : "red"} ${myVideoRef?.current?.srcObject?.getVideoTracks ? "" : "disabled"}`}
            onClick={() => videoBtnHandler()}
          ></FontAwesomeIcon>
        </div>
        <div id="control-panel-audio">
          <FontAwesomeIcon
            icon={audioState ? faMicrophone : faMicrophoneSlash}
            className={`${audioState ? "green" : "red"} ${myVideoRef?.current?.srcObject?.getAudioTracks ? "" : "disabled"}`}
            onClick={() => audioBtnHandler()}
          ></FontAwesomeIcon>
        </div>
        {
          !isPresent &&
          <div className="bot-box" id="bot-div">

            <FontAwesomeIcon
              icon={botStatus ? faEye : faEyeSlash}
              className={`${botStatus && profile?.labeledDescriptors && !isPresent ? "green" : "red"} ${isPresent || !profile?.labeledDescriptors ? "disabled" : ""}`}
              onClick={() => botBtnHandler()}
            ></FontAwesomeIcon>
          </div>
        }<div>
          <FontAwesomeIcon icon={faUsers}
            className={`${allParticipants ? "" : "disabled"}`}
            onClick={() =>
              setShowParticipants(prev => !prev)
            }
          ></FontAwesomeIcon>
        </div>
        <div id="leave-room">
          <FontAwesomeIcon onClick={() => socketFunctions.current.leaveMeeting()} icon={faRightFromBracket} className="red"></FontAwesomeIcon>

        </div>
      </div>
      {<div className={`participant-container ${!showParticipants && "inactive"}`} id="participant-div">
        <FontAwesomeIcon className="close-btn" id="close-participant-panel" onClick={() => setShowParticipants(prev => !prev)} icon={faTimesCircle}></FontAwesomeIcon>
        <h4 className="meeting-room-h4">Participants Panel</h4>
        <ul id="participant-list">
          {Object.keys(allParticipants).map((elem) => (
            <li key={elem} id={elem} className="participant-li" >
              <span className="participant-name">
                {allParticipants[elem]?.name}
              </span>
              <div><FontAwesomeIcon
                icon={allParticipants[elem].video ? faVideo : faVideoSlash}
                className={allParticipants[elem].video ? "green" : "red"}
              ></FontAwesomeIcon></div>
              <div><FontAwesomeIcon
                icon={
                  allParticipants[elem].audio ? faMicrophone : faMicrophoneSlash
                }
                className={allParticipants[elem].audio ? "green" : "red"}
              ></FontAwesomeIcon></div>
              <div><FontAwesomeIcon
                icon={allParticipants[elem].botEnabled ? faEye : faEyeSlash}
                className={allParticipants[elem].botEnabled ? "green" : "red"}
              ></FontAwesomeIcon></div>
              <div><FontAwesomeIcon
                icon={allParticipants[elem].present ? faCheckDouble : faSquareXmark}
                className={allParticipants[elem].present ? "green" : "red"}
              ></FontAwesomeIcon></div>
            </li>
          ))}
        </ul>
        {currentMeetingInfo.classroom &&
          <button
            className="download-attendance"
            ref={downloadAttendance}
            onClick={downloadTxtFile}
          >
            <FontAwesomeIcon icon={faDownload} /> {"\t\t"}
            Download Attendance</button>
        }
      </div>}

      {currentMeetingInfo.botEnable &&
        <>     <MLCameraComponent />
        </>
      }

    </main >
  ) : (
    <Spinner />
  );
};

Room.propTypes = {
  checkMeetingPassword: PropTypes.func.isRequired,
  joinMeeting: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  getSingleMeeting: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  joinMeeting: state.joinMeeting,
  user: state.profile,
  meetingState: state.meeting,
});

export default connect(mapStateToProps, {
  checkMeetingPassword,
  getCurrentProfile,
  getStudentClassroom,
  getSingleMeeting,
})(Room);
