const defaultState = {};

function reducer(state = defaultState, {type, payload}){
  switch (type) {
    case 'SET_PROFILE':
      return {
        ...state,
        'first_name': payload.first_name,
        'last_name': payload.last_name,
        'username': payload.username,
        'email': payload.email,
      }
    default:
      return state
  }
}

export default reducer;
