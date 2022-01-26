import React, { Component } from "react";
import Dai from "./contracts/Dai.json";
import Clover from "./contracts/Clover.json";
import Farm from "./contracts/Farm.json";

import getWeb3 from "./getWeb3";

import './App.css'
import  dai from './dai.png'
import  clvr from './clover.png'
class App extends Component {
  state = { loaded:false,   
      daiTokenBalance: '0',
      cloverBalance: '0',
      stakingBalance: '0',
      account: '0x0',
      address:'0x0'};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
       this.accounts = await this.web3.eth.getAccounts();
       this.setState({ account: this.accounts[0] })
        
      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
   
     this.dai = new this.web3.eth.Contract(
        Dai.abi,
        Dai.networks[this.networkId] && Dai.networks[this.networkId].address,
      );
       let daiTokenBalance = await this.dai.methods.balanceOf(this.state.account).call()
        this.setState({ daiTokenBalance: daiTokenBalance.toString() })
       
        this.clover = new this.web3.eth.Contract(
        Clover.abi,
       Clover.networks[this.networkId] &&  Clover.networks[this.networkId].address,
      );   
      let cloverBalance = await this.clover.methods.balanceOf(this.state.account).call()
    this.setState({ cloverBalance: cloverBalance.toString() })

          this.farm = new this.web3.eth.Contract(
           Farm.abi,
        Farm.networks[this.networkId] &&  Farm.networks[this.networkId].address,
      );
           let stakingBalance = await this.farm.methods.stk(this.state.account).call()
     this.setState({ stakingBalance: stakingBalance.toString(),address:Farm.networks[this.networkId].address })

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
    this.setState({loaded:true});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


stake=async(amount)=>{
  await this.dai.methods.approve(this.state.address, amount).send({ from: this.state.account })
  await this.farm.methods.stake(amount).send({from: this.accounts[0],gas:500000})

}

unstakeTokens=async()=>{ console.log(this.state.stakingBalance);
    await this.farm.methods.unstake().send({from: this.accounts[0]});
}


  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
      
        <h1>Token Farm</h1>
     
        
        <div className="tbl">
         < img src={dai} className="di"/>
          <table  >
          <thead>
            <tr>
              <th >Staking Balance</th>
              <th >Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{this.state.stakingBalance} mDAI</td>
              <td>{this.state.cloverBalance} Clover</td>
            </tr>
          </tbody>
        </table>
         <img src={clvr} className="cl"/>
        </div>
         <div>

        <form onSubmit={(event) => {
                event.preventDefault()
                 let amount
                amount = this.input.value
                  this.stake(amount)
              }}>
        <input type="number" placeholder="amount"  ref={(input) => { this.input = input }}/>
         <button type="submit" className="button-30" >STAKE!</button>
        
</form>
                <button onClick={this.unstakeTokens} className="button-30">
                UN-STAKE...
              </button>
              </div>
      </div>
    );
  }
}

export default App;
