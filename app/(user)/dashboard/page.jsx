"use client";

import Web3Context from "@/components/web3context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { ethers } from "ethers";
import React, { useEffect, useState, useContext } from "react";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const Dashboard = () => {
  const {
    selectedAccount,
    logicContract,
    storageContract,
    teamBussinessContract,
    stakeTokenContract,
    stakeUSDTContract,
  } = useContext(Web3Context);
  const [refLink, setRefLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [refStatus, setRefStatus] = useState(false);
  const [user, setUser] = useState({
    _sno: 0,
    _userAddress: 0,
    _sponsorAddress: 0,
    _sp: 0,
    _actts: 0,
    _entts: 0,
    _status: 0,
    _entryby: 0,
    _rt: 0,
  });
  const [directIncome, setDirectIncome] = useState(0);
  const [levelIncome, setLevelIncome] = useState(0);
  const [royaltyIncome, setRoyaltyIncome] = useState(0);
  const [normalIncome, setNormalIncome] = useState(0);
  const [managerIncome, setManagerIncome] = useState(0);
  const [superManagerIncome, setSuperManagerIncome] = useState(0);
  const [diamondManagerIncome, setDiamondManagerIncome] = useState(0);
  const [team, setTeam] = useState(0);
  const [direct, setDirect] = useState(0);
  const [managerDirect, setManagerDirect] = useState(0);
  const [manager10Direct, setManager10Direct] = useState(0);
  const [managerTeam, setManagerTeam] = useState(0);
  const [superManagerDirect, setSuperManagerDirect] = useState(0);
  const [superManagerTeam, setSuperManagerTeam] = useState(0);
  const [diamondDirect, setDiamondDirect] = useState(0);
  const [diamondTeam, setDiamondTeam] = useState(0);
  const [bussiness, setBussiness] = useState({
    normal: { self: 0, direct: 0, team: 0 },
    manager: { self: 0, direct: 0, team: 0 },
    s_manager: { self: 0, direct: 0, team: 0 },
    diamond: { self: 0, direct: 0, team: 0 },
  });
  const [rankName, setRankName] = useState("Member");

  const [normalInvestment, setNormalInvestment] = useState([]);
  const [managerInvestment, setManagerInvestment] = useState([]);
  const [superManagerInvestment, setSuperManagerInvestment] = useState([]);
  const [diamondInvestment, setDiamondInvestment] = useState([]);
  const [loadingNormalPkgId, setLoadingNormalPkgId] = useState(null);
  const [loadingManagerPkgId, setLoadingManagerPkgId] = useState(null);
  const [loadingRound, setLoadingRound] = useState(null);
  const fn_HandleChange = () => {};
  const fn_CopyRefLink = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      Swal.fire({
        title: "Success!",
        text: refLink,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  useEffect(() => {
    setRefLink(
      window.location.protocol +
        "//" +
        window.location.host +
        "/register/" +
        selectedAccount
    );
  }, [selectedAccount]);

  const fetchInvestmentData = async (account) => {
    if (!storageContract || !account) return;
    try {
      const ranks = ["normal", "manager", "s_manager", "diamond"];
      const setInvestmentsMap = {
        0: setNormalInvestment,
        1: setManagerInvestment,
        2: setSuperManagerInvestment,
        3: setDiamondInvestment,
      };

      const obj = {
        normal: { self: 0, direct: 0, team: 0 },
        manager: { self: 0, direct: 0, team: 0 },
        s_manager: { self: 0, direct: 0, team: 0 },
        diamond: { self: 0, direct: 0, team: 0 },
      };

      const allInvestments = {
        0: [],
        1: [],
        2: [],
        3: [],
      };

      for (let i = 0; i <= 3; i++) {
        const [directBusiness, teamBusiness] = await Promise.all([
          storageContract?.GetBussinessTotal(selectedAccount, i, i, 0),
          storageContract?.GetBussinessTotal(selectedAccount, i, i, 1),
        ]);

        const rankKey = ranks[i];
        if (rankKey) {
          obj[rankKey].direct += Number(ethers.formatEther(directBusiness));
          obj[rankKey].team += Number(ethers.formatEther(teamBusiness));
        }

        const lastTopUp = await storageContract?.GetLastTopup(
          selectedAccount,
          i
        );
        const topUpCount = parseInt(lastTopUp);

        for (let k = 0; k <= topUpCount; k++) {
          for (let r = 1; r <= 4; r++) {
            const detail = await storageContract?.GetTopupDetail(
              selectedAccount,
              i,
              k,
              r
            );

            const {
              pkgid,
              usdt,
              price,
              token,
              total,
              upgrade,
              income,
              round,
              status,
              timestamp,
            } = detail;

            const usdtVal = Number(ethers.formatEther(usdt));
            const shouldPush = i === 0 || i === 1 ? usdt > 0 : token > 0;

            if (shouldPush) {
              obj[rankKey].self += usdtVal;

              allInvestments[i].push({
                pkgid,
                usdt,
                price,
                token,
                total,
                upgrade,
                income,
                round,
                status,
                timestamp,
              });
            }
          }
        }
      }

      setNormalInvestment(allInvestments[0]);
      setManagerInvestment(allInvestments[1]);
      setSuperManagerInvestment(allInvestments[2]);
      setDiamondInvestment(allInvestments[3]);

      setBussiness(obj);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchDashboardData = async () => {
    if (!selectedAccount || !storageContract) return;

    try {
      debugger;
      const [
        userData,
        directIncome,
        levelIncome,
        normalIncome,
        managerIncome,
        superManagerIncome,
        diamondManagerIncome,
        teamCount,
        sponsorCount,
        manager10Count,
        mgrTeam,
        smgrTeam,
        dgrTeam,
        mgrDirect,
        smgrDirect,
        dgrDirect,
      ] = await Promise.all([
        storageContract.GetUser(selectedAccount),
        storageContract.GetAllIncome(selectedAccount, 3),
        storageContract.GetAllIncome(selectedAccount, 4),
        storageContract.GetAllIncome(selectedAccount, 5),
        storageContract.GetAllIncome(selectedAccount, 6),
        storageContract.GetAllIncome(selectedAccount, 7),
        storageContract.GetAllIncome(selectedAccount, 8),
        storageContract.GetTeamCount(selectedAccount),
        storageContract.GetSponsorsCount(selectedAccount),
        storageContract.GetManagerDirectCount(selectedAccount),
        storageContract.GetRankWiseTeamCount(selectedAccount, 1),
        storageContract.GetRankWiseTeamCount(selectedAccount, 2),
        storageContract.GetRankWiseTeamCount(selectedAccount, 3),
        storageContract.GetRankSponsorsCount(selectedAccount, 1),
        storageContract.GetRankSponsorsCount(selectedAccount, 2),
        storageContract.GetRankSponsorsCount(selectedAccount, 3),
      ]);

      setUser(userData);
      setDirectIncome(ethers.formatEther(directIncome));
      setLevelIncome(ethers.formatEther(levelIncome));
      setNormalIncome(ethers.formatEther(normalIncome));
      setManagerIncome(ethers.formatEther(managerIncome));
      setSuperManagerIncome(ethers.formatEther(superManagerIncome));
      setDiamondManagerIncome(ethers.formatEther(diamondManagerIncome));
      setTeam(teamCount);
      setDirect(sponsorCount);
      setManager10Direct(manager10Count);
      setManagerTeam(mgrTeam);
      setSuperManagerTeam(smgrTeam);
      setDiamondTeam(dgrTeam);
      setManagerDirect(mgrDirect);
      setSuperManagerDirect(smgrDirect);
      setDiamondDirect(dgrDirect);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    const bind = async () => {
      if (!selectedAccount || !storageContract) return;

      // const {
      //   _sno,
      //   _userAddress,
      //   _sponsorAddress,
      //   _sp,
      //   _actts,
      //   _entts,
      //   _status,
      //   _entryby,
      //   _rt,
      // } = await storageContract?.GetUser(selectedAccount);

      // setUser({
      //   _sno,
      //   _userAddress,
      //   _sponsorAddress,
      //   _sp,
      //   _actts,
      //   _entts,
      //   _status,
      //   _entryby,
      //   _rt,
      // });

      // const di = await storageContract?.GetAllIncome(selectedAccount, 3);
      // setDirectIncome(ethers.formatEther(di));

      // const li = await storageContract?.GetAllIncome(selectedAccount, 4);
      // setLevelIncome(ethers.formatEther(li));

      // const ni = await storageContract?.GetAllIncome(selectedAccount, 5);
      // setNormalIncome(ethers.formatEther(ni));

      // const mi = await storageContract?.GetAllIncome(selectedAccount, 6);
      // setManagerIncome(ethers.formatEther(mi));

      // const smi = await storageContract?.GetAllIncome(selectedAccount, 7);
      // setSuperManagerIncome(ethers.formatEther(smi));

      // const dmi = await storageContract?.GetAllIncome(selectedAccount, 8);
      // setDiamondManagerIncome(ethers.formatEther(dmi));

      // const t = await storageContract?.GetTeamCount(selectedAccount);
      // setTeam(t);

      // const s = await storageContract?.GetSponsorsCount(selectedAccount);
      // setDirect(s);

      // const mdt = await storageContract?.GetManagerDirectCount(selectedAccount);
      // setManager10Direct(mdt);

      // const mgrt = await storageContract?.GetRankWiseTeamCount(
      //   selectedAccount,
      //   1
      // );
      // setManagerTeam(mgrt);

      // const smgrt = await storageContract?.GetRankWiseTeamCount(
      //   selectedAccount,
      //   2
      // );
      // setSuperManagerTeam(smgrt);

      // const dgrt = await storageContract?.GetRankWiseTeamCount(
      //   selectedAccount,
      //   3
      // );
      // setDiamondTeam(dgrt);

      // const md = await storageContract?.GetRankSponsorsCount(
      //   selectedAccount,
      //   1
      // );
      // setManagerDirect(md);

      // const sd = await storageContract?.GetRankSponsorsCount(
      //   selectedAccount,
      //   2
      // );
      // setSuperManagerDirect(sd);

      // const dd = await storageContract?.GetRankSponsorsCount(
      //   selectedAccount,
      //   3
      // );
      // setDiamondDirect(dd);
      //self bussiness

      // let obj = {
      //   normal: { self: 0, direct: 0, team: 0 },
      //   manager: { self: 0, direct: 0, team: 0 },
      //   s_manager: { self: 0, direct: 0, team: 0 },
      //   diamond: { self: 0, direct: 0, team: 0 },
      // };

      // let i = 0;
      // let p = 3;
      // while (i <= p) {
      //   const member_direct_bussiness =
      //     await storageContract?.GetBussinessTotal(selectedAccount, i, 0, 0);
      //   const manager_direct_bussiness =
      //     await storageContract?.GetBussinessTotal(selectedAccount, i, 1, 0);
      //   const super_manager_direct_bussiness =
      //     await storageContract?.GetBussinessTotal(selectedAccount, i, 2, 0);
      //   const diamond_direct_bussiness =
      //     await storageContract?.GetBussinessTotal(selectedAccount, i, 3, 0);

      //   const member_team_bussiness = await storageContract?.GetBussinessTotal(
      //     selectedAccount,
      //     i,
      //     0,
      //     1
      //   );
      //   const manager_team_bussiness = await storageContract?.GetBussinessTotal(
      //     selectedAccount,
      //     i,
      //     1,
      //     1
      //   );
      //   const super_manager_team_bussiness =
      //     await storageContract?.GetBussinessTotal(selectedAccount, i, 2, 1);
      //   const diamond_team_bussiness = await storageContract?.GetBussinessTotal(
      //     selectedAccount,
      //     i,
      //     3,
      //     1
      //   );

      //   if (i == 0) {
      //     obj.normal.direct =
      //       Number(obj.normal.direct) +
      //       Number(ethers.formatEther(member_direct_bussiness));

      //     obj.normal.team =
      //       Number(obj.normal.team) +
      //       Number(ethers.formatEther(member_team_bussiness));
      //   } else if (i == 1) {
      //     obj.manager.direct =
      //       Number(obj.manager.direct) +
      //       Number(ethers.formatEther(manager_direct_bussiness));
      //     obj.manager.team =
      //       Number(obj.manager.team) +
      //       Number(ethers.formatEther(manager_team_bussiness));
      //   } else if (i == 2) {
      //     obj.s_manager.direct =
      //       Number(obj.s_manager.direct) +
      //       Number(ethers.formatEther(super_manager_direct_bussiness));
      //     obj.s_manager.team =
      //       Number(obj.s_manager.team) +
      //       Number(ethers.formatEther(super_manager_team_bussiness));
      //   } else if (i == 3) {
      //     obj.diamond.direct =
      //       Number(obj.diamond.direct) +
      //       Number(ethers.formatEther(diamond_direct_bussiness));
      //     obj.diamond.team =
      //       Number(obj.diamond.team) +
      //       Number(ethers.formatEther(diamond_team_bussiness));
      //   }

      //   const lasttopup = await storageContract?.GetLastTopup(
      //     selectedAccount,
      //     i
      //   );
      //   const kp = parseInt(lasttopup);
      //   let k = 0;
      //   while (k <= kp) {
      //     const {
      //       userAddress,
      //       pkgid,
      //       usdt,
      //       price,
      //       token,
      //       total,
      //       upgrade,
      //       income,
      //       round,
      //       status,
      //       timestamp,
      //     } = await storageContract?.GetTopupDetail(selectedAccount, i, k, 1);
      //     console.log(
      //       userAddress,
      //       pkgid,
      //       usdt,
      //       price,
      //       token,
      //       total,
      //       upgrade,
      //       income,
      //       round,
      //       status,
      //       timestamp
      //     );
      //     if (i == 0 && usdt > 0) {
      //       obj.normal.self =
      //         Number(obj.normal.self) + Number(ethers.formatEther(usdt));
      //       setNormalInvestment([]);

      //       setNormalInvestment((prev) => [
      //         ...prev,
      //         {
      //           pkgid,
      //           usdt,
      //           price,
      //           token,
      //           total,
      //           upgrade,
      //           income,
      //           round,
      //           status,
      //           timestamp,
      //         },
      //       ]);
      //     } else if (i == 1 && usdt > 0) {
      //       obj.manager.self =
      //         Number(obj.manager.self) + Number(ethers.formatEther(usdt));
      //       setManagerInvestment([]);
      //       setManagerInvestment((prev) => [
      //         ...prev,
      //         {
      //           pkgid,
      //           usdt,
      //           price,
      //           token,
      //           total,
      //           upgrade,
      //           income,
      //           round,
      //           status,
      //           timestamp,
      //         },
      //       ]);
      //     } else if (i == 2 && token > 0) {
      //       obj.s_manager.self =
      //         Number(obj.s_manager.self) + Number(ethers.formatEther(usdt));
      //       setSuperManagerInvestment([]);
      //       setSuperManagerInvestment((prev) => [
      //         ...prev,
      //         {
      //           pkgid,
      //           usdt,
      //           price,
      //           token,
      //           total,
      //           upgrade,
      //           income,
      //           round,
      //           status,
      //           timestamp,
      //         },
      //       ]);
      //     } else if (i == 3 && token > 0) {
      //       obj.diamond.self =
      //         Number(obj.diamond.self) + Number(ethers.formatEther(usdt));
      //       setDiamondInvestment([]);
      //       setDiamondInvestment((prev) => [
      //         ...prev,
      //         {
      //           pkgid,
      //           usdt,
      //           price,
      //           token,
      //           total,
      //           upgrade,
      //           income,
      //           round,
      //           status,
      //           timestamp,
      //         },
      //       ]);
      //     }
      //     k++;
      //   }
      //   i++;
      // }

      // setBussiness(obj);
      await fetchDashboardData();
      await fetchInvestmentData(selectedAccount);
    };
    bind();
  }, [selectedAccount, storageContract]);

  useEffect(() => {
    // if (user._rt == 0) setRankName("Member");
    // else if (user._rt == 1) setRankName("Manager");
    // else if (user._rt == 2) setRankName("Super Manager");
    // else if (user._rt == 3) setRankName("Diamond");

    const rankNames = ["Member", "Manager", "Super Manager", "Diamond"];
    setRankName(rankNames[user._rt] || "Unknown");
    if (user._rt != 0) setRefStatus(true);
    else setRefStatus(false);
  }, [user]);

  const fn_ClaimNormalInvestment = async (pkgid) => {
    setLoadingNormalPkgId(pkgid);
    try {
      const res = await logicContract.ClaimStakePayout(0, pkgid, 1);
      if (res) {
        Swal.fire({
          title: "Success!",
          text: "Normal Investment Claim Successfull..!",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingNormalPkgId(null);
      fetchInvestmentData();
    }
  };
  const fn_ClaimManagerInvestment = async (pkgid, round) => {
    setLoadingManagerPkgId(pkgid);
    setLoadingRound(round);
    try {
      const res = await logicContract.ClaimStakePayout(1, pkgid, round + 1);
       if (res) {
        Swal.fire({
          title: "Success!",
          text: "Manager Investment Claim Successfull..!",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingManagerPkgId(null);
      setLoadingRound(null);
      fetchInvestmentData();
    }
  };
  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <div className="bg-body rounded shadow-sm">
            <div className="card mt-2">
              <div className="useraccount">
                <h5 className="card-title cardtext"> User Account</h5>
              </div>
              <div className="card-body">
                <p className="card-text">
                  <b>Your Account :</b> <span>{selectedAccount}</span>
                </p>
                <p className="card-text">
                  <b>Your Rank :</b> <span>{rankName}</span>
                </p>
                <p className="card-text">
                  <b> Sponsor Account :</b> <span>{user._sponsorAddress}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          {refStatus && (
            <div className="bg-body rounded shadow-sm">
              <div className="card mt-2">
                <div className="useraccount">
                  <h5 className="card-title cardtext"> Referral Link </h5>
                </div>
                <img src="/Referral.png" alt="Logo" />
                <div className="input-group">
                  <input
                    type="text"
                    name="refLink"
                    onChange={fn_HandleChange}
                    className="form-control"
                    readOnly
                    value={refLink}
                  />

                  <button
                    type="button"
                    onClick={fn_CopyRefLink}
                    className="input-group-text"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <hr />

      <div className="my-3  bg-body rounded shadow-sm">
        <div className="bhas">
          <h4>User Dashboard</h4>
        </div>
        <div className="row mt-2">
          <div className="col-md-12">
            <div className="padings">
              <div className="row">
                <div className="col-md-3">
                  <div className="card mt-1 mb-3 box-1 zoom-effect">
                    <div className="card-body">
                      <div className="d-flex more_flex">
                        <div>
                          <h2>${directIncome}</h2>
                          <p>Direct Income</p>
                        </div>
                        <div className="icons">
                          <FontAwesomeIcon icon={faWallet} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card mt-1 mb-3 box-2 zoom-effect">
                    <div className="card-body">
                      <div className="d-flex more_flex">
                        <div>
                          <h2>${levelIncome}</h2>
                          <p>Level Income</p>
                        </div>

                        <div className="icons">
                          <FontAwesomeIcon icon={faWallet} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card mt-1 mb-3  box-3 zoom-effect">
                    <div className="card-body">
                      <div className="d-flex more_flex">
                        <div>
                          <h2>${royaltyIncome}</h2>
                          <p>Royalty Income</p>
                        </div>

                        <div className="icons">
                          <FontAwesomeIcon icon={faWallet} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card mt-1 mb-3  box-4 zoom-effect">
                    <div className="card-body">
                      <div className="d-flex more_flex">
                        <div>
                          <h2>{direct}</h2>
                          <p>Direct Team</p>
                        </div>

                        <div className="icons">
                          <FontAwesomeIcon icon={faUsers} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card mt-1 mb-3  box-4 zoom-effect">
                    <div className="card-body">
                      <div className="d-flex more_flex">
                        <div>
                          <h2>{team}</h2>
                          <p>All Team</p>
                        </div>
                        <div className="icons">
                          <FontAwesomeIcon icon={faUsers} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card mt-1 mb-3  box-5 zoom-effect">
                    <div className="card-body">
                      <div className="d-flex more_flex">
                        <div>
                          <h2>{manager10Direct}</h2>
                          <p>10 Direct Manager In Direct</p>
                        </div>
                        <div className="icons">
                          <FontAwesomeIcon icon={faUserTie} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card mt-1 mb-3  box-5 zoom-effect">
                    <div className="card-body">
                      <div className="d-flex more_flex">
                        <div>
                          <h2>{managerDirect}</h2>
                          <p>Manager In Direct</p>
                        </div>
                        <div className="icons">
                          <FontAwesomeIcon icon={faUserTie} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card mt-1 mb-3  box-7 zoom-effect">
                    <div className="card-body">
                      <div className="d-flex more_flex">
                        <div>
                          <h2>{managerTeam}</h2>
                          <p>Manager In Team</p>
                        </div>
                        <div className="icons">
                          <FontAwesomeIcon icon={faUsers} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card mt-1 mb-3  box-8 zoom-effect">
                    <div className="card-body">
                      <div className="d-flex more_flex">
                        <div>
                          <h2>{superManagerDirect}</h2>
                          <p>Super Manager In Direct</p>
                        </div>
                        <div className="icons">
                          <FontAwesomeIcon icon={faUserTie} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card mt-1 mb-3  box-9 zoom-effect">
                    <div className="card-body">
                      <div className="d-flex more_flex">
                        <div>
                          <h2>{superManagerTeam}</h2>
                          <p>Super Manager In Team</p>
                        </div>
                        <div className="icons">
                          <FontAwesomeIcon icon={faUsers} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <div className="bhas">
          <h4>Bussiness</h4>
        </div>
        <div className="row mt-2">
          <div className="col-md-12">
            <div className="table-responsive">
              <table className="table table-bordered table-striped ">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Self</th>
                    <th>Direct</th>
                    <th>Team</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Normal</th>
                    <td>{bussiness.normal.self}</td>
                    <td>{bussiness.normal.direct}</td>
                    <td>{bussiness.normal.team}</td>
                  </tr>
                  <tr>
                    <th>Manager</th>
                    <td>{bussiness.manager.self}</td>
                    <td>{bussiness.manager.direct}</td>
                    <td>{bussiness.manager.team}</td>
                  </tr>
                  <tr>
                    <th>S.Manager</th>
                    <td>{bussiness.s_manager.self}</td>
                    <td>{bussiness.s_manager.direct}</td>
                    <td>{bussiness.s_manager.team}</td>
                  </tr>
                  <tr>
                    <th>Diamond</th>
                    <td>{bussiness.diamond.self}</td>
                    <td>{bussiness.diamond.direct}</td>
                    <td>{bussiness.diamond.team}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <div className="bhas">
          <h4>Normal Investment</h4>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-striped ">
            <thead>
              <tr>
                <th>Invest</th>
                <th>Invest On</th>
                <th>Claim Amount</th>
                <th>Claim On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {normalInvestment &&
                normalInvestment.map((val, index) => (
                  <tr key={index}>
                    <td> ${ethers.formatEther(val.usdt)}</td>
                    <td>
                      {new Date(
                        parseInt(val.timestamp) * 1000
                      ).toLocaleString()}
                    </td>
                    <td> ${ethers.formatEther(val.income)}</td>
                    <td>
                      {new Date(
                        new Date(parseInt(val.timestamp) * 1000).setMonth(
                          new Date(parseInt(val.timestamp) * 1000).getMonth() +
                            1
                        )
                      ).toLocaleString()}
                    </td>
                    <td>
                      {val.status ? (
                        <button
                          type="button"
                          disabled={loadingNormalPkgId === val.pkgid}
                          onClick={() => fn_ClaimNormalInvestment(val.pkgid)}
                          className="btn btn-sm btn-primary"
                        >
                          {loadingNormalPkgId === val.pkgid
                            ? "Processing..."
                            : "Claim"}
                        </button>
                      ) : (
                        "Claimed"
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <div className="bhas">
          <h4>Manager Investment</h4>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-striped ">
            <thead>
              <tr>
                <th>Invest</th>
                <th>Invest On</th>
                <th>Claim Amount</th>
                <th>Claim On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {managerInvestment &&
                managerInvestment.map((val, index) => (
                  <tr key={index}>
                    <td> ${ethers.formatEther(val.usdt)}</td>
                    <td>
                      {new Date(
                        parseInt(val.timestamp) * 1000
                      ).toLocaleString()}
                    </td>
                    <td> ${ethers.formatEther(val.income)}</td>
                    <td>
                      {new Date(
                        new Date(parseInt(val.timestamp) * 1000).setMonth(
                          new Date(parseInt(val.timestamp) * 1000).getMonth() +
                            1
                        )
                      ).toLocaleString()}
                    </td>
                    <td>
                      {val.status ? (
                        <button
                          type="button"
                          disabled={
                            loadingManagerPkgId === val.pkgid &&
                            loadingRound === index
                          }
                          onClick={() =>
                            fn_ClaimManagerInvestment(val.pkgid, index)
                          }
                          className="btn btn-sm btn-primary"
                        >
                          {loadingManagerPkgId === val.pkgid &&
                          loadingRound === index
                            ? "Processing..."
                            : "Claim"}
                        </button>
                      ) : (
                        "Claimed"
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <div className="bhas">
          <h4>Super Manager Investment</h4>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered .table-striped ">
            <thead>
              <tr>
                <th>Invest</th>
                <th>Invest On</th>
                <th>Claim Amount</th>
                <th>Claim On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {superManagerInvestment &&
                superManagerInvestment.map((val, index) => (
                  <tr key={index}>
                    <td> BVT {ethers.formatEther(val.token)}</td>
                    <td>
                      {new Date(
                        parseInt(val.timestamp) * 1000
                      ).toLocaleString()}
                    </td>
                    <td> BVT {ethers.formatEther(val.income)}</td>
                    <td>
                      {new Date(
                        new Date(parseInt(val.timestamp) * 1000).setMonth(
                          new Date(parseInt(val.timestamp) * 1000).getMonth() +
                            1
                        )
                      ).toLocaleString()}
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-primary">
                        Claim
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="my-3 p-3 bg-body rounded shadow-sm">
        <div className="bhas">
          <h4>Diamond Investment</h4>
        </div>
        <div className="table-responsive">
          <table className="table table-bordered table-striped ">
            <thead>
              <tr>
                <th>Invest</th>
                <th>Invest On</th>
                <th>Claim Amount</th>
                <th>Claim On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {diamondInvestment &&
                diamondInvestment.map((val, index) => (
                  <tr key={index}>
                    <td> BVT {ethers.formatEther(val.token)}</td>
                    <td>
                      {new Date(
                        parseInt(val.timestamp) * 1000
                      ).toLocaleString()}
                    </td>
                    <td> BVT {ethers.formatEther(val.income)}</td>
                    <td>
                      {new Date(
                        new Date(parseInt(val.timestamp) * 1000).setMonth(
                          new Date(parseInt(val.timestamp) * 1000).getMonth() +
                            1
                        )
                      ).toLocaleString()}
                    </td>
                    <td>
                      <button type="button" className="btn btn-sm btn-primary">
                        Claim
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
