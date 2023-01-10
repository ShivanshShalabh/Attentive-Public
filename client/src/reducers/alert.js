import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

// * Use: Alert Reducer
// * Desc: Handles the alerts
// * Testing: Passed ✔ (09-04-2022)

const initialState = [];
export default function alertReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ALERT:
            return [...state, action.payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== action.payload);
        default:
            return state;
    }
}