"use client";
import Web3Context from "@/components/web3context";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

const TopupList = () => {
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
  const [account, setAccount] = useState("");
  const [rank, setRank] = useState(0);

  const fn_Get = async () => {
    if (!account) return;
    setData([]);
    const last_topup_id = await storageContract.GetLastTopup(account, rank);

    let r = 1;
    if (rank == 1) {
      while (r <= 4) {
        let i = 1;
        while (i <= parseInt(last_topup_id)) {
          const list = await storageContract.GetTopupDetail(
            account,
            rank,
            i,
            r
          );
          if (list.pkgid == i) {
            setData((prev) => [...prev, list]);
          }
          i++;
        }
        r++;
      }
    } else if (rank == 2) {
      r = 1;
      while (r <= 2) {
        let i = 1;
        while (i <= parseInt(last_topup_id)) {
          const list = await storageContract.GetTopupDetail(
            account,
            rank,
            i,
            r
          );
          if (list.pkgid == i) {
            setData((prev) => [...prev, list]);
          }
          i++;
        }
        r++;
      }
    } else {
      let i = 1;
      while (i <= parseInt(last_topup_id)) {
        const list = await storageContract.GetTopupDetail(account, rank, i, r);
        if (list.pkgid == i) {
          setData((prev) => [...prev, list]);
        }
        i++;
      }
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);
  return (
    <>
      <div className="container">
        <div className="card mt-3">
          <div className="card-header bg-primary text-white">
            <h2 className="card-title">Filter</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <label>Select Rank:</label>
                <select
                  id="ddRank"
                  onChange={(e) => setRank(e.target.value)}
                  value={rank}
                  className="form-control"
                >
                  <option value="0">Normal</option>
                  <option value="1">Manager</option>
                  <option value="2">Super Manager</option>
                  <option value="3">Diamond</option>
                </select>
              </div>
              <div className="col-md-8">
                <label>Enter Address:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Account"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button type="button" onClick={fn_Get} className="btn btn-primary">
              Get Detail
            </button>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-header bg-primary text-white">
            <h2 className="card-title">Topup List</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12  table-responsive">
                <table className=" table table-bordered table-striped">
                  <thead>
                  

                    <tr>
                      <th>#</th>
                      <th>Topup Date</th>
                      <th>Topup USDT</th>                      
                      <th>Price</th>
                      <th>Topup BVT</th>
                      <th>Total Value</th>
                      <th>Upgrade Value</th>
                      <th>Claim Value</th>
                      
                      <th>Round</th>
                      <th>Withdrawl Status</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.map((event, key) => (
                        <tr key={key}>
                          <td>{key + 1}</td>
                          
                          <td>
                            {new Date(
                              parseInt(event.timestamp) * 1000
                            ).toLocaleString()}
                          </td>
                          <td>{ethers.formatEther(event.usdt)}</td>
                          <td>{ethers.formatEther(event.price)}</td>
                          <td>{ethers.formatEther(event.token)}</td>
                          <td>{ethers.formatEther(event.total)}</td>
                          <td>{ethers.formatEther(event.upgrade)}</td>
                          <td>{ethers.formatEther(event.income)}</td>
                          <td>{event.round}</td>
                          <td>
                            {
                                !event.status?"Success":<>Pending || <button className="btn btn-sm btn-danger"  type="button">Stop</button></>
                            }
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

export default TopupList;
