import { combineReducers } from 'redux';

import metamask from './metamask';
import addresses from './addresses';
import nulandToken from './nulandToken';
import transactions from './transactions';

export default combineReducers({
    metamask,
    addresses,
    nulandToken,
    transactions
})