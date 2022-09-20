import {useEffect, useState} from "react";
import {NodeApi} from "@/pages/apis/NodeApi";
import {TargListView} from "@/pages/utils/OutputDiv";
import {RouteName} from "@/constants";
import {ListViewNode} from "@/types/types";

export function NodeListDiv(prop: { chainSeq?: string }) {
    const [nodeList, setNodeList] = useState<ListViewNode[]>([])
    useEffect(() => {
        NodeApi.getNodes(prop.chainSeq ? {chainSeq: prop.chainSeq} : undefined)
            .then(res => {
                setNodeList(
                    res.data.map((item) => {
                        return {
                            id: item.id,
                            nodeType: item.nodeType,
                            chainId: item.chain.chainId,
                            ipAddress: item.ipAddress
                        }
                    })
                )
            })
    }, [prop.chainSeq])

    return (
        <div>
            <h4>NODES</h4>
            {nodeList.length !== 0 && <TargListView targList={nodeList} connectPath={RouteName.NODES}/>}

        </div>
    )
}