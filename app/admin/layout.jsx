"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../globals.css";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

import { connect_wallet } from "@/components/connect_wallet";
import { handle_account_change } from "@/components/handle_account_change";
import { handle_chain_change } from "@/components/handle_chain_change";
import { useRouter } from "next/navigation";
import Web3Context from "@/components/web3context";
import Swal from "sweetalert2";

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

  const rounter = useRouter();

  const [storageData, setStorageData] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    signer: null,
    provider: null,
    selectedAccount: null,
    storageContract: null,
    logicContract: null,
    teamBussinessContract: null,
    historyContract: null,
    accessContract: null,
    instanceBonusCalcContract: null,
    stakeTokenContract: null,
    stakeUSDTContract: null,
    erc20ABI: null,
    chainId: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [claim_status, setClaimStatus] = useState("");

  const bindClaimStatus = async () => {
    if (!state.storageContract) return;
    const status = await state.storageContract.GetWithdrawlOnOff();
    if (status === true) {
      setClaimStatus("Claim On");
    } else {
      setClaimStatus("Claim Off");
    }
  };

  useEffect(() => {
    bindClaimStatus();
  }, [state.storageContract]);

  useEffect(() => {
    setSelectedAccount(localStorage.getItem("selectedAccount"));
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const data = localStorage.getItem("connection");
      setStorageData(data);
    }
  }, []);

  const handleWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      const {
        signer,
        provider,
        selectedAccount,
        royaltyStorageContract,
        storageContract,
        logicContract,
        payoutContract,
        teamBussinessContract,
        historyContract,
        accessContract,
        stakeTokenContract,
        stakeUSDTContract,
        erc20ABI,
        chainId,
      } = await connect_wallet();
      if (
        selectedAccount === state.selectedAccount &&
        chainId === state.chainId
      )
        return;
      setState({
        signer,
        provider,
        selectedAccount,
        royaltyStorageContract,
        storageContract,
        logicContract,
        payoutContract,
        teamBussinessContract,
        historyContract,
        accessContract,
        stakeTokenContract,
        stakeUSDTContract,
        erc20ABI,
        chainId,
      });
    } catch (error) {
      console.log(error);
      // navigate("/")
    } finally {
      setIsLoading(false);
    }
  }, [selectedAccount, state.chainId]);

  const handleConnectWallet = async () => {
    handleWallet();
  };

  useEffect(() => {
    handleWallet(localStorage.getItem("selectedAccount"));
  }, []);

  const fn_Search = () => {
    const account = document.querySelector("#txtAccount").value;
    localStorage.setItem("selectedAccount", account);
    window.location.reload();
  };
  const fn_change_claim_status = async () => {
    if (!state.storageContract) return;
    const status = await state.storageContract.GetWithdrawlOnOff();
    let new_status = false;

    if (status === false) {
      new_status = true;
    }
    setLoading(true);

    try {
      const trx = await state.storageContract.SetWithdrawlOnOff(new_status);
      const reciept = await trx.wait();
      if (reciept) {
        Swal.fire({
          title: "Success",
          text: "Withdrawl Status Changed Successfull..!",
          icon: "success",
          confirmButtonText: "OK",
        }).then((result) => {
          bindClaimStatus();
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
  };
  return (
    <html lang="en">
      <body>
        <nav
          className="navbar navbar-expand-lg fixed-top navbar-dark bg-dark"
          aria-label="Main navigation"
        >
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              <img src="/img-1.png" alt="Logo" style={{ width: "111px" }} />
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
              style={{ justifyContent: "space-between" }}
            >
              <div className="withes">
                <div className="row">
                  <div className="col-8">
                    <input
                      id="txtAccount"
                      className="form-control me-2"
                      type="search"
                      placeholder="Search"
                    />
                    <div />

                    <div />
                  </div>

                  <div className="col-4">
                    <button
                      className="btn btn-outline-success"
                      type="button"
                      id="btnSearch"
                      onClick={fn_Search}
                    >
                      Search
                    </button>
                    &nbsp;
                    <button
                      className="btn btn-outline-success"
                      type="button"
                      id="btnSearch"
                      onClick={fn_change_claim_status}
                    >
                      Change
                    </button>
                    &nbsp;
                    {!loading && (
                      <span className="text-white">{claim_status}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-flex text-white whitespace">
                {storageData == "1" ? (
                  "Connected Account : " +
                  (state.selectedAccount &&
                    state.selectedAccount.toString().slice(0, 6) +
                      "..." +
                      state.selectedAccount.toString().slice(-4))
                ) : (
                  <button
                    className="btn btn-outline-success"
                    type="button"
                    onClick={handleConnectWallet}
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
        <div className="nav-scroller bg-body shadow-sm bga">
          <div className="container">
            <nav className="nav" aria-label="Secondary navigation">
              <Link className="nav-link active" href="/admin/dashboard">
                Dashboard
              </Link>
                 <Link className="nav-link active" href="/admin/topup_list">
                Topup List
              </Link>
              <Link className="nav-link active" href="/admin/user_list">
                Super Manager List
              </Link>
              <Link className="nav-link active" href="/admin/daimond_list">
                Diamond List
              </Link>
              <Link className="nav-link" href="/admin/register">
                Register
              </Link>
              <Link className="nav-link" href="/admin/change_rate">
                Change Current Rate
              </Link>
              <Link className="nav-link" href="/admin/block_user">
                Block User
              </Link>
              <Link className="nav-link" href="/admin/unblock_user">
                Unblock User
              </Link>
              <Link className="nav-link" href="/admin/claim_allowance">
                Set Claim Allowance
              </Link>
              <Link className="nav-link" href="/admin/accesscontrol">
                Whitelist Contract Address
              </Link>
            </nav>
          </div>
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
