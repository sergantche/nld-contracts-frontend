import React, { Component } from 'react';
import { connect } from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';

import './css/AddressesDisplay.css';
import Web3 from 'web3'
import { myAddresses } from '../constants'

const web3 = new Web3(global.web3.currentProvider);

const mapStateToProps = (state) => ({
    addresses: state.addresses.addresses,
    names: state.addresses.names
});

const MapDispatchToProps = (dispatch) => ({
    onAddAddress: (payload) => {
      dispatch({ type: 'ADD_ADDR', payload });
    },
    onRemoveAddress: (payload) => {
      dispatch({ type: 'RMV_ADDR', payload });
    },
    onUseDefaultAddresses: (payload) => {
      dispatch({ type: 'USE_DEFAULT', payload});
    }
});

const formDefaultValue = {
    name: "address name",
    address: "address"
}

class AddressesDisplay extends Component {
  constructor(props) {
    super(props);
    this.addAddress = this.addAddress.bind(this);
    this.clearAddress = this.clearAddress.bind(this);
    this.clearAddressName = this.clearAddressName.bind(this);
    this.useDefaultAddresses = this.useDefaultAddresses.bind(this);
  }

  addAddress() {
    if(web3.utils.isAddress(this.addrInput.value)) {
        this.props.onAddAddress({
          name: this.addrNameInput.value,
          address: web3.utils.toChecksumAddress(this.addrInput.value)
      });
      this.addrInput.value = formDefaultValue.address;
      this.addrNameInput.value = formDefaultValue.name;
    } else {
      console.log('Not valid address: ', this.addrInput.value);
    }
  }

  removeAddress(index) {
    this.props.onRemoveAddress(index);
  }

  clearAddress() {
    if (this.addrInput.value === formDefaultValue.address)
      this.addrInput.value = '';
  }

  clearAddressName() {
    if (this.addrNameInput.value === formDefaultValue.name)
      this.addrNameInput.value = '';
  }

  // use addresses from constant.js file
  useDefaultAddresses() {
    this.props.onUseDefaultAddresses(myAddresses);
  }

  render() {
    return (
      <div className="AddressesDisplay">
        <button onClick={this.useDefaultAddresses}>My Addresses</button>
        <div>
          <input
            type="text"
            defaultValue={formDefaultValue.name}
            onClick={this.clearAddressName}
            ref={(input) => { this.addrNameInput = input }}
          />
          <input
            type="text"
            defaultValue={formDefaultValue.address}
            onClick={this.clearAddress}
            ref={(input) => { this.addrInput = input }} />
          <button onClick={this.addAddress}>
            Add Address
          </button>
        </div>
        <ul>
          {this.props.addresses.map((address, index) =>
            <li key={index}>
              {index}: {this.props.names[index]}
              <span>{address}</span>
              <CopyToClipboard text={address}>
                <button>Copy</button>
              </CopyToClipboard>
              <button onClick={this.removeAddress.bind(this,index)}>RMV</button>
            </li>
          )}      
        </ul>
      </div>
    );
  }
}

export default connect(
    mapStateToProps,
    MapDispatchToProps
  )(AddressesDisplay);
