import axios from "axios";
import {GetServiceDto} from "@/pages/apis/dto";


const targURL = "http://localhost:8090/services"


export class ServiceApi{
    static getServices(){
        return axios.get<GetServiceDto[]>(`${targURL}`)
    }
    static getService(serviceId : string){
        return axios.get<GetServiceDto>(`${targURL}/${serviceId}`)
    }
}
