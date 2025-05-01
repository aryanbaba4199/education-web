import { FETCH_USER_FAILURE, FETCH_USER_REQUEST, FETCH_USER_SUCCESS } from "./Action";

const initialState = {
    loading: false,
    users: [],
    error: null,
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_USER_SUCCESS:
            return { ...state, loading: false, users: action.payload, error: null }; // Updated to store users
        case FETCH_USER_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};
