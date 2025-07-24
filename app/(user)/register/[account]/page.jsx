"use client"

import Web3Context from "@/components/web3context";
import { ethers } from "ethers";
import React, { useContext, useEffect, useState } from 'react'
import Swal from "sweetalert2";




const Register = ({params}) => {
 const { account } = React.use(params);
 const {selectedAccount,logicContract,storageContract,teamBussinessContract,stakeTokenContract,stakeUSDTContract}=useContext(Web3Context)
 const [currentPrice,setCurrentPrice]=useState(0);
 const [netBVT,setNetBVT]=useState(0);


 useEffect(() => {
    const fetchPrice = async () => {
        try{
      const resp = await fetch('/api/bvt-price'); // No CORS issue
      const { price } = await resp.json();
      
     setCurrentPrice(price); 
        }
        catch(err){
            console.error(err)
           setCurrentPrice(0.52);
        }
    };
    fetchPrice();
  }, []);


  
const fn_CalculateBVT=async(e)=>{
    const pkgid=e.target.value;
    if(pkgid==""){
        alert("select package")
        return;
    }
    let amount =0;
    if(pkgid==0){
        amount=54
    }
    else if(pkgid==1){
         amount=215
    }
    else if(pkgid==2){
         amount=5000
    }
    else if(pkgid==3){
         amount=25000
    }
    else{
          alert("select package")
        return;
    }
    if(currentPrice>0){
        if(pkgid==0 || pkgid==1){
            const totalbvt=Number(amount)/Number(currentPrice)
            setNetBVT(totalbvt)
        }
        else{
            setNetBVT(amount)
        }
    }
}
 const fn_submit=async(e)=>{
e.preventDefault();
const pkgDropdown=document.querySelector("#ddPackage")

if(pkgDropdown.value==""){
    alert("select package")
    return;
}

try{
    
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
    else if(pkgDropdown.value==2){
         amount="5000"
    }
    else if(pkgDropdown.value==3){
         amount="25000"
    }
    else{
          alert("select package")
        return;
    }

    


    const approve_tx=await stakeTokenContract.approve(process.env.NEXT_PUBLIC_STORAGE_CONTRACT,ethers.parseUnits(netBVT+"", 18));
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
                    <select className='form-control' id='ddPackage' onChange={fn_CalculateBVT} name='package'>
                        <option value="">Select Package</option>
                        <option value="0">54 USDT (BVT) NORMAL</option>
                        <option value="1">215 USDT (BVT) MANAGER</option>
                        <option value="2">5000 BVT SUPER MANAGER</option>
                        <option value="3">25000 BVT DIAMOND</option>
                    </select>
                </div>
                 <div className='form-group'>
                    <label>Current BVT Price:</label>
                    <input type='text' className="form-control" readOnly value={currentPrice} />
                </div>
                  <div className='form-group'>
                    <label>Net BVT:</label>
                    <input type='text' className="form-control" readOnly value={netBVT} />
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