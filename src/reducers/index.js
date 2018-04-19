import { combineReducers } from 'redux';

import metamask from './metamask';
import addresses from './addresses';
import nulandToken from './nulandToken';

export default combineReducers({
    metamask,
    addresses,
    nulandToken
})