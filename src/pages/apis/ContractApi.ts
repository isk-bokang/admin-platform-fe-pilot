import axios from "axios";
import {AbiItem} from "web3-utils";


const targURL = "http://localhost:8090/contracts"

export interface Abi{
    name ?: string,
    inputs : {name : string, type : string, internalType : string}[],
    type : string
}

export class GetContractDto {
    readonly id: string;
    readonly name: string;
    readonly contractType: string;
    readonly abi: AbiItem[] = [];
    readonly bytecode: string;

    constructor(
        id: string,
        name: string,
        contractType: string,
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
    contractType: string = '';
    abi: Map<string, any>[] = [] ;
    bytecode: string = '';

    constructor(
        name: string = "",
        contractType: string = "",
        abi: Map<string, any>[] = [] ,
        bytecode: string = ""
    ) {
        this.name = name
        this.contractType = contractType
        this.abi = abi
        this.bytecode = bytecode
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
        return axios.get<string[]>(`${targURL}/types`)
    }
}



