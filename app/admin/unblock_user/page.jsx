"use client";
import Web3Context from "@/components/web3context";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const UnblockUser = () => {
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

  const [fund_reciever_address, setFundRecieverAddress] = useState();

  const fn_submit = async () => {
    if (fund_reciever_address) {
      try {
        const trx = await logicContract.UserBlockUnblock(fund_reciever_address, true);
        const res = await trx.wait();
        if (res) {
          Swal.fire({
            title: "Success",
            text: "User unblocked successfull...!",
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
    }
  };

  return (
    <>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Unblock User</h2>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                className="form-control"
                id="FundRecieverAddress"
                value={fund_reciever_address ?? ""}
                placeholder="Enter Account Address"
                onChange={(e) => setFundRecieverAddress(e.target.value)}
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

export default UnblockUser;
