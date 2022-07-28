import { RouteName } from "../constants"
import { Button, Form, Input } from "antd"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { ChainApi, PostChainDto } from "./apis/ChainApi"
import { DeployedContractApi } from "./apis/DeployedContractApi"
import { DeployedContracts } from "./Contracts"
import { NodeListDiv } from "./Nodes"
import { DetailView, TargListView, TargView } from "./utils/OutputDiv"

function Chains() {
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

    return (
    <div>
        {chainList.length !== 0 && <TargListView targList={chainList} />}
        <Button onClick={() => window.location.href = `${RouteName.REGISTER_CHAIN}`}> REGISTER </Button>
        
    </div>
    )
}

export default Chains

export function ChainByPropDiv(prop: { chainSeq: string }) {
    const [chain, setChain] = useState<ListViewChain>()
    const [deployedContractList, setDeployedContractList] = useState<DeployedContracts[]>([])
    useEffect(() => {
        if (prop.chainSeq != null) {
            ChainApi.getChain(prop.chainSeq)
                .then(res => {
                    setChain({
                        id: res.data.chainSeq,
                        chainId: res.data.chainId,
                        name: res.data.chainName,
                        rpcUrl: res.data.rpcUrl,
                    })
                })

                DeployedContractApi.getDeployedContracts({chainSeq : prop.chainSeq})
                .then(res => {
                    console.log(res.data)
                    setDeployedContractList(
                        res.data.map(item => {
                            return {
                                id: item.id,
                                contractName: item.contract.name,
                                serviceName: item.service.name,
                                chainId: item.chain.chainId,
                                address: item.address
                            }
                        })
                    )
                })
        }
    }, [prop.chainSeq])


    return (
        <div id="chain">
            {chain && <DetailView targ={chain} title="CHAIN" />}
            <hr></hr>
            {deployedContractList.length>0 && <TargListView targList={deployedContractList} title="DEPLOYED CONTRACTS" connectPath="contract/deployed"  />}
        </div>)
}

export function ChainDetailDiv() {
    const { chainSeq } = useParams()
    return (
        <div>
            {chainSeq && <ChainByPropDiv chainSeq={chainSeq} />}
            {chainSeq && <NodeListDiv chainSeq={chainSeq}/>}
            <Button onClick={()=>{window.location.href = `/${RouteName.NODES}/${RouteName.NODE_REGISTER}?chainSeq=${chainSeq}`}}> REGISTER NODE </Button>
        </div>
    )
}

export function RegisterChainDiv() {
    const [registerDto, setRegisterDto] = useState<PostChainDto>()
    const [form] = Form.useForm()

    function onChangeHandle() {
        setRegisterDto({
            chainName: form.getFieldValue("name"),
            chainId: form.getFieldValue("chainId"),
            rpcUrl: form.getFieldValue("rpcUrl"),
        })
    }
    function onClickHandle() {
        if (registerDto != null) {
            ChainApi.postChain(registerDto).then(
                (ret) => {
                    window.location.href = `/${RouteName.CHAINS}/${RouteName.CHAIN_META_DATA}`
                }
            )
        }
    }

    return(
        <div>
            <Form layout="vertical" form={form} onFieldsChange={onChangeHandle} onFinish={onClickHandle}>
                <Form.Item label="Chain Name" name='name'
                    rules={[{ required: true, message: 'Require Chain Name' }]}>
                    <Input/>
                </Form.Item>

                <Form.Item label="Chain ID" name='chainId'
                    rules={[{ required: true, message: 'Require Chain ID' }]}>
                    <Input type={"number"}/>
                </Form.Item>
                <Form.Item label="RPC URL" name='rpcUrl'
                    rules={[{ required: true, message: 'Require RPC URL' }]}>
                    <Input type={"url"}/>
                </Form.Item>

                <Button htmlType="submit" > REGISTER </Button>

            </Form>
        </div>
    )
}




