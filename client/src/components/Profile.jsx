import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentProfile, setProfile } from "../actions/profile";
import Spinner from "./Spinner";
import * as faceapi from "face-api.js";
import { setAlert } from "../actions/alert";
import Webcam from "react-webcam";
import "../styles/form.css";
import "../styles/profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";

// -------------------------------------------------->

// * Use: Profile Component
// * Desc: Profile page for the user
// * Access: Private
// * Testing: Passed ✔ (09-04-2022)

const Profile = ({
  getCurrentProfile,
  setProfile,
  setAlert,
  profile: { profile, loading },
}) => {

  const [isProcessing, setIsProcessing] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(
    () => getCurrentProfile(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  // Get the JS library models
  useEffect(() => {
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
      .then(() => {
        setModelsLoaded(true);
      })
      .catch((e) => console.log(e));
    return () => ac.abort();
  }, []);

  // * Form handling
  const [formName, setFormName] = useState("");
  useEffect(() => {
    if (profile) {
      setFormName(profile.meetingName || "");

      if (profile.labeledDescriptors) {
        let tempLabeledDescriptors = profile.labeledDescriptors;

        for (let i = 0; i < tempLabeledDescriptors.descriptors.length; i++) {
          tempLabeledDescriptors.descriptors[i] = new Float32Array(
            tempLabeledDescriptors.descriptors[i]
          );
        }
        setLabeledDescriptors(tempLabeledDescriptors);
      } else setLabeledDescriptors({});
    }
  }, [profile]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      Object.keys(processedImg).length &&
      Object.keys(processedImg).length !== inputImgs.length
    ) {
      setAlert("Please upload all images", "danger");
      return;
    }
    else if (!Object.keys(processedImg).length && formName) {
      setProfile({ meetingName: formName });
      setAlert("Meeting name updated", "success");
      return;
    }
    else if (!Object.keys(processedImg).length && !formName) {
      setAlert("Please upload images or enter a meeting name", "danger");
      return;
    }
    setIsProcessing(true);
    const label = profile.user;
    const descriptions = [];
    for (const key_ in processedImg) {
      const detections = await faceapi
        .detectSingleFace(processedImg[key_])
        .withFaceLandmarks()
        .withFaceDescriptor();
      descriptions.push(detections.descriptor);
    }
    setIsProcessing(false);
    let tempLabeledDescriptors = new faceapi.LabeledFaceDescriptors(
      label,
      descriptions
    );
    profile.labeledDescriptors = tempLabeledDescriptors;
    setProfile({
      labeledDescriptors: tempLabeledDescriptors,
      meetingName: formName,
    });
    profile.meetingName = formName;
    setAlert("Profile Updated Successfully", "success");
  };

  
  const onChange = (e) => setFormName(e.target.value);

  // ------------------------------------------------->

  // * Image handling
  const maxInputImgs = 10;
  const minInputImgs = 3;
  let keyCounter = 0;
  const [labeledDescriptors, setLabeledDescriptors] = useState("");
  const [inputImgs, setInputImgs] = useState(
    Array.from(Array(minInputImgs).keys())
  );
  const [processedImg, setProcessedImg] = useState({});

  const addImageInput = () => {
    if (inputImgs.length >= maxInputImgs) return;
    setInputImgs((prev) => [...prev, prev.length]);
    keyCounter++;
  };

  const reduceImageInput = (ind) => {
    if (inputImgs.length <= minInputImgs) return;
    setProcessedImg((prev) => {
      let newObj = { ...prev };
      delete newObj[ind];
      return newObj;
    });
    setInputImgs((prev) => prev.filter((elem) => elem !== ind));
  };

  const addBase64Image = (e, index) => {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = function () {
      let base64 = reader.result;
      let tempProcessingImage = new Image();
      tempProcessingImage.src = base64;
      setProcessedImg((prev) => {
        return { ...prev, [index]: tempProcessingImage };
      });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };


  // ------------------------------------------------->
  
  // * Webcam initialization and ml model testing

  const webcamRef = React.useRef(null);

  const testMLModel = async () => {
    setIsProcessing(true);
    const imageSrc = webcamRef.current.getScreenshot();
    const tempProcessingImage = new Image();
    tempProcessingImage.src = imageSrc;
    const response = await process_image(tempProcessingImage);
    setIsProcessing(false);
    setAlert(response ? "Present" : "Absent", response ? "success" : "danger");
  };

  const process_image = async (image) => {
    const detections = await faceapi
      .detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceDescriptors();
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
      return false;
    }

    return false;
  };
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const CameraComponent = () => (
    <div className="test-ml-model">
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
        className="profile-webcam"
      />
      <div className="profile-snapshot-btn" onClick={testMLModel}>
        Take Snapshot
      </div>
      <canvas></canvas>
    </div>
  );

  // ------------------------------------------------->

  const ProfileComponent = () => (
    <div className="cnt-wrapper cnt-1">
      <form method="POST" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          <span htmlFor="meetingName">Meeting Name</span>

          <input
            type="text"
            value={formName}
            name="meetingName"
            onChange={(e) => onChange(e)}
            placeholder="Enter meeting name"
          />
        </div>
        <div className="image-inputs">
          <p>Images to create your ML Model:</p>
          {inputImgs.map((i) => {
            keyCounter++;
            return (
              <div key={`img${keyCounter}`} className="img-input-row" >
                <input
                  type="file"
                  className="userImage"
                  name={`userImage${i}`}
                  onChange={(e) => addBase64Image(e, i)}
                />
                <FontAwesomeIcon icon={faTrashAlt} onClick={() => reduceImageInput(i)} className="red" />

              </div>
            );
          })}
        </div>
        <div onClick={addImageInput}>+ Add more images</div>
        <span className="form-note">Please upload your individual images and avoid group pictures. Group images may lead to wrong predictions.</span>
        <div>
          {modelsLoaded ? <button type="submit">
            Update</button> : <Spinner overlay={false} />}
        </div>
      </form>
      {labeledDescriptors?.label ?
        (modelsLoaded ? (
          <>
            <h3>Test your model</h3>
            {CameraComponent()}
          </>
        ) : (
          <Spinner overlay={false} />
        ))
        : null
      }
    </div>
  );
  
  // -------------------------------------------------->

  return loading || isProcessing ? <Spinner /> : <div className="cnt-wrapper">{ProfileComponent()}</div>;
};

Profile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  setProfile: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => {
  return {
    profile: state.profile,
  };
};

export default connect(mapStateToProps, {
  getCurrentProfile,
  setProfile,
  setAlert,
})(Profile);
