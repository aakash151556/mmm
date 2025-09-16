"use client";

import Web3Context from "@/components/web3context";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import storageContractABIF from "@/abi/storage_contract.json";
import Loader from "@/components/Loader";

const Register = () => {
  const {
    selectedAccount,
    logicContract,
    storageContract,
    teamBussinessContract,
    stakeTokenContract,
    stakeUSDTContract,
  } = useContext(Web3Context);

  const [loading, setLoading] = useState(false);
  const [pkgvalue, setPkgValue] = useState(null);
  const [account, setAccount] = useState("");
  const [sponsorAccount, setSponsorAccount] = useState("");

const handleSponsorChange=async(e)=>{
    const value=e.target.value;
    setSponsorAccount(value)
}

const handleChange=async(e)=>{
    const value=e.target.value;
    setAccount(value)
}
  const fn_CalculateBVT = async (e) => {
    const pkgid = e.target.value;    
    setPkgValue(pkgid);
    
  };

  const fn_submit = async (e) => {
    e.preventDefault();

    if (pkgvalue == "" || pkgvalue == null) {
      alert("select package");
      return;
    }

    try {
      if (sponsorAccount == "") {
        alert("Invalid sponsor");
        return;
      }
       if (account == "") {
        alert("Invalid account");
        return;
      }
      const { _status } = await storageContract.GetUser(sponsorAccount);
      if (!_status) {
        alert("Invalid sponsor");
        return;
      }
    
      setLoading(true);
  
console.log(account,sponsorAccount, pkgvalue)

        const tx = await logicContract.RegisterByAdmin(account,sponsorAccount, pkgvalue);
        const reciept = await tx.wait();
        if (reciept) {
          Swal.fire({
            title: "Success!",
            text: "Registration Successfull..!",
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
          console.log(reciept);
        }
     
    } catch (err) {
      setLoading(false);
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
      {loading ? (
        <Loader />
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Register</h2>
          </div>
          <div className="card-body">
            <div className="row">
               <div className="form-group">
                <label>Enter Account:</label>
                <input
                  type="text"
                  className="form-control"
                    onChange={handleChange}
                  value={account}
                />
              </div>
              <div className="form-group">
                <label>Enter Sponsor Account:</label>
                <input
                  type="text"
                  className="form-control"
                    onChange={handleSponsorChange}
                  value={sponsorAccount}
                />
              </div>

              <div className="form-group">
                <label>Package</label>
                <select
                  className="form-control"
                  id="ddPackage"
                  defaultValue={pkgvalue}
                  onChange={fn_CalculateBVT}
                  name="package"
                >
                  <option value="">Select Package</option>
                  {/* <option value="0">54 USDT (BVT) NORMAL</option> */}
                  <option value="1">215 USDT (BVT) MANAGER</option>
                  <option value="2">5000 BVT SUPER MANAGER</option>
                  <option value="3">25000 BVT DIAMOND</option>
                </select>
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

export default Register;
