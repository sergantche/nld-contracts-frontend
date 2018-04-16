import React, { Component } from 'react';
import './App.css';

import MetamaskDisplay from './components/MetamaskDisplay'
import AddressesDisplay from './components/AddressesDisplay'

class App extends Component {
  render() {
    return (
      <div>
        <MetamaskDisplay />
        <AddressesDisplay />
      </div>
    );
  }
}

export default App;
