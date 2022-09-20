import {useEffect, useState} from "react";
import {ChainApi} from "@/pages/apis/ChainApi";
import {TargListView} from "@/pages/utils/OutputDiv";
import {Button} from "antd";
import {RouteName} from "@/constants";
import {ListViewChain} from "@/types/types";

export function ChainListDiv() {
    const [chainList, setChainList] = useState<ListViewChain[]>([])
    useEffect(() => {
        ChainApi.getChainList()
            .then(res => {
                setChainList(
                    res.data.map((item) => {
                        return {
                            id: item.seq,
                            name: item.name,
                            chainId: item.chainId,
                            chainType: item.chainType,
                            rpcUrl: item.rpcUrl
                        }
                    })
                )
            })
    }, [])

    return (
        <div>
            {chainList.length !== 0 && <TargListView targList={chainList}/>}
            <Button onClick={() => window.location.href = `${RouteName.REGISTER_CHAIN}`}> REGISTER </Button>

        </div>
    )
}