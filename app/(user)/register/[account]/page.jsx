"use client"
import Web3Context from "@/components/web3context";
import { ethers } from "ethers";
import React, { useContext, useEffect } from 'react'
import Swal from "sweetalert2";



const Register = ({params}) => {
 const { account } = React.use(params);
 const {selectedAccount,logicContract,storageContract,teamBussinessContract,stakeTokenContract,stakeUSDTContract}=useContext(Web3Context)
 
 const fn_submit=async(e)=>{
e.preventDefault();
const pkgDropdown=document.querySelector("#ddPackage")

if(pkgDropdown.value==""){
    alert("select package")
    return;
}

try{
    debugger
    const {_status}=await storageContract.GetUser(account)    
    if(!_status){
        alert("Invalid sponsor")
        return;
    }
    let amount ="0";
    if(pkgDropdown.value==0){
        amount="54"
    }
    else if(pkgDropdown.value==1){
         amount="215"
    }
    else{
          alert("select package")
        return;
    }
    const approve_tx=await stakeTokenContract.approve(process.env.NEXT_PUBLIC_STORAGE_CONTRACT,ethers.parseUnits(amount, 18));
    const approve_reciept=await approve_tx.wait();
    if(approve_reciept){
        const tx=  await logicContract.JoinNow(account,pkgDropdown.value)
        const reciept=await tx.wait();
        if(reciept){

             Swal.fire({
                    title: "Success!",
                    text: "Registration Successfull..!",
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
            <h2 className='card-title'>Register</h2>
        </div>
        <div className='card-body'>
            <div className='row'>
                <div className='form-group'>
                    <label>Package</label>
                    <select className='form-control' id='ddPackage' name='package'>
                        <option value="">Select Package</option>
                        <option value="0">54 USDT</option>
                        <option value="1">215 USDT</option>
                    </select>
                </div>
            </div>
        </div>
        <div className="card-footer">
            <button type="button" className="btn btn-primary" onClick={fn_submit}>Submit</button>
        </div>
    </div>
  )
}

export default Register