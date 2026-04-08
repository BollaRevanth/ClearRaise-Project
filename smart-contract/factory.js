import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xE6F722d8616Eb2f7E40Ce071771c2AcF1A5FFFdD"
);

export default instance;
