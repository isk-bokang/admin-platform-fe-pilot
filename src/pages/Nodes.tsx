import { Button } from "antd"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { NodeApi } from "./apis/NodeApi"
import { DetailView, TargListView } from "./utils/OutputDiv"


interface ListViewNode{
    id : string,
    chainId : string,
    nodeType : string,
    ipAddress : string,
}


export function NodeListDiv(prop : {chainSeq ?: string}){
    const [nodeList, setNodeList] = useState<ListViewNode[]>([])
    useEffect(() => {
        NodeApi.getNodes(prop.chainSeq ? {chainSeq : prop.chainSeq } : undefined)
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
            {nodeList.length !== 0 && <TargListView targList={nodeList} connectPath="node"/>}
            <Button> REGISTER NODE </Button>
        </div>
    )
}

export function NodeDetailDiv() {
    const { nodeId: nodeId } = useParams()
    return (
        <div>
            {nodeId && <NodeByPropDiv nodeId={nodeId} />}
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

    return(
        <div>
            {node && <DetailView targ={node} />}
        </div>
    )
}

function Nodes(){
    return(
        <div>
            Nodes
        </div>
    )
}

export function RegisterNode(prop : {chainSeq : string}){
    
}

export default Nodes

