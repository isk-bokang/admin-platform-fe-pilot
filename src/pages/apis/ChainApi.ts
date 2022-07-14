import axios from "axios";


const targURL = "http://localhost:8090/chains"

export class GetChainDto {
    readonly chainSeq: string;
    readonly chainName: string;
    readonly chainId: string;
    readonly rpcUrl: string;

    constructor(
        chainSeq: string,
        chainName: string,
        chainId: string,
        rpcUrl: string
    ) {
        this.chainSeq = chainSeq
        this.chainName = chainName
        this.chainId = chainId
        this.rpcUrl = rpcUrl
    }
}

export class ChainApi {
    static getChainList() {
        return axios.get<GetChainDto[]>(`${targURL}`)
    }
    static getChain(chainSeq : string){
        return axios.get<GetChainDto>(`${targURL}/${chainSeq}`)
    }
}
