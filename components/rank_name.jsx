const RankName=(val)=>{    
    switch(val){
            case 0:
                return "MEMBER";
            case "1":
                return "MANAGER";
            case "2":
                return "SUPER MANAGER";
            case "3":
                return "DIAMOND MANAGER";             
            default:
                return "NA";
    }
 }
 
 export default RankName;