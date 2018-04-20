import React, { Component } from 'react';
import './App.css';

import MetamaskDisplay from './components/MetamaskDisplay'
import AddressesDisplay from './components/AddressesDisplay'
import NulandTokenDisplay from './components/NulandToken'
import TransactionsDisplay from './components/TransactionsDisplay'
import Footer from './components/Footer'

class App extends Component {
  render() {
    return (
      <div>
        <MetamaskDisplay />
        <AddressesDisplay />
        <NulandTokenDisplay />
        <TransactionsDisplay />
        <Footer />
      </div>
    );
  }
}

export default App;
