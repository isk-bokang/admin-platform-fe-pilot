import axios from "axios";
import {GetAdminLogDto, PostAdminLogDto} from "@/pages/apis/dto";

const targURL = "http://localhost:8090/adminLogs"


export class AdminLogApi {
    static getAdminLogs(params ?: {platformType ?: string, category ?: string }) {
        return axios.get<GetAdminLogDto>(`${targURL}`, {params})
    }

    static getPlatformTypes() {
        return axios.get<string>(`${targURL}/platformTypes`)
    }

    static registerAdminLogs(data : PostAdminLogDto) {
        return axios.post<GetAdminLogDto>(`${targURL}`, data)
    }

}

