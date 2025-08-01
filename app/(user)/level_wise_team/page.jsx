"use client";
import React, { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import Web3Context from "@/components/web3context";
import IncomeName from "@/components/income_name";
import Link from "next/link";

const LevelWiseTeam = () => {
  const {
    provider,
    selectedAccount,
    storageContract,
    eventContract,
    historyContract,
  } = useContext(Web3Context);

  const [levelTeam, setLevelTeam] = useState([]);

  const bind = async () => {
    if (!storageContract && !selectedAccount) return;
    setLevelTeam([]);
    for (let lvl = 1; lvl <= 15; lvl++) {
      const team = await storageContract.GetLevelWiseTeamCount(
        selectedAccount,
        lvl
      );
      const bonusArray = await historyContract.GetLevelBonus(
        selectedAccount,
        lvl
      );
      const bonus = bonusArray.reduce((accumulator, currentValue) => {
        return accumulator + Number(ethers.formatEther(currentValue[1]));
      }, 0);
      setLevelTeam((prev) => [...prev, { lvl, team, bonus }]);
    }
  };

  useEffect(() => {
    bind();
  }, [selectedAccount, storageContract]);

  return (
    <>
      <div className="container">
        <div className="card mt-3">
          <div className="card-header bg-primary text-white">
            <h4 className="card-title">Level Wise Team</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-12  table-responsive">
                <table className=" table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Team</th>
                      <th>Income</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelTeam &&
                      levelTeam.map((event, key) => (
                        <tr key={key}>
                          <td>{event.lvl}</td>
                          <td>{event.team}</td>
                          <td>{event.bonus}</td>
                          <td>
                            <Link href={`/level_wise_income/${event.lvl}`}>
                              View Income
                            </Link>
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

export default LevelWiseTeam;
