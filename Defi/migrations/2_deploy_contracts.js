var Black = artifacts.require("./Clover");
var dai = artifacts.require("./Dai");
var farm=artifacts.require("./Farm");



module.exports = async function(deployer) {
    var tokenPrice = 1000000000000;  //0.001 ether
    let addr = await web3.eth.getAccounts();
    await deployer.deploy(dai, 10000000000);
  
    await deployer.deploy(Black, 1000000000);
  
    await deployer.deploy(farm, Black.address,dai.address,tokenPrice);
    // let instance = await MyToken.deployed();
   // await instance.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS);


}