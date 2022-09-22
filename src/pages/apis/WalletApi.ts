import axios from "axios";
import {PlatformWalletInfoDto, WalletGrantRequestDto} from "@/pages/apis/dto";

const targURL = "http://localhost:8090/wallets"



export class PlatformWalletApi{
    static getPlatformWalletList(){
        return axios.get<PlatformWalletInfoDto[]>(`${targURL}`)
    }

    static grantWalletRole(walletGrantRequestDto : WalletGrantRequestDto){
        return axios.post<void>(`${targURL}/grant`, walletGrantRequestDto)
    }

    static getWalletAddressByRole(role : string, param : { deployedContractId: number }){
        return axios.get<string[]>(`${targURL}/${role}/address`, {params : param})

    }
}



