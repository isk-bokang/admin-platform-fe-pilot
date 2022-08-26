import {DeployedContractsDto} from "@/pages/apis/DeployedContractApi";
import axios from "axios";

const targURL = "http://localhost:8090/wallets"

export interface PlatformWalletDto{
    id : number,
    accountAddress : string,
    name : string
}

export interface PlatformContractInfoDto{
    roleId : number,
    role : string,
    deployedContractDto : DeployedContractsDto
}

export interface PlatformWalletInfoDto{
    platformWalletDto : PlatformWalletDto,
    platformContractInfoDtos : PlatformContractInfoDto[],
}

export class WalletGrantRequestDto{
    readonly walletId : number
    readonly deployedContractId : number
    readonly role : string

    constructor(walletId : number, deployedContractId : number, role : string) {
        this.walletId = walletId;
        this.deployedContractId = deployedContractId;
        this.role = role
    }

}

export class PlatformWalletApi{
    static getPlatformWalletList(){
        return axios.get<PlatformWalletInfoDto[]>(`${targURL}`)
    }

    static getPlatformWalletTypes(){
        return axios.get<string[]>(`${targURL}/types`)
    }

    static grantWalletRole(walletGrantRequestDto : WalletGrantRequestDto){
        return axios.post<void>(`${targURL}/grant`, walletGrantRequestDto)
    }

    static getWalletAddressByRole(role : string, param : { deployedContractId: number }){
        return axios.get<string[]>(`${targURL}/${role}/address`, {params : param})

    }
}



