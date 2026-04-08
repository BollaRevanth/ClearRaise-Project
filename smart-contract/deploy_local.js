const { Web3 } = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

// Connect to local Ganache instance
const web3 = new Web3('http://localhost:8545');

const deploy = async () => {
    try {
        const accounts = await web3.eth.getAccounts();

        console.log('Attempting to deploy from account', accounts[0]);

        const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
            .deploy({ data: '0x' + compiledFactory.bytecode })
            .send({ from: accounts[0], gas: '3000000', gasPrice: '20000000000' });

        console.log('Contract deployed to', result.options.address);
        const fs = require('fs-extra');
        const path = require('path');
        fs.writeFileSync(path.resolve(__dirname, 'address.txt'), result.options.address);


        // Keep the script running for a moment if needed, or just exit
        process.exit(0);
    } catch (error) {
        console.error('Deployment failed:', error);
        console.error('Error details:', error.message);
        if (error.reason) console.error('Reason:', error.reason);
        if (error.data) console.error('Data:', error.data);
        process.exit(1);
    }
};

deploy();
