import { Web3 } from "web3";
const path = require("path");

let web3;

if (typeof window !== "undefined") {
  // 1. We are in the browser
  if (typeof window.ethereum !== "undefined") {
    console.log("Web3: Using window.ethereum");
    web3 = new Web3(window.ethereum);
  } else if (typeof window.web3 !== "undefined") {
    console.log("Web3: Using window.web3");
    web3 = new Web3(window.web3.currentProvider);
  } else {
    // Browser but no wallet. Use Read-Only RPC.
    console.log("Web3: Using Read-Only Provider (Client)");
    const rpcUrl = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

    if (!rpcUrl) {
      console.error("Web3 Error: NEXT_PUBLIC_SEPOLIA_RPC_URL is missing!");
    }

    const provider = new Web3.providers.HttpProvider(rpcUrl);
    web3 = new Web3(provider);
  }
} else {
  // 2. We are on the server
  // Force load .env from root
  try {
    require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
  } catch (e) { /* ignore */ }

  const rpcUrl = process.env.SEPOLIA_RPC_URL || process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL;

  if (!rpcUrl) {
    console.error("Web3 Server Error: RPC URL is missing!");
  }

  const provider = new Web3.providers.HttpProvider(rpcUrl);
  web3 = new Web3(provider);
}

export default web3;
