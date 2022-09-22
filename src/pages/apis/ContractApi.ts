import axios from "axios";
import {AbiItem} from "web3-utils";
import {ContractRoleDto, ContractTypeDto, GetContractDto, PostContractDto} from "@/pages/apis/dto";


const targURL = "http://localhost:8090/contracts"

export class ContractApi {
    static getContractList(param ?:{contractType ?: string, contractName ?: string}) {
        return axios.get<GetContractDto[]>(`${targURL}`, {params : param})
    }
    static getContract(contractId: string) {
        return axios.get<GetContractDto>(`${targURL}/${contractId}`)
    }
    static postContract(data : PostContractDto){
        return axios.post<GetContractDto>(`${targURL}`, data)
    }
    static getContractMethods(contractId: string, param ?: {methodName ?: string}) {
        return axios.get<AbiItem[]>(`${targURL}/${contractId}/methods`, {params:param})
    }
    static getContractTypes(){
        return axios.get<ContractTypeDto[]>(`${targURL}/types`)
    }
    static postContractRoles(contractId : string, data : ContractRoleDto){
        return axios.post<ContractRoleDto>(`${targURL}/${contractId}/roles`, data)
    }
    static getContractRoles(contractId : string){
        return axios.get<ContractRoleDto[]>(`${targURL}/${contractId}/roles`)
    }
}



