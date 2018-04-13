const initialState = {
    web3Enable: false,
    networkID: '',
    accounts: [],
    currentAccount: ''
};

export default function metamask(state = initialState, action) {
    if (action.type === 'CHECK_WEB3') {
        return {
            ...state,
            web3Enable: action.payload
        };
    } else if (action.type === 'ACCOUNT_UPDATE') {
        return {
            ...state,
            currentAccount: action.payload
        };
    } else if (action.type === 'NETWORK_UPDATE') {
        return {
            ...state,
            networkID: action.payload
        };
    }
    return state; 
}