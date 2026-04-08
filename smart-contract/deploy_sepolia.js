const HDWalletProvider = require('truffle-hdwallet-provider');
const { Web3 } = require('web3'); // Using v4 syntax
const compiledFactory = require('./build/CampaignFactory.json');
const path = require('path');
const fs = require('fs-extra');

require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const mnemonic = process.env.MNEMONIC;
const rpcUrl = process.env.SEPOLIA_RPC_URL;

if (!mnemonic || !rpcUrl) {
    console.error("Please set MNEMONIC and SEPOLIA_RPC_URL in .env file");
    process.exit(1);
}

const provider = new HDWalletProvider(
    mnemonic,
    rpcUrl
);

const web3 = new Web3(provider);

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();
        console.log('Attempting to deploy from account', accounts[0]);

        const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
            .deploy({ data: '0x' + compiledFactory.bytecode })
            .send({ from: accounts[0], gas: '3000000' }); // Sepolia supports EIP-1559, usually auto-detected, or add gasPrice if needed

        console.log('Contract deployed to', result.options.address);

        // Save address
        fs.writeFileSync(path.resolve(__dirname, 'address_sepolia.txt'), result.options.address);

        process.exit(0);
    } catch (error) {
        console.error('Deployment failed:', error);
        process.exit(1);
    }
};

deploy();
