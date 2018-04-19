import React, { Component } from 'react';
import './App.css';

import MetamaskDisplay from './components/MetamaskDisplay'
import AddressesDisplay from './components/AddressesDisplay'
import NulandTokenDisplay from './components/NulandToken'

class App extends Component {
  render() {
    return (
      <div>
        <MetamaskDisplay />
        <AddressesDisplay />
        <NulandTokenDisplay />
      </div>
    );
  }
}

export default App;
