import { combineReducers, createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import loginReducer from './reducers/loginReducers';
import userDataReducer from './reducers/userDataReducer';

const storeReducers = combineReducers({
    login: loginReducer,
    user: userDataReducer
});

const store = createStore(storeReducers, applyMiddleware(logger));

export default store;