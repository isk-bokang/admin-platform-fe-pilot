import axios from "axios";
import { GetChainDto } from "./ChainApi";
import { GetContractDto } from "./ContractApi";
import { GetServiceDto as GetGameAppDto } from "./ServiceApi";

const targURL = "http://localhost:8090/deployed/contracts"
const deployURL = "http://localhost:8090/deploy"

export class DeployedContractsDto {
    readonly id: string
    readonly address: string

    readonly contract: GetContractDto
    readonly gameApp: GetGameAppDto
    readonly chain: GetChainDto

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
        this.gameApp = service
        this.chain = chain
    }
}


class DeployRequestDto {
    readonly appId: string
    readonly contractId: string
    readonly chainSeq: string
    readonly deployParams: string[]

    constructor(serviceId: string,
        contractId: string,
        chainSeq: string,
        deployParam: string[]) {
        this.appId = serviceId
        this.contractId = contractId
        this.chainSeq = chainSeq
        this.deployParams = deployParam
    }
}

class RegisterRequestDto {
    readonly appId: string
    readonly contractId: string
    readonly chainSeq: string
    readonly contractAddress: string
    readonly deployerAddress: string
    readonly contractName: string
    constructor(
        appId: string,
        contractId: string,
        chainSeq: string,
        contractAddress: string,
        deployerAddress: string,
        contractName : string
    ) {
        this.appId = appId;
        this.contractId = contractId
        this.chainSeq = chainSeq
        this.contractAddress = contractAddress
        this.deployerAddress = deployerAddress
        this.contractName = contractName
    }
}


export class DeployedContractApi {

    static getDeployedContracts(param?: { chainSeq?: string, appId?: string }) {
        return axios.get<DeployedContractsDto[]>(`${targURL}`, { params: param })
    }


    static getDeployedCotract(deployedId: string) {
        return axios.get<DeployedContractsDto>(`${targURL}/${deployedId}`)
    }


    static postDeployContract(req: DeployRequestDto) {
        return axios.post<DeployedContractsDto>(`${deployURL}`, req)
    }

    static postRegisterDeployedContract(req: RegisterRequestDto){
        return axios.post<DeployedContractsDto>(`${targURL}`, req)
    }
}

