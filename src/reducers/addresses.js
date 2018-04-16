const initialState = {
  names: [],
  addresses: []
}

export default function addresses(state = initialState, action) {
  if (action.type === 'ADD_ADDR') {
    return {
      names: [...state.names, action.payload.name],
      addresses: [...state.addresses, action.payload.address]
    }
  } else if (action.type === 'RMV_ADDR') {
    state.addresses.splice(action.payload, 1);
    state.names.splice(action.payload, 1);
    return {
      names: [...state.names],
      addresses: [...state.addresses]
    }
  } else if (action.type === 'USE_DEFAULT') {
      return {
        names: [...action.payload.names],
        addresses: [...action.payload.addresses]
      }
  }
  return state; 
}