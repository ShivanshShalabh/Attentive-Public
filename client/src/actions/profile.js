import axios from 'axios';
import { setAlert } from './alert';
import { GET_PROFILE, PROFILE_ERROR, PROFILE_UPDATE_FAIL, PROFILE_UPDATE_SUCCESS } from './types';

// * USE: Get current user's profile
// * USER_TYPE: STUDENT
// * Desc: Fetches the current user's profile using the token
// * Testing: Passed ✔ (09-04-2022)

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        }
        );
        return res.data;
    } catch (err) {
        dispatch(setAlert("Failed loading profile, try logging out and logging in again. If the error persits, contact admin.", 'danger', 5000));

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};

// * USE: Set Profile
// * USER_TYPE: STUDENT
// * Desc: Updates user profile
// * Testing: Passed ✔ (09-04-2022)

export const setProfile = ({ labeledDescriptors, meetingName }) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ labeledDescriptors, meetingName });

    try {
        const res = await axios.post('/api/profile/update', body, config);
        if (res.data.errors)
            res.data.errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger', 5000));
            }
            );
        else dispatch({
            type: PROFILE_UPDATE_SUCCESS,
            payload: res.data
        });

    }
    catch (err) {
        const errors = err.response.data.errors;
        if (errors) errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));

        dispatch({
            type: PROFILE_UPDATE_FAIL
        });
    }
};
