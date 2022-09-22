import {AbiItem} from "web3-utils";
import {toUpperCase_Custom} from "@/constants";

export class PostAdminLogDto {
    responsibility?: string
    platform?: string
    category?: string
    originValue ?: string
    updateValue ?: string
    txHash ?: string
    status ?: string

    constructor(
        responsibility ?: string,
        platform ?: string,
        category ?: string,
        originValue ?: string,
        updateValue ?: string,
        txHash ?: string,
        status ?: string
    ) {
        this.responsibility = responsibility
        this.platform = platform
        this.category = category
        this.originValue = originValue
        this.updateValue = updateValue
        this.txHash = txHash
        this.status = status
    }
}

export class GetAdminLogDto {
    id: number
    createAt: Date
    responsibility: string
    platform: string
    category: string
    originValue ?: string
    updateValue ?: string
    txHash ?: string
    status ?: string

    constructor(
        id: number,
        createAt: Date,
        responsibility: string,
        platform: string,
        category: string,
        originValue ?: string,
        updateValue ?: string,
        txHash ?: string,
        status ?: string,
    ) {
        this.id = id
        this.createAt = createAt
        this.responsibility = responsibility
        this.platform = platform
        this.category = category
        this.originValue = originValue
        this.updateValue = updateValue
        this.txHash = txHash
        this.status = status
    }
}

export class GetChainDto {
    readonly seq: string;
    readonly name: string;
    readonly chainId: string;
    readonly chainType: string;
    readonly rpcUrl: string;

    constructor(
        chainSeq: string,
        chainName: string,
        chainId: string,
        chainType: string,
        rpcUrl: string
    ) {
        this.seq = chainSeq
        this.name = chainName
        this.chainId = chainId
        this.chainType = chainType
        this.rpcUrl = rpcUrl
    }
}

export class PostChainDto {
    name: string;
    chainId: string;
    chainType: string;
    rpcUrl: string;

    constructor(
        chainName: string,
        chainId: string,
        chainType: string,
        rpcUrl: string
    ) {
        this.name = chainName
        this.chainId = chainId
        this.chainType = chainType
        this.rpcUrl = rpcUrl
    }
}

export interface Abi {
    name?: string,
    inputs: { name: string, type: string, internalType: string }[],
    type: string
}

export interface ContractTypeDto {
    id: string,
    name: string,
    platformName: string

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
    abi: AbiItem[] = [];
    bytecode: string = '';

    constructor(
        name: string = "",
        contractType: ContractTypeDto,
        abi: AbiItem[] = [],
        bytecode: string = ""
    ) {
        this.name = name
        this.contractType = contractType
        this.abi = abi
        this.bytecode = bytecode
    }
}

export class ContractRoleDto {
    id ?: number
    onChainName: string
    name: string = ''

    constructor(
        onChainName: string,
        name: string = ''
    ) {
        this.onChainName = onChainName
        if (name === '') {
            this.name = toUpperCase_Custom(onChainName, '_')
        } else {
            this.name = name
        }
    }
}

export class GetServiceDto {
    readonly id: string
    readonly name: string
    readonly category: string

    constructor(
        id: string,
        name: string,
        category: string
    ) {
        this.id = id
        this.name = name
        this.category = category
    }
}

export class DeployedContractsDto {
    readonly id: string
    readonly address: string

    readonly contract: GetContractDto
    readonly gameApp ?: GetServiceDto
    readonly chain: GetChainDto

    constructor(
        id: string,
        address: string,
        chain: GetChainDto,
        contract: GetContractDto,
        service: any = null,
    ) {
        this.id = id
        this.address = address
        this.contract = contract
        this.gameApp = service
        this.chain = chain
    }
}

export class DeployRequestDto {
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

export class RegisterRequestDto {
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
        contractName: string
    ) {
        this.appId = appId;
        this.contractId = contractId
        this.chainSeq = chainSeq
        this.contractAddress = contractAddress
        this.deployerAddress = deployerAddress
        this.contractName = contractName
    }
}

export type GetDeployedContractReq = {
    chainSeq?: string,
    chainId?: string,
    appId?: string,
    contractType?: string
}

export class GetNodeDto {
    readonly id: string
    readonly chain: GetChainDto
    readonly nodeType: string
    readonly ipAddress: string

    constructor(
        id: string,
        chain: GetChainDto,
        nodeType: string,
        ipAddress: string
    ) {
        this.id = id
        this.chain = chain
        this.nodeType = nodeType
        this.ipAddress = ipAddress
    }
}

export class PostNodeDto {
    chainSeq: string
    nodeType: string
    ipAddress: string

    constructor(
        chainSeq: string,
        nodeType: string,
        ipAddress: string
    ) {
        this.chainSeq = chainSeq
        this.nodeType = nodeType
        this.ipAddress = ipAddress
    }
}

export interface PlatformWalletDto {
    id: number,
    accountAddress: string,
    name: string
}

export interface PlatformContractInfoDto {
    roleId: number,
    contractRoleDto: ContractRoleDto,
    deployedContractDto: DeployedContractsDto
}

export interface PlatformWalletInfoDto {
    platformWalletDto: PlatformWalletDto,
    platformContractInfoDtos: PlatformContractInfoDto[],
}

export class WalletGrantRequestDto {
    readonly walletId: number
    readonly deployedContractId: number
    readonly roleId: number

    constructor(walletId: number, deployedContractId: number, roleId: number) {
        this.walletId = walletId;
        this.deployedContractId = deployedContractId;
        this.roleId = roleId
    }

}