import React, { Component } from 'react';
import { connect } from 'react-redux';

import './css/NuLandToken.css';
import Web3 from 'web3'
import { tokenContract } from '../constants'

const web3 = new Web3(global.web3.currentProvider);
const contractNLD = new web3.eth.Contract(
  tokenContract.abi,
  tokenContract.address,
  {
    gasPrice: tokenContract.gasPrice
  }
);

const mapStateToProps = (state) => ({
    currentAddress: state.metamask.currentAccount,
    addresses: state.addresses.addresses,
    balancesETH: state.nulandToken.balancesETH,
    balancesNLD: state.nulandToken.balancesNLD,
    allowances: state.nulandToken.allowances
});

const MapDispatchToProps = (dispatch) => ({
    onUpdateBalances: (payload) => {
      dispatch({ type: 'UPD_BALANCE', payload });
    },
    onUpdateBal: (index, balance) => {
      const payload = {
        index: index,
        balance: balance
      }
      dispatch({ type: 'UPD_BAL_ETH', payload });
    },
    onUpdateBalNLD: (index, balance) => {
      const payload = {
        index: index,
        balance: balance
      }
      dispatch({ type: 'UPD_BAL_NLD', payload });
    },
    onUpdateAllowance: (index, allowance) => {
      const payload = {
        index: index,
        allowance: allowance
      }
      dispatch({ type: 'UPD_AllOWANCE', payload });      
    },
    onNewTransaction: (hash) => {
      const payload = {
        hash: hash,
        status: 'pending'
      }
      dispatch({ type: 'ADD_TRAN', payload });
    },
    onConfirmTransaction: (payload) => {
      dispatch({ type: 'UPD_TRAN', payload });
    }
});

const formDefaultValue = {
  to: "to",
  from: "from",
  value: "value in ETH",
  valueNLD: "value in NLD"
}

class NulandToken extends Component {
  constructor(props) {
    super(props);

    // contract functions
    this.updateBalances = this.updateBalances.bind(this);
    this.sendEther = this.sendEther.bind(this);
    this.sendNLD = this.sendNLD.bind(this);
    this.approve = this.approve.bind(this);
    this.increaseApproval = this.increaseApproval.bind(this);
    this.decreaseApproval = this.decreaseApproval.bind(this);
    this.transferFrom = this.transferFrom.bind(this);
    this.transferAll = this.transferAll.bind(this);
    this.transferAllFrom = this.transferAllFrom.bind(this);
    
    // inputs reset functions
    this.clearToETH = this.clearToETH.bind(this);
    this.clearValueETH = this.clearValueETH.bind(this);
    this.clearToNLD = this.clearToNLD.bind(this);
    this.clearValueNLD = this.clearValueNLD.bind(this);
    this.clearFromNLD2 = this.clearFromNLD2.bind(this);
    this.clearToNLD2 = this.clearToNLD2.bind(this);
    this.clearValueNLD2 = this.clearValueNLD2.bind(this);
  }

  updateBalances() {
    // First resize balanceETH and balanceNLD array
    this.props.onUpdateBalances(new Array(this.props.addresses.length).fill(0));

    // Create batch request to fetch balances for addresses array
    var batch = new web3.eth.BatchRequest();
    for (let i = 0; i < this.props.addresses.length; i++) { 
      batch.add(web3.eth.getBalance.request(
        this.props.addresses[i],
        'latest',
        (err, res) => {
          this.props.onUpdateBal(i, res);
        }
      ));
      batch.add(contractNLD.methods.balanceOf(this.props.addresses[i]).call.request(
        {},
        'latest',
        (err, res) => {
          this.props.onUpdateBalNLD(i, res);
        })
      );
      batch.add(contractNLD.methods.allowance(
        this.props.currentAddress,
        this.props.addresses[i]
      ).call.request(
        {},
        'latest',
        (err, res) => {
          this.props.onUpdateAllowance(i, res);
        })
      );
    }
    batch.execute();
    this.buttonUnitETH.innerHTML = 'ether';
    this.buttonUnitNLD.innerHTML = 'NLD';
    this.buttonUnitNLD2.innerHTML = 'NLD';
  }

  choseUnitETH(units) {
    this.buttonUnitETH.innerHTML = units;
    for(let index=0; index<this.props.balancesETH.length; index++) {
      this.balancesUl
      .childNodes[index]
      .childNodes[2]
      .innerHTML = web3.utils.fromWei(this.props.balancesETH[index], units);
    }
  }

  // DropdownN starts from 0 : 0, 1, 2 and so on
  choseUnitNLD(units, dropdownID) {
    let newUnits = 'NLD';
    switch (units) {
      case "wei":
        newUnits = 'aNLD';
        break;
      case "finney":
        newUnits = 'mNLD';
        break;
      default:
    }
    let data_arr = this.props.balancesNLD.slice(0);
    if (dropdownID === 0) {
      this.buttonUnitNLD.innerHTML = newUnits;
    } else if (dropdownID === 1) {
      this.buttonUnitNLD2.innerHTML = newUnits;
      data_arr = this.props.allowances.slice(0);
    }
    for(let index=0; index<data_arr.length; index++) {
      this.balancesUl
      .childNodes[index]
      .childNodes[3 + dropdownID]
      .innerHTML = web3.utils.fromWei(data_arr[index], units);
    }
  }

  sendEther() {
    if(!web3.utils.isAddress(this.toInputETH.value)) {
      console.log('bad address', this.toInputETH.value);
      return;
    }
    web3.eth.defaultAccount = this.props.currentAddress;
    web3.eth.sendTransaction({
      to: this.toInputETH.value,
      value: web3.utils.toWei(this.valueInputETH.value),
      gasPrice: tokenContract.gasPrice
    }).on('transactionHash', (transactionHash) => { this.props.onNewTransaction(transactionHash) })
    .on('receipt', (receipt) => {
      this.props.onConfirmTransaction({
        hash: receipt.transactionHash,
        status: 'accepted',
        from: receipt.from,
        to: receipt.to,
        block: receipt.blockNumber,
        method: 'ether transfer'
      })
    });
    this.toInputETH.value = formDefaultValue.to;
    this.valueInputETH.value = formDefaultValue.value;
  }

  // contract API functions
  sendNLD() {
    // Check the address is correct first
    if(!web3.utils.isAddress(this.toInputNLD.value)) {
      console.log('bad address');
      return;
    }
    // Call transfer method
    contractNLD.methods.transfer(
      this.toInputNLD.value,
      web3.utils.toWei(this.valueInputNLD.value)
    ).send({ from: this.props.currentAddress })
    .on('transactionHash', (transactionHash) => { this.props.onNewTransaction(transactionHash) })
    .on('receipt', (receipt) => {
      this.props.onConfirmTransaction({
        hash: receipt.transactionHash,
        status: 'accepted',
        from: receipt.from,
        to: receipt.to,
        block: receipt.blockNumber,
        method: 'NLD transfer'
      })
    });
    this.toInputNLD.value = formDefaultValue.to;
    this.valueInputNLD.value = formDefaultValue.valueNLD;
  }

  approve() {
    // Check the address is correct first
    if(!web3.utils.isAddress(this.toInputNLD.value)) {
      console.log('bad address: ', this.toInputNLD.value);
      return;
    }
    // Call transfer method
    contractNLD.methods.approve(
      this.toInputNLD.value,
      web3.utils.toWei(this.valueInputNLD.value)
    ).send({ from: this.props.currentAddress })
    .on('transactionHash', (transactionHash) => { this.props.onNewTransaction(transactionHash) })
    .on('receipt', (receipt) => {
      this.props.onConfirmTransaction({
        hash: receipt.transactionHash,
        status: 'accepted',
        from: receipt.from,
        to: receipt.to,
        block: receipt.blockNumber,
        method: 'NLD approve'
      })
    });
    this.toInputNLD.value = formDefaultValue.to;
    this.valueInputNLD.value = formDefaultValue.valueNLD;
  }

  increaseApproval() {
    // Check the address is correct first
    if(!web3.utils.isAddress(this.toInputNLD.value)) {
      console.log('bad address');
      return;
    }
    // Call transfer method
    contractNLD.methods.increaseApproval(
      this.toInputNLD.value,
      web3.utils.toWei(this.valueInputNLD.value)
    ).send({ from: this.props.currentAddress })
    .on('transactionHash', (transactionHash) => { this.props.onNewTransaction(transactionHash) })
    .on('receipt', (receipt) => {
      this.props.onConfirmTransaction({
        hash: receipt.transactionHash,
        status: 'accepted',
        from: receipt.from,
        to: receipt.to,
        block: receipt.blockNumber,
        method: 'increase allowance'
      })
    });
    this.toInputNLD.value = formDefaultValue.to;
    this.valueInputNLD.value = formDefaultValue.valueNLD;
  }

  decreaseApproval() {
    // Check the address is correct first
    if(!web3.utils.isAddress(this.toInputNLD.value)) {
      console.log('bad address');
      return;
    }
    // Call transfer method
    contractNLD.methods.decreaseApproval(
      this.toInputNLD.value,
      web3.utils.toWei(this.valueInputNLD.value)
    ).send({ from: this.props.currentAddress })
    .on('transactionHash', (transactionHash) => { this.props.onNewTransaction(transactionHash) })
    .on('receipt', (receipt) => {
      this.props.onConfirmTransaction({
        hash: receipt.transactionHash,
        status: 'accepted',
        from: receipt.from,
        to: receipt.to,
        block: receipt.blockNumber,
        method: 'decrease allowance'
      })
    });
    this.toInputNLD.value = formDefaultValue.to;
    this.valueInputNLD.value = formDefaultValue.valueNLD;
  }

  transferFrom() {
    // Check the address is correct first
    if(!web3.utils.isAddress(this.fromInputNLD2.value)
        || !web3.utils.isAddress(this.toInputNLD2.value)) {
      console.log('bad address');
      return;
    }
    // Call transfer method
    contractNLD.methods.transferFrom(
      this.fromInputNLD2.value,
      this.toInputNLD2.value,
      web3.utils.toWei(this.valueInputNLD2.value)
    ).send({ from: this.props.currentAddress })
    .on('transactionHash', (transactionHash) => { this.props.onNewTransaction(transactionHash) })
    .on('receipt', (receipt) => {
      this.props.onConfirmTransaction({
        hash: receipt.transactionHash,
        status: 'accepted',
        from: receipt.from,
        to: receipt.to,
        block: receipt.blockNumber,
        method: 'NLD transfer from'
      })
    });
    this.fromInputNLD2.value = formDefaultValue.from;
    this.toInputNLD2.value = formDefaultValue.to;
    this.valueInputNLD2.value = formDefaultValue.valueNLD;
  }

  transferAll() {
    // Check the address is correct first
    if(!web3.utils.isAddress(this.toInputNLD2.value)) {
      console.log('bad address');
      return;
    }
    // Call transfer method
    contractNLD.methods.transferAll(
      this.toInputNLD2.value
    ).send({ from: this.props.currentAddress })
    .on('transactionHash', (transactionHash) => { this.props.onNewTransaction(transactionHash) })
    .on('receipt', (receipt) => {
      this.props.onConfirmTransaction({
        hash: receipt.transactionHash,
        status: 'accepted',
        from: receipt.from,
        to: receipt.to,
        block: receipt.blockNumber,
        method: 'NLD transfer all'
      })
    });
    this.fromInputNLD2.value = formDefaultValue.from;
    this.toInputNLD2.value = formDefaultValue.to;
    this.valueInputNLD2.value = formDefaultValue.valueNLD;
  }

  transferAllFrom() {
    // Check the address is correct first
    if(!web3.utils.isAddress(this.fromInputNLD2.value)
        || !web3.utils.isAddress(this.toInputNLD2.value)) {
      console.log('bad address: ', this.fromInputNLD2.value, this.toInputNLD2.value);
      return;
    }
    // Call transfer method
    contractNLD.methods.transferAllFrom(
      this.fromInputNLD2.value,
      this.toInputNLD2.value
    ).send({ from: this.props.currentAddress })
    .on('transactionHash', (transactionHash) => { this.props.onNewTransaction(transactionHash) })
    .on('receipt', (receipt) => {
      this.props.onConfirmTransaction({
        hash: receipt.transactionHash,
        status: 'accepted',
        from: receipt.from,
        to: receipt.to,
        block: receipt.blockNumber,
        method: 'NLD transfer all from'
      })
    });
    this.fromInputNLD2.value = formDefaultValue.from;
    this.toInputNLD2.value = formDefaultValue.to;
    this.valueInputNLD2.value = formDefaultValue.valueNLD;
  }

  // functions to clear form inputs
  clearToETH() {
    if (this.toInputETH.value === formDefaultValue.to)
      this.toInputETH.value = '';
  }

  clearValueETH() {
    if (this.valueInputETH.value === formDefaultValue.value)
      this.valueInputETH.value = '';
  }

  clearToNLD() {
    if (this.toInputNLD.value === formDefaultValue.to)
      this.toInputNLD.value = '';
  }

  clearValueNLD() {
    if (this.valueInputNLD.value === formDefaultValue.valueNLD)
      this.valueInputNLD.value = '';
  }

  clearFromNLD2() {
    if (this.fromInputNLD2.value === formDefaultValue.from)
      this.fromInputNLD2.value = '';
  }

  clearToNLD2() {
    if (this.toInputNLD2.value === formDefaultValue.to)
      this.toInputNLD2.value = '';
  }

  clearValueNLD2() {
    if (this.valueInputNLD2.value === formDefaultValue.valueNLD)
      this.valueInputNLD2.value = '';
  }

  render() {
    return (
      <div className="NuLandToken">
        <div className="balance">
          <button onClick={this.updateBalances}>Update</button>
          <div className="BalanceHeader">
            ETH Balances
          </div>
          <div className="dropdown">
            <button
              className="dropbtn"
              ref={(button) => { this.buttonUnitETH = button }}
              >ether
              </button>
            <div className="dropdown-content">
              <span onClick={this.choseUnitETH.bind(this,'ether',0)}>ether</span>
              <span onClick={this.choseUnitETH.bind(this,'wei',0)}>wei</span>
              <span onClick={this.choseUnitETH.bind(this,'finney',0)}>finney</span>
            </div>
          </div>
          <div className="BalanceHeaderNLD">
            NLD Balances
          </div>
          <div className="dropdown">
            <button
              className="dropbtn"
              ref={(button) => { this.buttonUnitNLD = button }}
              >NLD
              </button>
            <div className="dropdown-content">
              <span onClick={this.choseUnitNLD.bind(this,'ether',0)}>NLD</span>
              <span onClick={this.choseUnitNLD.bind(this,'wei',0)}>aNLD</span>
              <span onClick={this.choseUnitNLD.bind(this,'finney',0)}>mNLD</span>
            </div>
          </div>
          <div className="BalanceHeaderNLD">
            NLD allowances
          </div>
          <div className="dropdown">
            <button
              className="dropbtn"
              ref={(button) => { this.buttonUnitNLD2 = button }}
              >NLD
              </button>
            <div className="dropdown-content">
              <span onClick={this.choseUnitNLD.bind(this,'ether',1)}>NLD</span>
              <span onClick={this.choseUnitNLD.bind(this,'wei',1)}>aNLD</span>
              <span onClick={this.choseUnitNLD.bind(this,'finney',1)}>mNLD</span>
            </div>
          </div>         
        </div>
        <ul ref={(ul) => { this.balancesUl = ul }}>
          {this.props.addresses.map((address, index) =>
            <li key={index}>
              {index + ": "}
              <span className="address">
                {address ? address.toString().substr(0, 12) + "..." : 'address undefined'}
              </span>
              {this.props.balancesETH[index]
                ? <span className="Balance">
                    {web3.utils.fromWei(this.props.balancesETH[index])}
                  </span>  
                : <span className="Balance">'Undefined'</span>
              }
              {this.props.balancesNLD[index]
                ? <span className="Balance">
                    {web3.utils.fromWei(this.props.balancesNLD[index])}
                  </span>  
                : <span className="Balance">'Undefined'</span>
              }
              {this.props.allowances[index]
                ? <span className="Balance">
                    {web3.utils.fromWei(this.props.allowances[index])}
                  </span>  
                : <span className="Balance">'Undefined'</span>
              }
            </li>
          )}      
        </ul>
        <div className="TransactionForm">
          Send ether
          <input
            type="text"
            defaultValue={formDefaultValue.to}
            onClick={this.clearToETH}
            ref={(input) => { this.toInputETH = input }}
          />
          <input
            type="text"
            defaultValue={formDefaultValue.value}
            onClick={this.clearValueETH}
            ref={(input) => { this.valueInputETH = input }}
          />
          <button onClick={this.sendEther}>Create Tx</button> 
        </div>
        <div className="TransactionForm">
          Token operations:
          <input
            type="text"
            defaultValue={formDefaultValue.to}
            onClick={this.clearToNLD}
            ref={(input) => { this.toInputNLD = input }}
          />
          <input
            type="text"
            defaultValue={formDefaultValue.valueNLD}
            onClick={this.clearValueNLD}
            ref={(input) => { this.valueInputNLD = input }}
          />
          <button onClick={this.sendNLD}>Send</button>
          <button onClick={this.approve}>Approve</button>
          <button onClick={this.increaseApproval}>Inc</button>
          <button onClick={this.decreaseApproval}>Dec</button>
        </div>
        <div className="TransactionForm">
          Special transfer:
          <input
            type="text"
            defaultValue={formDefaultValue.from}
            onClick={this.clearFromNLD2}
            ref={(input) => { this.fromInputNLD2 = input }}
          />
          <input
            type="text"
            defaultValue={formDefaultValue.to}
            onClick={this.clearToNLD2}
            ref={(input) => { this.toInputNLD2 = input }}
          />
          <input
            type="text"
            defaultValue={formDefaultValue.valueNLD}
            onClick={this.clearValueNLD2}
            ref={(input) => { this.valueInputNLD2 = input }}
          />
          <button onClick={this.transferFrom}>From</button>
          <button onClick={this.transferAll}>All</button>
          <button onClick={this.transferAllFrom}>All from</button>
        </div>
      </div>
    );
  }
}

export default connect(
    mapStateToProps,
    MapDispatchToProps
  )(NulandToken);
