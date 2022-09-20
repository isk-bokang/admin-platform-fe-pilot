import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {NodeApi} from "@/pages/apis/NodeApi";
import {DetailView} from "@/pages/utils/OutputDiv";
import {ListViewNode} from "@/types/types";

export function NodeDetailDiv() {
    const {nodeId: nodeId} = useParams()
    return (
        <div>
            {nodeId && <NodeByPropDiv nodeId={nodeId}/>}
        </div>
    )
}

export function NodeByPropDiv(prop: { nodeId: string }) {
    const [node, setNode] = useState<ListViewNode>()
    useEffect(() => {
        NodeApi.getNode(prop.nodeId)
            .then(res => {
                setNode({
                    id: res.data.id,
                    nodeType: res.data.nodeType,
                    chainId: res.data.chain.chainId,
                    ipAddress: res.data.ipAddress
                })
            })
    }, [prop.nodeId])

    return (
        <div>
            {node && <DetailView targ={node}/>}
        </div>
    )
}