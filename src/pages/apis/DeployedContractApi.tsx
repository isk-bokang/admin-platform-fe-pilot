import axios from "axios";
import {
    ContractRoleDto,
    DeployedContractsDto,
    DeployRequestDto,
    GetDeployedContractReq,
    RegisterRequestDto
} from "@/pages/apis/dto";

const targURL = "http://localhost:8090/deployed/contracts"
const deployURL = "http://localhost:8090/deploy"


export class DeployedContractApi {

    static getDeployedContracts(param?: GetDeployedContractReq) {
        return axios.get<DeployedContractsDto[]>(`${targURL}`, { params: param })
    }


    static getDeployedCotract(deployedId: string) {
        return axios.get<DeployedContractsDto>(`${targURL}/${deployedId}`)
    }


    static postDeployContract(req: DeployRequestDto) {
        return axios.post<DeployedContractsDto>(`${deployURL}`, req)
    }

    static postRegisterDeployedContract(req: RegisterRequestDto){
        return axios.post<DeployedContractsDto>(`${targURL}`, req)
    }

    static getContractRoles(deployedId : string){
        return axios.get<ContractRoleDto[]>(`${targURL}/${deployedId}/roles`)
    }
}

