import axios from "axios";
import {AbiItem} from "web3-utils";
import {toUpperCase_Custom} from "../../constants";


const targURL = "http://localhost:8090/contracts"

export interface Abi{
    name ?: string,
    inputs : {name : string, type : string, internalType : string}[],
    type : string
}

export interface ContractTypeDto{
    id : string,
    name : string,
    platformName : string

}

export class GetContractDto {
    readonly id: string;
    readonly name: string;
    readonly contractType: ContractTypeDto;
    readonly abi: AbiItem[] = [];
    readonly bytecode: string;

    constructor(
        id: string,
        name: string,
        contractType: ContractTypeDto,
        abi: AbiItem[] = [],
        bytecode: string,
    ) {
        this.id = id
        this.name = name
        this.contractType = contractType
        this.abi = abi
        this.bytecode = bytecode

    }
}

export class PostContractDto {
    name: string = '';
    contractType ?: ContractTypeDto;
    abi: AbiItem[] = [] ;
    bytecode: string = '';

    constructor(
        name: string = "",
        contractType : ContractTypeDto ,
        abi: AbiItem[] = [] ,
        bytecode: string = ""
    ) {
        this.name = name
        this.contractType = contractType
        this.abi = abi
        this.bytecode = bytecode
    }
}

export class ContractRoleDto{
    id ?: number
    onChainName : string
    name : string = ''

    constructor(
        onChainName : string,
        name : string = ''
    ) {
        this.onChainName = onChainName
        if(name === ''){
            this.name = toUpperCase_Custom( onChainName, '_')
        }
        else{
            this.name = name
        }
    }
}

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



