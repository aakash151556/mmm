"use client";
import Web3Context from "@/components/web3context";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const ChangeTopupRate = () => {
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
  const [currentRate, SetCurrentRate] = useState(0);
  
  const bindCurrentRate = async () => {
    try {
      const allowance = await logicContract.GetPrice();
      SetCurrentRate(ethers.formatEther(allowance));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!stakeTokenContract && !selectedAccount) return;
    bindCurrentRate();
  }, [stakeTokenContract, selectedAccount]);



  const fn_submit = async (e) => {
    e.preventDefault();
    const allowance = document.querySelector("#Allowance").value;

    if (allowance == "0" || allowance == "") {
      alert("Enter New Rate");
      return;
    }

    

    try {
      const approve_tx = await logicContract.SetPrice(
        
        ethers.parseUnits(allowance + "", 18)
      );
      const approve_reciept = await approve_tx.wait();
      if (approve_reciept) {
        Swal.fire({
          title: "Success",
          text: "new rate updated successfull...!",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result)=>{            
             bindCurrentRate();
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
          <h2 className="card-title">Set Joining Rate</h2>
        </div>
        <div className="card-body">
          <div className="row">
           
            <div className="form-group">
              <label>Current Rate</label>
              <input
                type="text"
                className="form-control"
                id="CurrentAllowance"
                value={"$ " + currentRate}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Enter New Rate</label>
              <input
                type="text"
                placeholder="Enter New Rate"
                className="form-control"
                id="Allowance"
              />
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

export default ChangeTopupRate;
