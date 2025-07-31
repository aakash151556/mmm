"use client";
import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import Web3Context from "@/components/web3context";
import IncomeName from "@/components/income_name";
import Loader from "@/components/Loader";
import ETC20 from "@/abi/erc20.json";
import Swal from "sweetalert2";
import storageContractABIF from "@/abi/storage_contract.json";

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
    const [currentPrice, setCurrentPrice] = useState(0);
    const [netBVT, setNetBVT] = useState(0);
    const [admincharge, setAdminCharge] = useState(0);
    const [finalBVT, setFinalBVT] = useState(0);




    
      useEffect(() => {
        const fetchPrice = async () => {
          try {
            setLoading(true);
            const resp = await fetch("/api/bvt-price");
            let { price } = await resp.json();
            const currentPrice = await storageContract.GetCurrentPrice();
            const currentPriceInETH = ethers.formatEther(currentPrice);
            if (!price) price = currentPriceInETH;
            if (Number(price) !== Number(currentPriceInETH)) {
              const rpcProvider = new ethers.JsonRpcProvider(
                process.env.NEXT_PUBLIC_BSC_RPC_URL
              );
              const wallet = new ethers.Wallet(
                process.env.NEXT_PUBLIC_PRIVATE_KEY,
                rpcProvider
              );
    
              const sgContract = new ethers.Contract(
                process.env.NEXT_PUBLIC_STORAGE_CONTRACT,
                storageContractABIF,
                wallet
              );
    
              const transactionResponse = await sgContract.SetCurrentPrice(
                process.env.NEXT_PUBLIC_PUBLIC_KEY,
                ethers.parseEther(price + "", 18)
              );
              const reciept = await transactionResponse.wait();
              if (reciept) {
                setLoading(false);
                setCurrentPrice(price);
                console.log("price update successs");
              } else {
                setLoading(false);
                setCurrentPrice(price);
                console.log(reciept);
              }
            } else {
              setLoading(false);
              setCurrentPrice(currentPriceInETH);
              console.log("live rate already updated");
            }
          } catch (err) {
            setLoading(false);
            console.error(err);
            const currentPrice = await storageContract.GetCurrentPrice();
            const currentPriceInETH = ethers.formatEther(currentPrice);
            setCurrentPrice(currentPriceInETH);
          }
        };
        if (!storageContract) return;
        fetchPrice();
      }, [storageContract]);
    
      const fn_CalculateBVT = async (e) => {
        const amount = e.target.value;
        if (amount == "") {
          alert("Enter amount");
          return;
        }
       
       
        if (currentPrice > 0) {
         
            const totalbvt = Number(amount) * Number(currentPrice);
            setNetBVT(totalbvt);
            const ac=Number(totalbvt)*0.1;
            setAdminCharge(ac)
            const fbvt=Number(totalbvt)-Number(ac);
            setFinalBVT(fbvt)
         
        }
      };



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
          });
        }

        setLoading(false);
      } catch (err) {
        setLoading(false);
        Swal.fire({
          title: "Error",
          text: err,
          icon: "error",
          confirmButtonText: "OK",
        });
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
                    <input type="text" onChange={fn_CalculateBVT} className="form-control" id="amount" />
                  </div>
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
                <label>Total BVT:</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  value={netBVT}
                />
              </div>

              <div className="form-group">
                <label>Admin Charge(10%):</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  value={admincharge}
                />
              </div>


               <div className="form-group">
                <label>Final Recieved BVT:</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  value={finalBVT}
                />
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
