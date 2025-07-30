"use client";
import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import Web3Context from "@/components/web3context";
import IncomeName from "@/components/income_name";
import Loader from "@/components/Loader";
import ETC20 from "@/abi/erc20.json";
import Swal from "sweetalert2";

const Claim = () => {
  const {
    provider,
    selectedAccount,
    logicContract,
    storageContract,
    eventContract,
    historyContract,
    stakeTokenContract,
  } = useContext(Web3Context);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!storageContract && !selectedAccount) return;
    const bindBalance = async () => {
      const total = await storageContract.GetAllIncome(selectedAccount, 0);
      const withdrawl = await storageContract.GetAllIncome(selectedAccount, 1);
      const balance =
        Number(ethers.formatEther(total)) -
        Number(ethers.formatEther(withdrawl));
      setBalance(balance);
    };
    bindBalance();
  }, [selectedAccount, storageContract]);

  const fn_claim_now = async () => {
    const amount = document.querySelector("#amount").value;
    if (amount != "") {
      try {
        setLoading(true);

        // const rpcProvider = new ethers.JsonRpcProvider(
        //   process.env.NEXT_PUBLIC_BSC_RPC_URL
        // );
        // const wallet = new ethers.Wallet(
        //   process.env.NEXT_PUBLIC_PRIVATE_KEY,
        //   rpcProvider
        // );

        // const sgContract = new ethers.Contract(
        //   process.env.NEXT_PUBLIC_TOKEN_CONTRACT,
        //   ETC20,
        //   wallet
        // );

        // const approve_tx = await sgContract.approve(
        //   process.env.NEXT_PUBLIC_STORAGE_CONTRACT,
        //   ethers.parseUnits(amount.toString(), 18)
        // );
        // const approve_reciept = await approve_tx.wait();

          const trx = await logicContract.WithdrawUSDT(
            ethers.parseUnits(amount.toString(), 18)
          );
          const reciept = await trx.wait();
          if (reciept) {
               Swal.fire({
                        title: "Success!",
                        text: "Claim Successfull..!",
                        icon: "success",
                        confirmButtonText: "OK",
                      })
          }
        
        setLoading(false);
      } catch (err) {
        setLoading(false);
          Swal.fire({
                        title: "Error",
                        text: err,
                        icon: "error",
                        confirmButtonText: "OK",
                      })
      }
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container">
          <div className="card mt-3">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title">Claim Direct,Level</h2>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Balance</label>
                    <input
                      type="text"
                      value={balance}
                      className="form-control"
                      readOnly
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label>Enter Amount</label>
                    <input type="text" className="form-control" id="amount" />
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button
                type="button"
                id="btnClaim"
                className="btn btn-primary"
                onClick={fn_claim_now}
              >
                Claim Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Claim;
