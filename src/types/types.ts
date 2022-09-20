export interface DeployedContracts {
    id: string
    contractName: string
    contractType?: string
    serviceName?: string
    chainName: string
    address: string
}

export interface RoleAttributeType {
    key: number;
    onChainName: string
    name: string
}

export interface ContractDetail {
    contractId: string,
    name: string,
    contractType?: string,
    abi: string,
    bytecode: string
}

export interface DeployedContractDetail {
    deployedId: string,
    address: string
}

export interface ListViewChain {
    id: string
    name: string
    chainId: string
    chainType: string
    rpcUrl: string
}

export interface ListViewNode {
    id: string,
    chainId: string,
    nodeType: string,
    ipAddress: string,
}