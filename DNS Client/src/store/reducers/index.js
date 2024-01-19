import { combineReducers } from 'redux';
import auth from './auth';
import board from './board';

export default combineReducers({  auth, board });
