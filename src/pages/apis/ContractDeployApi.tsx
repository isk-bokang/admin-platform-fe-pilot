import axios from "axios";
import { GetChainDto } from "./ChainApi";
import { GetContractDto } from "./ContractApi";
import { GetServiceDto } from "./ServiceApi";

const targURL = "http://localhost:8090/deployed/contracts"

export class DeployedContractsDto {
    readonly id: string
    readonly address: string

    readonly contract: GetContractDto
    readonly service: GetServiceDto
    readonly chain : GetChainDto

    constructor(
        id: string,
        address: string,
        chain: GetChainDto,
        contract: GetContractDto,
        service: any,
    ) {
        this.id = id
        this.address = address
        this.contract = contract
        this.service = service 
        this.chain = chain
    }
}


class DeployRequestDto{
    readonly serviceId : string
    readonly contractId : string
    readonly chainSeq : string
    readonly deployParams : string[]

    constructor(serviceId : string,
        contractId : string,
        chainSeq : string,
        deployParam : string[]){
            this.serviceId = serviceId
            this.contractId = contractId
            this.chainSeq = chainSeq
            this.deployParams = deployParam
        }
}


export class ContractDeployApi {
    
    static getDeployedContracts(param ?: {chainId ?: string , serviceId ?: string}){
        if(param){
            return axios.get<DeployedContractsDto[]>(`${targURL}`, {params : param})
        }
        else 
            return axios.get<DeployedContractsDto[]>(`${targURL}`)
    }

    static deployContract(req : DeployRequestDto){
        console.log(req)
        return axios.post<DeployedContractsDto>(`${targURL}`, req)
    }
    
    static getDeployedCotract(deployedId : string){
        return axios.get<DeployedContractsDto>(`${targURL}/${deployedId}`)
    }


}

