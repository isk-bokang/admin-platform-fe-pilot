import axios from "axios";
import { GetChainDto } from "./ChainApi";


const targURL = "http://localhost:8090/nodes"

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

export class PostNodeDto{
    chainSeq : string
    nodeType : string
    ipAddress : string
    constructor(
        chainSeq : string,
        nodeType : string,
        ipAddress : string
    ){
        this.chainSeq = chainSeq
        this.nodeType = nodeType
        this.ipAddress = ipAddress 
    }
}


export class NodeApi {
    static getNodes(param ?: {chainSeq : string}) {
        if(param)
            return axios.get<GetNodeDto[]>(`${targURL}`, {params:param})
        else
            return axios.get<GetNodeDto[]>(`${targURL}`)
    }

    static getNode(nodeId : string){
        return axios.get<GetNodeDto>(`${targURL}/${nodeId}`)
    }

    static registerNode(node : PostNodeDto){
        console.log(node)
        return axios.post<GetNodeDto>(`${targURL}`, node)
    }

}

