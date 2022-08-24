
export interface PlatformWalletInfo{
    id : number,
    name : string,
    walletAddress: string,
    walletContractInfoList ?: WalletContractInfo[]
}

export interface WalletContractInfo{
    roleId : number,
    contractId : number,
    contractAddress : string,
    contractName : string,
    role : string,
    contractType : string,
    chainID : string,
    chainName : string,
}

