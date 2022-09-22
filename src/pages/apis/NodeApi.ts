import axios from "axios";
import {GetNodeDto, PostNodeDto} from "@/pages/apis/dto";


const targURL = "http://localhost:8090/nodes"


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

