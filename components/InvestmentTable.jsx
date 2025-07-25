// components/InvestmentTable.jsx
import React from "react";
import { ethers } from "ethers";

const InvestmentTable = ({ data, title, isToken = false }) => {
  const formatAmount = (amount) => ethers.formatEther(amount);

  return (
    <div className="my-3 p-3 bg-body rounded shadow-sm">
      <h4>{title}</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
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
            {data?.map((val, index) => {
              const date = new Date(parseInt(val.timestamp) * 1000);
              const claimDate = new Date(date.setMonth(date.getMonth() + 1));
              return (
                <tr key={index}>
                  <td>{isToken ? `BVT ${formatAmount(val.token)}` : `$${formatAmount(val.usdt)}`}</td>
                  <td>{new Date(parseInt(val.timestamp) * 1000).toLocaleString()}</td>
                  <td>{isToken ? `BVT ${formatAmount(val.income)}` : `$${formatAmount(val.income)}`}</td>
                  <td>{claimDate.toLocaleString()}</td>
                  <td>
                    <button className="btn btn-sm btn-primary">Claim</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestmentTable;
