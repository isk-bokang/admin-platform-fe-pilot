import axios from "axios";


const targURL = "http://localhost:8090/contracts"

export interface Abi{
    inputs : {name : string, type : string, internalType : string}[],
    type : string
}

export class GetContractDto {
    readonly id: string;
    readonly name: string;
    readonly contractType: string;
    readonly abi: string;
    readonly bytecode: string;

    constructor(
        id: string,
        name: string,
        contractType: string,
        abi: string,
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
    abi: string = '';
    bytecode: string = '';

    constructor(
        name: string = "",
        contractType: string = "",
        abi: string = "",
        bytecode: string = ""
    ) {
        this.name = name
        this.contractType = contractType
        this.abi = abi
        this.bytecode = bytecode
    }
}

export class ContractApi {
    static getContractList() {
        return axios.get<GetContractDto[]>(`${targURL}`)
    }
    static getContract(contractId: string) {
        return axios.get<GetContractDto>(`${targURL}/${contractId}`)
    }
    static postContract(data : PostContractDto){
        return axios.post<GetContractDto>(`${targURL}`, data)
    }
}

