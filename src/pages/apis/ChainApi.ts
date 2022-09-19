import axios from "axios";


const targURL = "http://localhost:8090/chains"

export class GetChainDto {
    readonly seq: string;
    readonly name: string;
    readonly chainId: string;
    readonly chainType : string;
    readonly rpcUrl: string;

    constructor(
        chainSeq: string,
        chainName: string,
        chainId: string,
        chainType : string,
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

export class ChainApi {
    static getChainList() {
        return axios.get<GetChainDto[]>(`${targURL}`)
    }
    static getChain(chainSeq: string) {
        return axios.get<GetChainDto>(`${targURL}/${chainSeq}`)
    }
    static getSearchChains(param : { chainSeq ?: string, chainId ?: string, chainName ?: string, chainType ?: string, rpcUrl ?: string }){
        return axios.get<GetChainDto>(`${targURL}/search`, {params:param})
    }
    static getChainTypes(){
        return axios.get<string[]>(`${targURL}/types`)
    }
    
    static postChain(data : PostChainDto){
        return axios.post<GetChainDto>(`${targURL}`, data)
    }

}
