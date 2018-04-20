import React, { Component } from 'react';
import { connect } from 'react-redux';

import './css/Transactions.css';
import Web3 from 'web3'
import { tokenContract } from '../constants'

const web3 = new Web3(global.web3.currentProvider);

const mapStateToProps = (state) => ({
    accounts: state.addresses.names,
    addresses: state.addresses.addresses,
    transactions: state.transactions
});

// Sub-component
function TrxDetails(props) {
  if(props.trx.status === 'accepted') {
    let fromAddr = web3.utils.toChecksumAddress(props.trx.from);
    let toAddr = web3.utils.toChecksumAddress(props.trx.to);
    let fromName = (fromAddr.substr(0, 12) + "...");
    let toName = (toAddr.substr(0, 12) + "...");

    for( let index = 0; index < props.addresses.length; index++ ) {
      if( props.addresses[index] === fromAddr)
        fromName = props.accounts[index] + ' ' + index.toString();
      if( props.addresses[index] === toAddr)
        toName = props.accounts[index] + ' ' + index.toString();
    }
    if( web3.utils.toChecksumAddress(tokenContract.address) === toAddr )
      toName = 'token contract';

    return(
      <span className="trx-detail">
        <span>
          {fromName}
        </span>
        <span className="implication-sign">
          =>
        </span>
        <span>
          {toName}
        </span>
        <span className="block-number">
          {props.trx.block}
        </span>
        <span>
          {props.trx.method}
        </span>
      </span>
    );
  }
  return null;
}

// Main component
class TransactionsDisplay extends Component {
  render() {

    return (
      <div className="Transactions">
        Transactions:
        <ul className="transaction-list" ref={(ul) => { this.balancesUl = ul }}>
          {this.props.transactions.map((trx, index) => {
            return (
              <li key={index}>
                {'trx: '}
                <a
                  className="txHash"
                  target="_blank"
                  href={"https://ropsten.etherscan.io/tx/" + trx.hash}
                > {trx.hash.substr(0, 12) + "..."}
                </a>
                <span className="status">
                  {trx.status}
                </span>
                <TrxDetails
                  trx={trx}
                  accounts={this.props.accounts}
                  addresses={this.props.addresses}
                />
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}

export default connect(
  mapStateToProps
)(TransactionsDisplay);
