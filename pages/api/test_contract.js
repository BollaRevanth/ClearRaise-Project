import factory from "../../smart-contract/factory";
import web3 from "../../smart-contract/web3";

export default async function handler(req, res) {
    try {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        res.status(200).json({ status: "success", campaigns: campaigns, provider: !!web3.currentProvider });
    } catch (err) {
        res.status(500).json({ error: err.message, stack: err.stack, env: process.env.SEPOLIA_RPC_URL ? "Defined" : "Undefined" });
    }
}
