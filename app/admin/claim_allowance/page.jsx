"use client";
import Web3Context from "@/components/web3context";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const ClaimAllowance = () => {
  const {
    selectedAccount,
    logicContract,
    payoutContract,
    accessContract,
    storageContract,
    teamBussinessContract,
    stakeTokenContract,
    stakeUSDTContract,
  } = useContext(Web3Context);
  const [fund_reciever_address, setFundRecieverAddress] = useState(0);
  const [current_allowance, setCurrentAllowance] = useState(0);
  const bindCurrenntAllowance=async()=>{
try{
    const allowance=await stakeTokenContract.allowance(selectedAccount, process.env.NEXT_PUBLIC_STORAGE_CONTRACT)
    setCurrentAllowance(ethers.formatEther(allowance))
}
catch(err){
    console.error(err)
}
  }

  useEffect(()=>{
    if(!stakeTokenContract && !selectedAccount) return;
bindCurrenntAllowance();
  },[stakeTokenContract,selectedAccount])

  useEffect(() => {
    
    setFundRecieverAddress(selectedAccount);
  }, [selectedAccount]);

  const fn_submit = async (e) => {
    e.preventDefault();
    const allowance = document.querySelector("#Allowance");

    if (allowance == "0" || allowance == "") {
      alert("Enter allowance");
      return;
    }

    const fundReciever=await storageContract.GetFundRecieverAddress();
    if(selectedAccount!==fundReciever){
          alert("Invalid fund reciever account");
            return;
    }

    try {
      const approve_tx = await stakeTokenContract.approve(
        process.env.NEXT_PUBLIC_STORAGE_CONTRACT,
        ethers.parseUnits(allowance + "", 18)
      );
      const approve_reciept = await approve_tx.wait();
      if(approve_reciept){
         Swal.fire({
        title: "Success",
        text: "Allowance successfull...!",
        icon: "success",
        confirmButtonText: "OK",
      });
      }
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Set Claim Allowance</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="form-group">
              <label>Fund Reciever Address</label>
              <input
                type="text"
                className="form-control"
                id="FundRecieverAddress"
                value={fund_reciever_address??''}
                readOnly
              />
            </div>
             <div className="form-group">
              <label>Current Allowance</label>
              <input
                type="text"
                className="form-control"
                id="CurrentAllowance"
                value={"BVT "+current_allowance}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Allowance</label>
              <input type="text" placeholder="Enter allowance" className="form-control" id="Allowance" />
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button type="button" className="btn btn-primary" onClick={fn_submit}>
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default ClaimAllowance;
