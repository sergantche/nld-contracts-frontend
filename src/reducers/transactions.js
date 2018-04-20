const initialState = [];

export default function nulandToken(state = initialState, action) {
    if (action.type === 'ADD_TRAN') {
        return [...state, action.payload];
    } else if (action.type === 'UPD_TRAN') {
        for(var index=0; index<state.length; index++) {
            if( state[index].hash === action.payload.hash ) {
                state[index] = action.payload
            }
        }
        return [...state];
    }
    return state; 
}