const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "Contracts", "Campaigns.sol");
const source = fs.readFileSync(campaignPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "Campaigns.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach((err) => {
    console.error(err.formattedMessage);
  });
}

fs.ensureDirSync(buildPath);

if (output.contracts && output.contracts["Campaigns.sol"]) {
  for (let contract in output.contracts["Campaigns.sol"]) {
    const contractOutput = output.contracts["Campaigns.sol"][contract];
    fs.outputJSONSync(
      path.resolve(buildPath, contract + ".json"),
      {
        interface: JSON.stringify(contractOutput.abi),
        bytecode: contractOutput.evm.bytecode.object
      }
    );
  }
  console.log("Contracts compiled successfully.");
} else {
  console.log("No contracts found to compile.");
}
