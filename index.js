// Ethers is a library for web3. 
// There are alternatives out there, you can also use.
const { ethers, BigNumber } = require('ethers')

// Load .env file
require('dotenv').config()
const privateKey = process.env.PRIVATE_KEY
// Use 0x... address format.
const toAddress = process.env.TO_ADDRESS

// Define the token you want to send.
// We use WONE, which is the wrapped version of one.
// You can get it on Testnet by wrapping regular one on 
// a exchange using your testnet wallet.
const token = {
    symbol: "WONE",
    address: "0x7466d7d0c21fa05f32f5a0fa27e12bdc06348ce2",
    decimals: 18
}

// Set the transfer amount
const transferAmount = 10

// Specify on which network this will run, by definying the 'provider'.
const provider = new ethers.providers.JsonRpcProvider("https://api.s0.b.hmny.io/", {
    name: "Harmony Testnet",
    chainId: 1666700000
})

// Create Wallet as Signer 
const wallet = new ethers.Wallet(privateKey, provider)

// Create Contract
// Note: HRC20 (Harmony) and ERC20 (Ethereum) are basically similar. 
const hrc20_abi = require("./abi/erc20.json")
const tokenContract = new ethers.Contract(token.address, hrc20_abi, wallet)
const transfer_amount_bn = BigNumber.from(transferAmount)
const weiAmount = transfer_amount_bn.mul(BigNumber.from(10).pow(token.decimals))


// Note: You should check balance ahead to prevent a transaction error
// which provides a better user experience and prevents transation fee.

// Finally we transfer the tokens by calling the transfer 
// method on the token contract.
// Note: If you want to use tokens in a contract you need to approve them 
// first.
tokenContract.transfer(toAddress, weiAmount).then(() => {
    console.log(`Successfully transfered ${transferAmount} (${weiAmount} wei, ${token.decimals} decimals) ${token.symbol} to address:\n${toAddress}`)


    // TODO: I'm not sure why we need to wait until we fetch the token balance.
    // I thought then is called when the transaction was processed by the blockchain.
    setTimeout(() => {
        tokenContract.balanceOf(toAddress).then((result) => {
            console.log(`Balance of ${toAddress}: ${result.div(BigNumber.from(10).pow(token.decimals))} (${result} wei, ${token.decimals} decimals) `)
        }).catch(console.log)
    }, 10000)



}).catch((e) => {
    console.log("Could not transfer funds:" + e)
})