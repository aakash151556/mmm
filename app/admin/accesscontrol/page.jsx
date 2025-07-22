"use client"
import Web3Context from "@/components/web3context";
import { ethers } from "ethers";
import React, { useContext, useEffect } from 'react'
import Swal from "sweetalert2";



const AccessControl = () => {
 
 const {selectedAccount,logicContract,payoutContract,accessContract,storageContract,teamBussinessContract,stakeTokenContract,stakeUSDTContract}=useContext(Web3Context)
 
 const fn_submit=async(e)=>{
e.preventDefault();
const pkgDropdown=document.querySelector("#ddPackage")
const LogicContractAddress=document.querySelector("#LogicContractAddress")

if(pkgDropdown.value=="0"){
    alert("select contract")
    return;
}
if(LogicContractAddress.value==""){
    alert("Enter logic contract address")
    return;
}
try{
  
    if(pkgDropdown.value=="role"){
        const trx=await accessContract.SetLogicAccount(LogicContractAddress.value)
        const reciept=await trx.wait();
        if(reciept){
               Swal.fire({
                    title: "Success!",
                    text: "Successfull..!",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then((result)=>{
                    if(result.isConfirmed){
                        
                        window.location.reload();
                    }
                });
        }
    }
    else if(pkgDropdown.value=="team"){
  const trx=await teamBussinessContract.SetLogicContract(LogicContractAddress.value)
        const reciept=await trx.wait();
        if(reciept){
               Swal.fire({
                    title: "Success!",
                    text: "Successfull..!",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then((result)=>{
                    if(result.isConfirmed){
                        
                        window.location.reload();
                    }
                });
        }
    }
    else if(pkgDropdown.value=="payout"){
        const trx=await payoutContract.SetLogicContract(LogicContractAddress.value)
        const reciept=await trx.wait();
        if(reciept){
               Swal.fire({
                    title: "Success!",
                    text: "Successfull..!",
                    icon: "success",
                    confirmButtonText: "OK",
                }).then((result)=>{
                    if(result.isConfirmed){
                        
                        window.location.reload();
                    }
                });
        }
    }

        
    

}
catch(err){
    Swal.fire({
                    title: "Error!",
                    text: err,
                    icon: "error",
                    confirmButtonText: "OK",
                })
}


 }



  return (
    <div className='card'>
        <div className='card-header'>
            <h2 className='card-title'>Set Logic Contract</h2>
        </div>
        <div className='card-body'>
            <div className='row'>
                <div className='form-group'>
                    <label>Package</label>
                    <select className='form-control' id='ddPackage' name='package'>
                        <option value="0">Select Contract</option>
                        <option value="role">Role Access</option>
                        <option value="team">Team Calc</option>
                        <option value="payout">Payout Calc</option>                        
                    </select>
                </div>
                  <div className='form-group'>
                    <label>Logic Contract Address</label>
                    <input type="text" className="form-control" id="LogicContractAddress" />
                </div>
            </div>
        </div>
        <div className="card-footer">
            <button type="button" className="btn btn-primary" onClick={fn_submit}>Submit</button>
        </div>
    </div>
  )
}

export default AccessControl