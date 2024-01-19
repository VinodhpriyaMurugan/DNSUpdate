
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './store/reducers';

const initialState = {
}

const middleWare = [thunk];

const store = createStore(
    rootReducer,
    // reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleWare))
);

export default store;