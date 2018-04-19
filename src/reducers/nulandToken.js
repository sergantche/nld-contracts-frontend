const initialState = {
    balancesETH: [],
    balancesNLD: [],
    allowances: []
};

export default function nulandToken(state = initialState, action) {
    if (action.type === 'UPD_BALANCE') {
        return {
            balancesETH: action.payload.slice(0),
            balancesNLD: action.payload.slice(0),
            allowances: action.payload.slice(0)
        }
    } else if (action.type === 'UPD_BAL_ETH') {
        let new_balance = state.balancesETH;
        new_balance[action.payload.index] = action.payload.balance;
        return {
            ...state,
            balancesETH: [...new_balance]
        }
    } else if (action.type === 'UPD_BAL_NLD') {
        let new_balance = state.balancesNLD;
        new_balance[action.payload.index] = action.payload.balance;
        return {
            ...state,
            balancesNLD: [...new_balance]
        }
    } else if (action.type === 'UPD_AllOWANCE') {
        let new_allowances = state.allowances;
        new_allowances[action.payload.index] = action.payload.allowance;
        return {
            ...state,
            allowances: [...new_allowances]
        }
    }
    return state; 
}