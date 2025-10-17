"use client";

import Web3Context from "@/components/web3context";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import storageContractABIF from "@/abi/storage_contract.json";
import Loader from "@/components/Loader";

const Register = ({ params }) => {
  const { account } = React.use(params);
  const {
    selectedAccount,
    logicContract,
    storageContract,
    teamBussinessContract,
    stakeTokenContract,
    stakeUSDTContract,
  } = useContext(Web3Context);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [netBVT, setNetBVT] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pkgvalue, setPkgValue] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const resp = await fetch("/api/bvt-price");
        let { price } = await resp.json();
        const currentPrice = await logicContract.GetPrice();
        const currentPriceInETH = ethers.formatEther(currentPrice);
        if (!price) price = currentPriceInETH;
        if (Number(currentPriceInETH) !== Number(currentPriceInETH)) {
          // const rpcProvider = new ethers.JsonRpcProvider(
          //   process.env.NEXT_PUBLIC_BSC_RPC_URL
          // );
          // const wallet = new ethers.Wallet(
          //   process.env.NEXT_PUBLIC_PRIVATE_KEY,
          //   rpcProvider
          // );

          // const sgContract = new ethers.Contract(
          //   process.env.NEXT_PUBLIC_STORAGE_CONTRACT,
          //   storageContractABIF,
          //   wallet
          // );

          // const transactionResponse = await sgContract.SetCurrentPrice(
          //   process.env.NEXT_PUBLIC_PUBLIC_KEY,
          //   ethers.parseEther(price + "", 18)
          // );
          // const reciept = await transactionResponse.wait();
          // if (reciept) {
          //   setLoading(false);
          //   setCurrentPrice(price);
          //   console.log("price update successs");
          // } else {
          //   setLoading(false);
          //   setCurrentPrice(price);
          //   console.log(reciept);
          // }
        } else {
          setLoading(false);
          setCurrentPrice(currentPriceInETH);
          console.log("live rate already updated");
        }
      } catch (err) {
        setLoading(false);
        console.error(err);
        const currentPrice = await logicContract.GetPrice();
        const currentPriceInETH = ethers.formatEther(currentPrice);
        setCurrentPrice(currentPriceInETH);
      }
    };
    if (!storageContract) return;
    fetchPrice();
  }, [storageContract]);

  const fn_CalculateBVT = async (e) => {
    const pkgid = e.target.value;
    if (pkgid == "") {
      alert("select package");
      return;
    }
    setPkgValue(pkgid);
    let amount = 0;
    if (pkgid == 0) {
      amount = 54;
    } else if (pkgid == 1) {
      amount = 215;
    } else if (pkgid == 2) {
      amount = 5000;
    } else if (pkgid == 3) {
      amount = 25000;
    } else {
      alert("select package");
      return;
    }
    if (currentPrice > 0) {
      if (pkgid == 0 || pkgid == 1) {
        const totalbvt = Number(amount) / Number(currentPrice);
        setNetBVT(totalbvt);
      } else {
        setNetBVT(amount);
      }
    }
  };
  const fn_submit = async (e) => {
    e.preventDefault();

    if (pkgvalue == "" || pkgvalue == null) {
      alert("select package");
      return;
    }

    try {
      const { _status } = await storageContract.GetUser(account);
      if (!_status) {
        alert("Invalid sponsor");
        return;
      }
      let amount = "0";
      if (pkgvalue == 0) {
        amount = "54";
      } else if (pkgvalue == 1) {
        amount = "215";
      } else if (pkgvalue == 2) {
        amount = "5000";
      } else if (pkgvalue == 3) {
        amount = "25000";
      } else {
        alert("select package");
        return;
      }
      setLoading(true);
      const approve_tx = await stakeTokenContract.approve(
        process.env.NEXT_PUBLIC_STORAGE_CONTRACT,
        ethers.parseUnits(netBVT + "", 18)
      );
      const approve_reciept = await approve_tx.wait();
      if (approve_reciept) {
        const tx = await logicContract.JoinNow(account, pkgvalue);
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
      } else {
        setLoading(false);
        console.log(approve_reciept);
      }
    } catch (err) {
      console.log(err)
      setLoading(false);
      Swal.fire({
        title: "Info!",
        text: "try again",
        icon: "info",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload()
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
            <h2 className="card-title">Register</h2>
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
                  {/* <option value="0">54 USDT (BVT) NORMAL</option> */}
                  <option value="1">215 USDT (BVT) MANAGER</option>
                  <option value="2">5000 BVT SUPER MANAGER</option>
                  <option value="3">25000 BVT DIAMOND</option>
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

export default Register;
