import React, { Component } from 'react';
import { connect } from 'react-redux';

import './css/MetamaskDisplay.css';
import Web3 from 'web3'

const web3 = new Web3(global.web3.currentProvider);

const mapStateToProps = (state) => ({
  web3Enable: state.metamask.web3Enable,
  networkID: state.metamask.networkID,
  currentAccount: state.metamask.currentAccount,
  accounts: state.metamask.accounts
});

const MapDispatchToProps = (dispatch) => ({
  checkWeb3: (payload) => {
    dispatch({ type: 'CHECK_WEB3', payload });
  },
  accountUpdate: (payload) => {
    dispatch({ type: 'ACCOUNT_UPDATE', payload });
  },
  networkUpdate: (payload) => {
    dispatch({ type: 'NETWORK_UPDATE', payload });
  }
});

class MetamaskDisplay extends Component {
  constructor(props) {
    super(props);
    this.checkWeb3Status = this.checkWeb3Status.bind(this);
    this.getCurrentAccount = this.getCurrentAccount.bind(this);
    this.getNetwork = this.getNetwork.bind(this);
  }

  componentDidMount() {
    this.checkWeb3Status();
  }

  checkWeb3Status() {
    if (typeof global.web3 !== 'undefined') {
      this.props.checkWeb3(true);
    } else {
      this.props.checkWeb3(false);
    }
  }

  getCurrentAccount() {
    if (!this.props.web3Enable) {
      console.log('web3 obect not defined');
      return;
    }
    // Get the current account from metamask
    web3.eth.getAccounts().then( (accounts) => {
      if (accounts[0] !== this.props.currentAccount)
        this.props.accountUpdate(accounts[0]);
    });
  }

  getNetwork() {
    if (!this.props.web3Enable) {
      console.log('web3 obect not defined');
      return;
    }

    // Get the network
    web3.eth.net.getId( (err,res) => {
      this.props.networkUpdate(res);
    });
  }
  

  
  render() {
    var network_description = '';
    if (this.props.networkID) {
      switch (this.props.networkID.toString()) {
        case "1":
          network_description = 'This is mainnet';
          break;
        case "2":
          network_description = 'This is the deprecated Morden test network';
          break;
        case "3":
          network_description = 'This is the ropsten test network';
          break;
        case "4":
          network_description = 'This is the Rinkeby test network';
          break;
        case "42":
          network_description = 'This is the Kovan test network';
          break;
        default:
          network_description = 'This is an unknown network';
      }
    }

    return (
    <div className="MetamaskDisplay">
      <div>
        <button onClick={this.checkWeb3Status}>
          Check Web3
        </button>
        Metamask status:
        {this.props.web3Enable.toString()}
      </div>
      <div>
        <button onClick={this.getCurrentAccount}>
          Get Account
        </button>
        Account:
        {this.props.currentAccount}
      </div>
      <div>
        Network ID:
        { this.props.networkID }
        <br/>
        <button onClick={this.getNetwork}>
          Get Network
        </button>
        Description:
        { network_description }
      </div>
    </div>
    );
  }
}

export default connect(
  mapStateToProps,
  MapDispatchToProps
)(MetamaskDisplay);
