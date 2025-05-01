
import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk'

import { userReducer } from './Reducer';

const rootReducer = combineReducers({
  userState: userReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
