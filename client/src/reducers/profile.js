import { CLEAR_PROFILE, GET_PROFILE, PROFILE_ERROR, PROFILE_UPDATE_FAIL, PROFILE_UPDATE_SUCCESS } from '../actions/types';

// * Use: Profile Reducer
// * Desc: Handles the profile states
// * Testing: Passed ✔ (09-04-2022)

const initialState = {
    profile: {},
    loading: true,
    error: {}
};

export default function profileReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {

        case GET_PROFILE:
        case PROFILE_UPDATE_SUCCESS:
            return {
                ...state,
                profile: payload,
                loading: false
            };

        case PROFILE_ERROR:
        case PROFILE_UPDATE_FAIL:
            return {
                ...state,
                profile: payload,
                loading: false
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: {},
                loading: false
            };
        default:
            return state;
    }
}