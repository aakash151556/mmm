export const handle_chain_change=async(setState)=>{
    let chainInHex=await window.ethereum.request({
        method:"eth_chainId"
    })
    const chainId=parseInt(chainInHex,16)    
    setState(prevState=>({...prevState,chainId}))
}