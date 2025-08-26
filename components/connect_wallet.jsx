import { Contract } from "ethers";
import { ethers } from "ethers";
import erc20ABIF from "../abi/erc20.json";
import storageContractABIF from "../abi/storage_contract.json";
import teamBussinessContractABIF from "../abi/team_bussiness_contract.json";
import logicContractABIF from "../abi/logic_contract.json";
import historyContractABIF from "../abi/history_contract.json";
import accessContractABIF from "../abi/role_access_control.json";
import payoutCalcContractABIF from "../abi/payout_calc_contract.json";
import royaltyStorageContractABIF from "../abi/royalty_storage_contract.json";

export const connect_wallet = async () => {
  try {
    let [
      signer,
      provider,
      selectedAccount,
      storageContract,
      royaltyStorageContract,
      logicContract,
      payoutContract,
      teamBussinessContract,
      historyContract,
      accessContract,
      stakeTokenContract,
      stakeUSDTContract,
      erc20ABI,
      chainId,
    ] = [null];

    if (window.ethereum === null) {
      localStorage.setItem("connection", "0");
      alert("Please Install Crypto Wallet");
      return;
    }


    let chainIdHex = await window.ethereum.request({
      method: "eth_chainId",
    });

    chainId = parseInt(chainIdHex, 16);

    if (chainId !== 56) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x38",
                chainName: "Binance Smart Chain",
                rpcUrls: ["https://bsc-dataseed.binance.org/"],
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://bscscan.com"],
              },
            ],
          });
        } else {
          console.error("Chain switch failed:", switchError);
          throw switchError;
        }
      }
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
   
      selectedAccount = accounts[0];
      if (!selectedAccount) {
 
        console.log("No ethereum accounts available");
        return;
      }
    
    provider = new ethers.BrowserProvider(window.ethereum);

    signer = await provider.getSigner();

    storageContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_STORAGE_CONTRACT,
      storageContractABIF,
      signer
    );
     royaltyStorageContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ROYALTY_STORAGE_CONTRACT,
      royaltyStorageContractABIF,
      signer
    );
    logicContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_LOGIC_CONTRACT,
      logicContractABIF,
      signer
    );
    payoutContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_PAYOUT_CONTRACT,
      payoutCalcContractABIF,
      signer
    );
    teamBussinessContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_TEAM_BUSSINESS_CONTRACT,
      teamBussinessContractABIF,
      signer
    );
    historyContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_HISTORY_CONTRACT,
      historyContractABIF,
      signer
    );
    accessContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ACCESS_CONTROL_CONTRACT,
      accessContractABIF,
      signer
    );
    stakeTokenContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_TOKEN_CONTRACT,
      erc20ABIF,
      signer
    );
    stakeUSDTContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_USDT_CONTRACT,
      erc20ABIF,
      signer
    );
    localStorage.setItem("connection", "1");

    return {
      signer,
      provider,
      selectedAccount,
      storageContract,
      royaltyStorageContract,
      logicContract,
      payoutContract,
      teamBussinessContract,
      historyContract,
      accessContract,
      stakeTokenContract,
      stakeUSDTContract,
      erc20ABI,
      chainId,
    };
  } catch (error) {
    console.error(error);
  }
};
