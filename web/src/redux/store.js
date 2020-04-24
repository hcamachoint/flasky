import { createStore, combineReducers } from 'redux'
import profile from './reducers/profile'

const reducer = combineReducers({
  profile
});

const globalState = localStorage.getItem('GLOBAL_STATE');
const initialState = globalState ? JSON.parse(globalState) : undefined;
const store = createStore(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export const saveState = () => {
  const state = store.getState();
  localStorage.setItem('GLOBAL_STATE', JSON.stringify(state));
}

export default store;
