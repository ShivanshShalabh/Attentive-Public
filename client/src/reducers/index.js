import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import profile from './profile'
import meeting from './meeting'
import joinMeeting from './joinMeeting';
import school from './school';
import classroom from './classroom';
export default combineReducers({
    alert,
    auth,
    profile,
    meeting,
    joinMeeting,
    school,
    classroom
});