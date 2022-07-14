import { useEffect, useState } from "react"
import { ChainApi } from "./apis/ChainApi"
import { TargListView } from "./utils/OutputDiv"

function Chains(){
    return (
        <div> Chains </div>
    )
}

export interface ListViewChain {
    id: string
    name: string
    chainId: string
    rpcUrl: string
}

export function ChainListDiv() {
    const [chainList, setChainList] = useState<ListViewChain[]>([])
    useEffect(() => {
        ChainApi.getChainList()
            .then(res => {
                setChainList(
                    res.data.map((item) => {
                        return {
                            id: item.chainSeq,
                            name: item.chainName,
                            chainId: item.chainId,
                            rpcUrl: item.rpcUrl
                        }
                    })
                )
            })
    }, [])

    return (<div>
        {chainList.length !== 0 && <TargListView targList={chainList} />}
    </div>)
}

export default Chains

