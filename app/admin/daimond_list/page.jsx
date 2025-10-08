"use client";
import Web3Context from "@/components/web3context";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const DiamondList = () => {
  const {
    selectedAccount,
    logicContract,
    payoutContract,
    historyContract,
    accessContract,
    storageContract,
    teamBussinessContract,
    stakeTokenContract,
    stakeUSDTContract,
  } = useContext(Web3Context);

  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);

  useEffect(() => {
    if (!historyContract) return;
    const getHistory = async () => {
      const supermanager = await historyContract.GetLBV(
        "0x0a8402C459D44f05e590269f28262cc35307D198",
        0,
        3
      );
      setTotal(supermanager.length)
      setData(supermanager);
    };
    getHistory();
  }, [historyContract]);

  return (
    <>
      <div className="container">
        <div className="card mt-3">
          <div className="card-header bg-primary text-white">
            <h2 className="card-title">Diamond List</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12  table-responsive">
                <table className=" table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th colSpan="3" style={{ textAlign: "center" }}>
                        Total : {total}
                      </th>
                   

                     
                    </tr>

                    <tr>
                      <th>#</th>
                      <th>From</th>                      
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.map((event, key) => (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          <td>{event.from}</td>
                          <td>
                            {new Date(
                              parseInt(event.timestamp) * 1000
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

export default DiamondList;
