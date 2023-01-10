import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

// * Use: Set Alert Action
// * Desc: Help in setting alert
// * Testing: Passed ✔ (09-04-2022)

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = uuid();
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);

};