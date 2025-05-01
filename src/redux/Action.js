import { bncApi, getterFunction } from "../Api";

export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';

export const fetchUsers = () => async (dispatch, getState) => {
    const { userState } = getState(); // Corrected: No parentheses
    const { users } = userState; // Corrected: No parentheses

    if (users && users.length > 0) {
        console.log('users are already there...');
        return;
    }

    dispatch({
        type: FETCH_USER_REQUEST
    });

    try {
        const res = await getterFunction(bncApi.getUsers);
        if (res.success) {
            dispatch({ type: FETCH_USER_SUCCESS, payload: res.data });
        }
    } catch (e) {
        dispatch({
            type: FETCH_USER_FAILURE,
            payload: e
        });
    }
}
