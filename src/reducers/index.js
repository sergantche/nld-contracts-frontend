import { combineReducers } from 'redux';

import metamask from './metamask';
import addresses from './addresses';
//import filterTracks from './filterTracks';

export default combineReducers({
    metamask,
    addresses
})