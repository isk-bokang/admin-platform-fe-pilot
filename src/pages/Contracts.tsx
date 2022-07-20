import { RouteName } from "../constants"
import { Button, Form, Input, Select } from "antd"
import { RuleObject } from "antd/lib/form"
import TextArea from "antd/lib/input/TextArea"
import { Option } from "antd/lib/mentions"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { GetChainDto } from "./apis/ChainApi"
import { ContractApi, GetContractDto, PostContractDto } from "./apis/ContractApi"
import { ContractDeployApi } from "./apis/ContractDeployApi"
import { GetServiceDto } from "./apis/ServiceApi"
import { InputTargDiv, InputType, inputTypes } from "./utils/InputDiv"
import { DetailView, TargListView, TargView } from "./utils/OutputDiv"

function Contracts() {
    return (
        <div> Contracts </div>
    )
}

export interface DeployedContracts {
    id: string
    contractName: string
    serviceName: string
    chainId: string
    address: string
}

export function DeployedContractListDiv() {
    const [deployedContractList, setDeployedContractList] = useState<DeployedContracts[]>([])

    useEffect(() => {
        ContractDeployApi.getDeployedContracts()
            .then(res => {
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

    }, [])

    return (<div>
        {deployedContractList.length !== 0 && <TargListView targList={deployedContractList} />}
        <Button onClick={() => window.location.href = `/${RouteName.DEPLOY_CONTRACT}`}> DEPLOY </Button>
    </div>)
}

export interface ListViewContract {
    id: string
    name: string
    contractType: string
}

export function ContractListDiv() {
    const [contractList, setContractList] = useState<ListViewContract[]>([])

    useEffect(() => {
        ContractApi.getContractList()
            .then(res => {
                setContractList(
                    res.data.map((item) => {
                        return {
                            id: item.id,
                            name: item.name,
                            contractType: item.contractType
                        }
                    })
                )
            })
    }, [])

    return (
        <div>
            {contractList.length !== 0 && <TargListView targList={contractList} />}
            <Button onClick={() => window.location.href = `${RouteName.REGISTER_CHAIN}`}> REGISTER </Button>
        </div>
    )

}

export function RegisterContractDiv() {
    const [registerDto, setRegisterDto] = useState<PostContractDto>(new PostContractDto())
    const [form] = Form.useForm()

    function onChangeHandle() {
        setRegisterDto({
            name: form.getFieldValue("name"),
            bytecode: form.getFieldValue("bytecode"),
            contractType: form.getFieldValue("contractType"),
            abi: form.getFieldValue('abi')
        })
    }

    function onClickHandle() {
        ContractApi.postContract(registerDto).then(
            (ret) => {
                window.location.href = `/${RouteName.CONTRACTS}/${RouteName.CONTRACT_META_DATA}`
            }
        )
    }


    async function validAbi(rule: RuleObject, value: any) {
        try {
            JSON.parse(value)
        }
        catch {
            throw new Error("ABI must be JSON")
        }
        return true
    }

    return (
        <div>
            <Form layout="vertical" form={form} onFieldsChange={onChangeHandle} onFinish={onClickHandle}>
                <Form.Item label="Name" name='name'
                    rules={[{ required: true, message: 'Require Name' }]}>
                    <Input></Input>
                </Form.Item>
                <Form.Item label="Contract Type" name='contractType'
                    rules={[{ required: true, message: 'Require Contract Type' }]} >
                    <Select>
                        <Select.Option value='ERC20'> ERC 20 </Select.Option>
                        <Select.Option value='ERC1155'> ERC 1155 </Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="ABI" name='abi'
                    rules={[{ required: true, message: 'ABI Must Be JSON', validator: validAbi }]}>
                    <TextArea></TextArea>
                </Form.Item>
                <Form.Item label="ByteCode" name='bytecode'
                    rules={[{ required: true, message: 'Require ByteCode' }]}>
                    <Input></Input>
                </Form.Item>

                <Button htmlType="submit" > REGISTER </Button>

            </Form>
        </div>
    )
}


export function ContractByPropDiv(prop: { contractId: string, needDownload ?: boolean }) {

    const [contract, setContract] = useState<any>()

    useEffect(() => {
        if (prop.contractId != null) {
            ContractApi.getContract(prop.contractId)
                .then(res => {
                    setContract({
                        id: res.data.id,
                        name: res.data.name,
                        contractType: res.data.contractType,
                        bytecode: res.data.bytecode,
                        abi: res.data.abi
                    })
                })
        }
    }, [prop.contractId])


    return (
        <div id="contract">
            {contract && <DetailView targ={contract} title="CONTRACT" />}
            {(contract && prop.needDownload) && <DownloadContract abi={contract.abi} bytecode={contract.bytecode} />}
        </div>)
}

export function ContractDetailDiv() {
    const { contractId } = useParams()
    return (
        <>
            {contractId && <ContractByPropDiv contractId={contractId} needDownload = {true} />}
        </>
    )
}


interface DeployedContractDetail {
    deployedId: string,
    address: string
}

export function DeployedContractByPropDiv(prop: { deployedId: string }) {
    const [deployedContract, setDeployedContract] = useState<DeployedContractDetail>()
    const [chainInfo, setChainInfo] = useState<GetChainDto>()
    const [serviceInfo, setServiceInfo] = useState<GetServiceDto>()
    const [contractInfo, setContractInfo] = useState<GetContractDto>()
    useEffect(() => {
        if (prop.deployedId != null) {
            ContractDeployApi.getDeployedCotract(prop.deployedId)
                .then(res => {
                    setChainInfo(res.data.chain)
                    setServiceInfo(res.data.service)
                    setContractInfo(res.data.contract)
                    setDeployedContract(
                        {
                            deployedId: res.data.id,
                            address: res.data.address
                        }
                    )
                })
        }
    }, [prop.deployedId])

    return (
        <>
            {deployedContract && <DetailView targ={deployedContract} title="DEPLOYED CONTRACT" />}
            {contractInfo && <DetailView targ={contractInfo} title="CONTRACT" />}
            {chainInfo && <DetailView targ={chainInfo} title="CHAIN" />}
            {serviceInfo && <DetailView targ={serviceInfo} title="SERVICE" />}

        </>
    )
}

export function DeployedDetailDiv() {
    const { deployedId } = useParams()
    return (
        <div>
            {deployedId && <DeployedContractByPropDiv deployedId={deployedId} />}
        </div>
    )
}

export function DownloadContract(prop: { abi: string, bytecode: string }) {
    const [inputDataStr, setInputDataStr] = useState<string>('')
    const [url, setUrl] = useState<string>('')
    useEffect(() => {
        var jsonData = JSON.parse(`{ "abi" : ${prop.abi} } `)
        jsonData['bytecode'] = prop.bytecode
        const strJsonData = JSON.stringify(jsonData, null, 2)
        setInputDataStr(strJsonData)
        const bytes = new TextEncoder().encode(strJsonData);
        let blob = new Blob([bytes.buffer], { type: "application/json;charset=utf-8" });
        setUrl(URL.createObjectURL(blob))
    }, [prop])

    return (
        <>
            {inputDataStr &&
                <a href={url} download> <Button onClick={() => console.log(url)}> Click to Download ABI </Button> </a>
            }
        </>
    )

}



export default Contracts
