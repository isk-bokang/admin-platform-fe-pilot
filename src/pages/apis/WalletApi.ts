import {DeployedContractsDto} from "@/pages/apis/DeployedContractApi";
import axios from "axios";
import {ContractRoleDto} from "@/pages/apis/ContractApi";

const targURL = "http://localhost:8090/wallets"

export interface PlatformWalletDto{
    id : number,
    accountAddress : string,
    name : string
}

export interface PlatformContractInfoDto{
    roleId : number,
    contractRoleDto : ContractRoleDto,
    deployedContractDto : DeployedContractsDto
}



export interface PlatformWalletInfoDto{
    platformWalletDto : PlatformWalletDto,
    platformContractInfoDtos : PlatformContractInfoDto[],
}

export class WalletGrantRequestDto{
    readonly walletId : number
    readonly deployedContractId : number
    readonly roleId : number

    constructor(walletId : number, deployedContractId : number, roleId : number) {
        this.walletId = walletId;
        this.deployedContractId = deployedContractId;
        this.roleId = roleId
    }

}

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



