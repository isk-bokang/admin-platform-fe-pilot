import axios from "axios";


const targURL = "http://localhost:8090/services"

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


export class ServiceApi{
    static getServices(){
        return axios.get<GetServiceDto[]>(`${targURL}`)
    }
    static getService(serviceId : string){
        return axios.get<GetServiceDto>(`${targURL}/${serviceId}`)
    }
}
