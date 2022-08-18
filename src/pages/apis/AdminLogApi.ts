import axios from "axios";

const targURL = "http://localhost:8090/adminLogs"

export class PostAdminLogDto {
    responsibility?: string
    platform?: string
    category?: string
    originValue ?: string
    updateValue ?: string
    txHash ?: string
    status ?: string

    constructor(
        responsibility ?: string,
        platform ?: string,
        category ?: string,
        originValue ?: string,
        updateValue ?: string,
        txHash ?: string,
        status ?: string
    ) {
        this.responsibility = responsibility
        this.platform = platform
        this.category = category
        this.originValue = originValue
        this.updateValue = updateValue
        this.txHash = txHash
        this.status = status
    }
}

export class GetAdminLogDto {
    id: number
    createAt: Date
    responsibility: string
    platform: string
    category: string
    originValue ?: string
    updateValue ?: string
    txHash ?: string
    status ?: string

    constructor(
        id: number,
        createAt: Date,
        responsibility: string,
        platform: string,
        category: string,
        originValue ?: string,
        updateValue ?: string,
        txHash ?: string,
        status ?: string,
    ) {
        this.id =id
        this.createAt = createAt
        this.responsibility = responsibility
        this.platform = platform
        this.category = category
        this.originValue = originValue
        this.updateValue = updateValue
        this.txHash = txHash
        this.status = status
    }
}


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

