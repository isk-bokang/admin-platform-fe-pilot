import axios from "axios";
import {GetChainDto, PostChainDto} from "@/pages/apis/dto";


const targURL = "http://localhost:8090/chains"

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
