"use client";
import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import Web3Context from "@/components/web3context";
import IncomeName from "@/components/income_name";

const DirectIncomeHistory = () => {
  const { provider, selectedAccount, eventContract, historyContract } =
    useContext(Web3Context);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [crtotal, setCrTotal] = useState("0");
  const [drtotal, setDrTotal] = useState("0");

  const bind = async () => {
    if (!historyContract) return;
    const ledger = await historyContract.GetReferralBonus(selectedAccount);

    const clonedLedger = [...ledger];
    for (let i = 0; i < clonedLedger.length - 1; i++) {
      for (let j = 0; j < clonedLedger.length - 1 - i; j++) {
        const currentDate = parseInt(clonedLedger[j][3]);
        const nextDate = parseInt(clonedLedger[j + 1][3]);

        if (currentDate < nextDate) {
          const temp = clonedLedger[j];
          clonedLedger[j] = clonedLedger[j + 1];
          clonedLedger[j + 1] = temp;
        }
      }
    }
    setTransactionHistory((prev) => {
      return [...clonedLedger];
    });
  };

  const totalcalc = () => {
    if (!transactionHistory) return;
    let crt = 0;
    let drt = 0;
    transactionHistory &&
      transactionHistory.map((event, keu) => {
        crt = crt + parseFloat(ethers.formatEther(event[1]));
        // drt=drt+parseFloat(ethers.formatEther(event[2]))
      });

    setCrTotal(crt);
    //   setDrTotal(drt)
  };
  useEffect(() => {
    totalcalc();
  }, [transactionHistory]);
  useEffect(() => {
    bind();
  }, [selectedAccount, historyContract]);

  return (
    <>
      <div className="container">
        <div className="card mt-3">
          <div className="card-header bg-primary text-white">
            <h2 className="card-title">Direct Income History</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12  table-responsive">
                <table className=" table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th colSpan="2" style={{ textAlign: "right" }}>
                        Total
                      </th>
                      <td>{crtotal}</td>

                      <td></td>
                    </tr>

                    <tr>
                      <th>#</th>
                      <th>From</th>
                      <th>Income</th>

                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionHistory &&
                      transactionHistory.map((event, key) => (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          <td>{event[0]}</td>
                          <td>{ethers.formatEther(event[1])}</td>

                          <td>
                            {new Date(
                              parseInt(event[3]) * 1000
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DirectIncomeHistory;
