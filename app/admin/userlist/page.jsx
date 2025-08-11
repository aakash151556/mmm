"use client";
import Web3Context from "@/components/web3context";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import storageContractABIF from "@/abi/storage_contract.json";
import Loader from "@/components/Loader";

const UserList = () => {
  const {
    selectedAccount,
    logicContract,
    storageContract,
    teamBussinessContract,
    stakeTokenContract,
    stakeUSDTContract,
  } = useContext(Web3Context);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userlist, setUserList] = useState([]);

  const bindTotalUsers=async()=>{
    if(!storageContract) return;
    const users=await storageContract.GetTotalUsers();
    setTotalUsers(users);
    for(let i=totalUsers;i>0;i--){
        
    }
  }
 


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Re-Topup</h2>
          </div>
          <div className="card-body">
            <div className="row">
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
                  <option value="0">54 USDT Normal</option>
                  <option value="1">215 USDT Manager</option>
                  <option value="2">5000 BVT Super Manager</option>
                  <option value="3">25000 BVT Diamond</option>
                </select>
              </div>
              <div className="form-group">
                <label>Current BVT Price:</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  value={currentPrice}
                />
              </div>
              <div className="form-group">
                <label>Net BVT:</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  value={netBVT}
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

export default UserList;
