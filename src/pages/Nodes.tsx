import { Button, Form, Input } from "antd"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { NodeApi, PostNodeDto } from "./apis/NodeApi"
import { SelectChain } from "./Deploy"
import { DetailView, TargListView } from "./utils/OutputDiv"
import qs from "query-string"
import { RouteName } from "../constants"

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
            {nodeList.length !== 0 && <TargListView targList={nodeList} connectPath={RouteName.NODES}/>}
            
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

export function RegisterNodeDiv(){
    
    return(
        <>
            <RegisterNodeByPropDiv chainSeq={qs.parse(window.location.search).chainSeq?.toString()}/>
        </>
    )
}

export function RegisterNodeByPropDiv(prop : {chainSeq ?: string}){
    const [registerDto, setRegisterDto] = useState<PostNodeDto>()
    const [chainSeq, setChainSeq] = useState<string>('')
    const [form] = Form.useForm()

    useEffect(()=>{
        prop.chainSeq ? setChainSeq(prop.chainSeq) : null

    }, [prop] )

    function onChangeHandle() {
        setRegisterDto({
            nodeType: form.getFieldValue("nodeType"),
            ipAddress: form.getFieldValue("ipAddress"),
            chainSeq: chainSeq
        })
        console.log(registerDto)
    }
    function onClickHandle() {
        if (registerDto != null) {
            NodeApi.registerNode(registerDto).then(
                (ret) => {
                    window.location.href = `/${RouteName.CHAINS}/${RouteName.CHAIN_META_DATA}/${chainSeq}`
                }
            )
        }
    }

    return (
        <div>
            <SelectChain idSetter={setChainSeq} defaultId={prop.chainSeq} />
            <Form layout="vertical" form={form} onFieldsChange={onChangeHandle} onFinish={onClickHandle}>
                <Form.Item label="Node Type" name='nodeType'
                    rules={[{ required: true, message: 'Require Node Type' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="IP ADDRESS" name='ipAddress'
                    rules={[{ required: true, message: 'Require IP ADDRESS' }]}>
                    <Input type={"number"} />
                </Form.Item>

                <Button htmlType="submit" > REGISTER </Button>

            </Form>
        </div>
    )

}

export default Nodes

