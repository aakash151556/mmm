"use client";
import Web3Context from "@/components/web3context";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import storageContractABIF from "@/abi/storage_contract.json";
import Loader from "@/components/Loader";

const SMReTopup = () => {
  const {
    selectedAccount,
    logicContract,
    storageContract,
    teamBussinessContract,
    stakeTokenContract,
    stakeUSDTContract,
  } = useContext(Web3Context);

  const [bvt, setBVT] = useState(0);
  const [loading, setLoading] = useState(false);



  const fn_submit = async (e) => {
    e.preventDefault();
    if(bvt<1){
        Swal.fire({
            title: "info!",
            text: "Enter BVT!",
            icon: "info",
            confirmButtonText: "OK",
          });
          return;
    }
  
    try {
     
      setLoading(true);
      const approve_tx = await stakeTokenContract.approve(
        process.env.NEXT_PUBLIC_STORAGE_CONTRACT,
        ethers.parseUnits(bvt + "", 18)
      );
      const approve_reciept = await approve_tx.wait();
      if (approve_reciept) {
        const tx = await logicContract.NormalPackageTopup(ethers.parseUnits(bvt + "", 18));
        const reciept = await tx.wait();
        if (reciept) {
          Swal.fire({
            title: "Success!",
            text: "Successfull..!",
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              setLoading(false);
            }
          });
        } else {
          Swal.fire({
            title: "info!",
            text: "try again!",
            icon: "info",
            confirmButtonText: "OK",
          });
          setLoading(false);
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: approve_reciept,
          icon: "error",
          confirmButtonText: "OK",
        });
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      Swal.fire({
        title: "Error!",
        text: err,
        icon: "error",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Super Manager Re-Topup</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="form-group">
                <label>Enter BVT:</label>
                 <input
                  type="text"
                  className="form-control"
                  onChange={(e)=>setBVT(e.target.value)}
                  value={bvt}
                />
              </div>
            
              
            </div>
          </div>
          <div className="card-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={fn_submit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SMReTopup;
