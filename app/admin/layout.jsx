"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import { useEffect, useState } from "react";
import Link from "next/link";

import { connect_wallet } from "@/components/connect_wallet";
import { handle_account_change } from "@/components/handle_account_change";
import { handle_chain_change } from "@/components/handle_chain_change";
import { useRouter } from "next/navigation";
import Web3Context from "@/components/web3context";

export default function RootLayout({ children }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    (() => {
      "use strict";
      document
        .querySelector("#navbarSideCollapse")
        .addEventListener("click", () => {
          document
            .querySelector(".offcanvas-collapse")
            .classList.toggle("open");
        });
    })();
  }, []);




  
  const rounter=useRouter()

  
  const [storageData, setStorageData] = useState(null);
    const [state,setState]=useState({signer:null,provider:null,selectedAccount:null,storageContract:null,logicContract:null,teamBussinessContract:null,historyContract:null,accessContract:null,instanceBonusCalcContract:null,stakeTokenContract:null,stakeUSDTContract:null,erc20ABI:null,chainId:null})
    const [isLoading,setIsLoading]=useState(false)
    useEffect(() => {
    
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem('connection');
      setStorageData(data);
    }
  }, []);
    const handleWallet=async(selected)=>{

      try{
        setIsLoading(true)
        const {signer,provider,selectedAccount,storageContract,logicContract,payoutContract,teamBussinessContract,historyContract,accessContract,stakeTokenContract,stakeUSDTContract,erc20ABI,chainId}=await connect_wallet(selected);       
        
        setState({signer,provider,selectedAccount,storageContract,logicContract,payoutContract,teamBussinessContract,historyContract,accessContract,stakeTokenContract,stakeUSDTContract,erc20ABI,chainId})             
        
      }
      catch(error){ 
        console.log(error)
       // navigate("/")
      }finally{
        setIsLoading(false)
      }
    }
    useEffect(()=>{
      try{
      window.ethereum.on("accountsChanged",()=>{handle_account_change(setState); 
        localStorage.removeItem("selectedAccount")
        localStorage.setItem("connection","0")
        handleWallet() ;
        })
      window.ethereum.on("chainChanged",()=>{handle_chain_change(setState); 
        localStorage.removeItem("selectedAccount")
        localStorage.setItem("connection","0")
        handleWallet() ;
       })
      return ()=>{
        window.ethereum.removeListener("accountsChanged",()=>handle_account_change(setState))
        window.ethereum.removeListener("chainChanged",()=>handle_chain_change(setState))
      }
    }
    catch(err){
      console.log(err)

    }
    },[])
   const handleConnectWallet=async()=>{  
      handleWallet()            
   }

   useEffect(()=>{
    if(localStorage.getItem("connection")=="1")
      handleWallet(localStorage.getItem("selectedAccount"))
   },[])
   

   const handleLogout=async()=>{
      localStorage.removeItem("selectedAccount")
      localStorage.setItem("connection","0")
      rounter.push("/")
      window.location.reload()
   }

   const previewAccount=async()=>{
        const previewAccount=document.querySelector("#previewAccount").value;
        handleWallet(previewAccount)
       const btnClose=document.querySelector("#btnClose")       
        rounter.push("/Dashboard")
        btnClose.click()
 
   }

const gotodashboard=async()=>{
  rounter.push("/Dashboard")
}





  return (
    <html lang="en">
      <body>
        <nav
          className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark"
          aria-label="Main navigation"
        >
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              Admin
            </a>
            <button
              className="navbar-toggler p-0 border-0"
              type="button"
              id="navbarSideCollapse"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="navbar-collapse offcanvas-collapse"
              id="navbarsExampleDefault"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    About Us
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Contact Us
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Bussiness Plan
                  </a>
                </li>
              </ul>
              <div className="d-flex text-white">
             { storageData=="1"?"Connected Account : "+(state.selectedAccount && state.selectedAccount.toString().slice(0, 6)+"..."+state.selectedAccount.toString().slice(-4)) : <button className="btn btn-outline-success" type="button" onClick={handleConnectWallet}>
                  Connect Wallet
                </button>}
               

              </div>
            </div>
          </div>
        </nav>
        <div className="nav-scroller bg-body shadow-sm">
          <nav className="nav" aria-label="Secondary navigation">
            <Link className="nav-link active" aria-current="page" href="#">
              Dashboard
            </Link>
          
            <Link className="nav-link" href="/retopup">
              Upgrade Package
            </Link>
            <a className="nav-link" href="#">
              My Wallet
            </a>
            <a className="nav-link" href="#">
              Helping Income
            </a>
            <a className="nav-link" href="#">
              Direct Income
            </a>
            <a className="nav-link" href="#">
              Level Income
            </a>
            <a className="nav-link" href="#">
              Direct Team
            </a>
            <a className="nav-link" href="#">
              Downline Team
            </a>
            <a className="nav-link" href="#">
              Level Wise Team
            </a>
            <a className="nav-link" href="#">
              Level Wise Bussiness
            </a>
          </nav>
        </div>
         <Web3Context.Provider value={state}>
            <main className="container p-3">{children}</main>
        </Web3Context.Provider>
        <div className="container">
          <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div className="col-md-4 d-flex align-items-center">
              <a
                href="/"
                className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
                aria-label="Bootstrap"
              >
                <svg
                  className="bi"
                  width="30"
                  height="24"
                  aria-hidden="true"
                ></svg>
              </a>
              <span className="mb-3 mb-md-0 text-body-secondary">
                © 2025 Company, Inc
              </span>
            </div>
            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
              <li className="ms-3">
                <a
                  className="text-body-secondary"
                  href="#"
                  aria-label="Instagram"
                >
                  <svg
                    className="bi"
                    width="24"
                    height="24"
                    aria-hidden="true"
                  ></svg>
                </a>
              </li>
              <li className="ms-3">
                <a
                  className="text-body-secondary"
                  href="#"
                  aria-label="Facebook"
                >
                  <svg className="bi" width="24" height="24"></svg>
                </a>
              </li>
            </ul>
          </footer>
        </div>
      </body>
    </html>
  );
}
