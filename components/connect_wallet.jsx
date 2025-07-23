import { Contract } from 'ethers'
import { ethers } from 'ethers'
import erc20ABIF from '../abi/erc20.json'
import storageContractABIF from '../abi/storage_contract.json'
import teamBussinessContractABIF from '../abi/team_bussiness_contract.json'
import logicContractABIF from '../abi/logic_contract.json'
import historyContractABIF from '../abi/history_contract.json'
import accessContractABIF from '../abi/role_access_control.json'
import payoutCalcContractABIF from '../abi/payout_calc_contract.json'



export const connect_wallet =async (selectedAccount) => {

  
  try{



    let [signer,provider,storageContract,logicContract,payoutContract,teamBussinessContract,historyContract,accessContract,stakeTokenContract,stakeUSDTContract,erc20ABI,chainId]=[null]
    
    if(window.ethereum===null){
      localStorage.setItem("connection","0")
        alert("Please Install Crypto Wallet")
        return;
    }
    const accounts=await window.ethereum.request({
        method:'eth_requestAccounts'
    })

    let chainIdHex=await window.ethereum.request({
        method:'eth_chainId'
    })
    chainId=parseInt(chainIdHex,16)
    if(chainId!==56)
    {
      localStorage.setItem("connection","0")      
      return;
    }

    if(!selectedAccount){
        selectedAccount=accounts[0]
        if(!selectedAccount){         
          localStorage.setItem("connection","0")
          alert("No ethereum accounts available")  
          return;
        }
        else{
          localStorage.setItem("selectedAccount",selectedAccount)
          localStorage.setItem("connection","1")
        }
    }
    else{
      localStorage.setItem("selectedAccount",selectedAccount)
      localStorage.setItem("connection","1")
    }
    provider=new ethers.BrowserProvider(window.ethereum);
     
    signer=await provider.getSigner()
      
     storageContract=new ethers.Contract(process.env.NEXT_PUBLIC_STORAGE_CONTRACT, storageContractABIF, signer);    
    logicContract=new ethers.Contract(process.env.NEXT_PUBLIC_LOGIC_CONTRACT, logicContractABIF, signer);    
    payoutContract=new ethers.Contract(process.env.NEXT_PUBLIC_PAYOUT_CONTRACT, payoutCalcContractABIF, signer);    
    teamBussinessContract=new ethers.Contract(process.env.NEXT_PUBLIC_TEAM_BUSSINESS_CONTRACT, teamBussinessContractABIF, signer);        
    historyContract=new ethers.Contract(process.env.NEXT_PUBLIC_HISTORY_CONTRACT, historyContractABIF, signer);
    accessContract=new ethers.Contract(process.env.NEXT_PUBLIC_ACCESS_CONTROL_CONTRACT, accessContractABIF, signer);        
    stakeTokenContract=new ethers.Contract(process.env.NEXT_PUBLIC_TOKEN_CONTRACT,erc20ABIF,signer)
    stakeUSDTContract=new ethers.Contract(process.env.NEXT_PUBLIC_USDT_CONTRACT,erc20ABIF,signer)
    localStorage.setItem("connection","1")

    return {signer,provider,selectedAccount,storageContract,logicContract,payoutContract,teamBussinessContract,historyContract,accessContract,stakeTokenContract,stakeUSDTContract,erc20ABI,chainId}

  }
  catch(error){
    console.error(error)
  }
}


