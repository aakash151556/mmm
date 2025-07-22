const IncomeName=(val)=>{
    
    switch(val){
            case "0":
                return "TOTAL INCOME";
            case "1":
                return "TOTAL WITHDRAWL";
            case "2":
                return "TOTAL BALANCE";
            case "3":
                return "REFERRAL INCOME";
            case "4":
                return "LEVEL INCOME";
            case "5":
                return "NORMAL INCOME";
            case "6":
                return "MANAGER INCOME";
            case "7":
                return "SUPER MANAGER INCOME";
            case "8":
                return "DIAMOND INCOME";
            case "9":
                return "TOTAL TRANSFER";      
            default:
                return "NA";
    }

 }
 
 export default IncomeName;