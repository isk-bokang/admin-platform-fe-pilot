import {CONTRACT_TYPES, RouteName, toUpperCase_Custom, validateHexString} from "../constants"
import {Button, Form, Input, Select, Upload, UploadFile, Collapse, Popconfirm} from "antd"
import {RuleObject} from "antd/lib/form"
import TextArea from "antd/lib/input/TextArea"
import React, {useEffect,  useState} from "react"
import {useParams} from "react-router-dom"
import {GetChainDto} from "./apis/ChainApi"
import {ContractApi, ContractRoleDto, GetContractDto, PostContractDto} from "./apis/ContractApi"
import {DeployedContractApi} from "./apis/DeployedContractApi"
import {GetServiceDto} from "./apis/ServiceApi"
import {ChainSelector, ContractSelector, readJsonFileByUrl} from "./utils/InputDiv"
import {DetailView, TargListView} from "./utils/OutputDiv"
import {UploadOutlined} from "@ant-design/icons"
import {AbiItem} from "web3-utils";
import Table from "antd/lib/table";

function Contracts() {
    return (
        <div> Contracts </div>
    )
}

export interface DeployedContracts {
    id: string
    contractName: string
    contractType?: string
    serviceName?: string
    chainName: string
    address: string
}

export function DeployedContractListDiv() {
    const [deployedContractList, setDeployedContractList] = useState<DeployedContracts[]>([])

    useEffect(() => {
        DeployedContractApi.getDeployedContracts()
            .then(res => {
                console.log(res.data)
                setDeployedContractList(
                    res.data.map(item => {
                        return {
                            id: item.id,
                            contractName: item.contract.name,
                            contractType: item.contract.contractType.name,
                            serviceName: item.gameApp ? item.gameApp.name : 'ISKRA',
                            chainName: item.chain.name,
                            address: item.address
                        }
                    })
                )
            })

    }, [])

    return (<div>
        {deployedContractList.length !== 0 && <TargListView targList={deployedContractList}/>}
        <Button onClick={() => window.location.href = `/${RouteName.DEPLOY_CONTRACT}`}> DEPLOY </Button>
    </div>)
}

export interface ListViewContract {
    id: string
    name: string
    contractType?: string
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
                            contractType: item.contractType.name
                        }
                    })
                )
            })
    }, [])

    return (
        <div>
            {contractList.length !== 0 && <TargListView targList={contractList}/>}
            <Button onClick={() => window.location.href = `${RouteName.REGISTER_CHAIN}`}> REGISTER </Button>
        </div>
    )

}


interface RoleAttributeType{
    key : number;
    onChainName : string
    name : string
}
export function RegisterContractDiv() {
    const [registerDto, setRegisterDto] = useState<PostContractDto>()
    const [roleOfContracts, setRoleOfContracts] = useState<RoleAttributeType[]>([])
    const [form] = Form.useForm()
    let isRemoved: boolean = false;


    function extractRoles(abi: AbiItem[]) {
        setRoleOfContracts(
            abi.filter(item => {
                if (item.name && item.type == "function" && item.inputs?.length == 0 && item.outputs?.length == 1 && item.outputs[0].type == "address") {
                    return true
                }
            }).map((item, idx)=>{
                return {
                    key : idx,
                    name : toUpperCase_Custom('_', item.name!!),
                    onChainName : item.name!!
                }
            }))
    }

    const handleDelete = (key: React.Key) => {
        const newData = roleOfContracts.filter((item) => item.key !== key);
        setRoleOfContracts(newData);
    };
    const handleSave = (newName : string, key : number) => {
        let newData = [...roleOfContracts]
        newData.forEach(item=>{
            if(item.key == key)
                item.name = newName
        })
        console.log(newData)
        console.log(roleOfContracts)
        setRoleOfContracts(newData);
    };

    const columns = [
        {
            key: 1,
            title: "NAME",
            dataIndex: 'name',
            editable: true,
            render : (_, record : RoleAttributeType) =>(
                <Input defaultValue={record.name} onChange={(e)=> {
                    handleSave(e.target.value, record.key)
                }} />
            ),

        },
        {
            key: 2,
            title: "ON CHAIN NAME",
            dataIndex: 'onChainName',
        },
        {
            key: 3,
            title: "ACTION",
            dataIndex: 'action',
            render: (_, record: { key: React.Key }) =>
                roleOfContracts.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ]

    function onChangeHandle() {
        try {
            const retAbi: AbiItem[] = JSON.parse(form.getFieldValue('abi'))
            setRegisterDto({
                name: form.getFieldValue("name"),
                bytecode: form.getFieldValue("bytecode"),
                contractType: CONTRACT_TYPES[form.getFieldValue("contractType")],
                abi: retAbi
            })
        } catch {
            setRegisterDto({
                name: form.getFieldValue("name"),
                bytecode: form.getFieldValue("bytecode"),
                contractType: form.getFieldValue("contractType"),
                abi: []
            })
        }

    }

    function onFinishHandle() {
        console.log(roleOfContracts)
        if (registerDto)
            ContractApi.postContract(registerDto).then(
                (ret) => {
                    (ret.data.id)
                    roleOfContracts.map(item =>{
                        ContractApi.postContractRoles(ret.data.id, {
                            onChainName : item.onChainName,
                            name : item.name
                        }).then(()=>{
                            window.location.href = `/${RouteName.CONTRACTS}/${RouteName.CONTRACT_META_DATA}`
                        })
                    })
                }
            )
    }

    function onChangeHandleURL(targFile: UploadFile) {
        if (!isRemoved && targFile.originFileObj) {
            try {
                readJsonFileByUrl(targFile.originFileObj)
                    .then(res => {
                        if (res['abi']) {
                            form.setFieldsValue({abi: JSON.stringify(res['abi'])})
                            console.log('upload')
                            extractRoles(res['abi'])
                        } else {
                            form.setFieldsValue({abi: ''})
                        }
                        if (res['bytecode']) {
                            form.setFieldsValue({bytecode: res['bytecode']})
                        } else {
                            form.setFieldsValue({bytecode: ''})
                        }
                        if (res['abi'] == null && res['bytecode'] == null) {
                            alert("INVALID FORMAT \n NEED CHCECK")
                        }

                        onChangeHandle()
                    })


            } catch {

            }
        }
        isRemoved = false
        targFile.status = "success"
    }

    async function onRemoveHandle() {
        isRemoved = true
    }


    async function validAbi(rule: RuleObject, value: any) {
        try {
            JSON.parse(value)
        } catch {
            return false
        }
        return true
    }

    return (
        <div>
            {CONTRACT_TYPES.length > 0 &&
                <Form layout="vertical" form={form} onFieldsChange={onChangeHandle} onFinish={onFinishHandle}>
                    <Form.Item label="Name" name='name'
                               rules={[{required: true, message: 'Require Name'}]}>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item label="Contract Type" name='contractType'
                               rules={[{required: true, message: 'Require Contract Type'}]}>
                        <Select>
                            {
                                CONTRACT_TYPES.map((item, idx) => {
                                    return (
                                        <Select.Option value={idx} key={item.id}> {item.name} </Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="ABI" name='abi'
                               rules={[{required: true, message: 'ABI Must Be JSON', validator: validAbi}]}>
                        <TextArea></TextArea>
                    </Form.Item>
                    <Form.Item label="ByteCode" name='bytecode'
                               rules={[{required: true, message: 'Require ByteCode'}]}>
                        <Input></Input>
                    </Form.Item>

                    <Upload
                        accept=".json"
                        action={''}
                        maxCount={1}
                        onChange={(info) => onChangeHandleURL(info.file)}
                        onRemove={() => {
                            onRemoveHandle()
                        }}
                    >
                        <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                    </Upload>
                    <br/>
                    <h3>ROLES</h3>
                    <Table columns={columns} dataSource={roleOfContracts}/>

                    <Button htmlType="submit"> REGISTER </Button>
                </Form>}
        </div>
    )
}




interface ContractDetail {
    contractId: string,
    name: string,
    contractType?: string,
    abi: string,
    bytecode: string
}

export function ContractByPropDiv(prop: { contractId: string, needDownload?: boolean }) {

    const [contract, setContract] = useState<ContractDetail>()

    useEffect(() => {
        if (prop.contractId != null) {
            ContractApi.getContract(prop.contractId)
                .then(res => {
                    setContract({
                        contractId: res.data.id,
                        name: res.data.name,
                        contractType: res.data.contractType.name,
                        abi: JSON.stringify(res.data.abi),
                        bytecode: res.data.bytecode,
                    })
                })
        }
    }, [prop.contractId])


    return (
        <div id="contract">
            {contract && <DetailView targ={contract} title="CONTRACT"/>}
            {(contract && prop.needDownload) &&
                <DownloadContract abi={contract.abi} bytecode={contract.bytecode}/>}
        </div>)
}

function MethodListDiv(prop: { contractId: string }) {
    const [methodList, setMethodList] = useState<AbiItem[]>([])
    useEffect(() => {
        ContractApi.getContract(prop.contractId).then(ret => {
            setMethodList(ret.data.abi)
        })
    }, [prop])


    return (
        <>
            {
                methodList.length > 0 &&
                <Collapse style={{whiteSpace: 'pre'}}>
                    {
                        methodList.map((item, idx) => {
                            return (
                                <Collapse.Panel
                                    header={item.type.toLowerCase() == 'constructor' ? item.type.toUpperCase() : item.name}
                                    key={idx}>
                                    {JSON.stringify(item, null, 2)}
                                </Collapse.Panel>
                            )
                        })
                    }
                </Collapse>
            }
        </>
    )

}

function RolesDiv(prop : {contractId: string}){
    const [roleList, setRoleList] = useState<RoleAttributeType[]>([])
    useEffect(()=>{
        ContractApi.getContractRoles(prop.contractId).then(ret =>{
            setRoleList(ret.data.map(item=>{
                return{
                    key : item.id!!,
                    name : item.name!!,
                    onChainName : item.onChainName!!
                }
            }))
        })
    }, [])


    const columns = [
        {
            key: 1,
            title: "ID",
            dataIndex: 'key',

        },
        {
            key: 2,
            title: "NAME",
            dataIndex: 'name',

        },
        {
            key: 3,
            title: "ON CHAIN NAME",
            dataIndex: 'onChainName',
        }
    ]


    return(
        <div>
            <Table columns={columns} dataSource={roleList}/>
        </div>
    )
}

export function ContractDetailDiv() {
    const {contractId} = useParams()
    return (
        <>
            {contractId && <ContractByPropDiv contractId={contractId} needDownload={true}/>}
            <hr/>
            <h4>ROLES</h4>
            {contractId && <RolesDiv contractId={contractId}/>}
            <hr/>
            <h4>METHODS</h4>
            {contractId && <MethodListDiv contractId={contractId}/>}
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
            DeployedContractApi.getDeployedCotract(prop.deployedId)
                .then(res => {
                    setChainInfo(res.data.chain)
                    setServiceInfo(res.data.gameApp)
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
            {deployedContract && <DetailView targ={deployedContract} title="DEPLOYED CONTRACT"/>}
            {contractInfo && <DetailView targ={contractInfo} title="CONTRACT"/>}
            {chainInfo && <DetailView targ={chainInfo} title="CHAIN"/>}
            {serviceInfo && <DetailView targ={serviceInfo} title="SERVICE"/>}

        </>
    )
}

export function DeployedDetailDiv() {
    const {deployedId} = useParams()
    return (
        <div>
            {deployedId && <DeployedContractByPropDiv deployedId={deployedId}/>}
        </div>
    )
}

export function DownloadContract(prop: { abi: string, bytecode: string }) {
    const [url, setUrl] = useState<string>('')
    useEffect(() => {
        var jsonData = JSON.parse(`{ "abi" : ${prop.abi} } `)
        jsonData['bytecode'] = prop.bytecode
        const strJsonData = JSON.stringify(jsonData, null, 2)
        const bytes = new TextEncoder().encode(strJsonData);
        let blob = new Blob([bytes.buffer], {type: "application/json;charset=utf-8"});
        setUrl(URL.createObjectURL(blob))
    }, [prop])

    return (
        <>
            {url !== '' &&
                <a href={url} download> <Button onClick={() => console.log(url)}> Click to Download ABI </Button> </a>
            }
        </>
    )

}

export function RegisterDeployedContract() {
    const [form] = Form.useForm()
    const [chainSeq, setChainSeq] = useState('')
    const [contractId, setContractId] = useState('')

    function onFinishHandle() {
        DeployedContractApi.postRegisterDeployedContract({
            // @TODO Change AppId And DeployerAddress
            appId: '1',
            contractId: contractId,
            chainSeq: chainSeq,
            contractName: form.getFieldValue('name'),
            contractAddress: form.getFieldValue('contractAddress'),
            deployerAddress: '0x00'
        })
            .then(() => {
                console.log({
                    // @TODO Change AppId And DeployerAddress
                    appId: '1',
                    contractId: contractId,
                    chainSeq: chainSeq,
                    contractName: form.getFieldValue('name'),
                    contractAddress: form.getFieldValue('contractAddress'),
                    deployerAddress: '0x00'
                })
                alert("DONE")
            })
            .catch(err => {
                console.error(err)
                console.log({
                    // @TODO Change AppId And DeployerAddress
                    appId: '1',
                    contractId: contractId,
                    chainSeq: chainSeq,
                    contractName: form.getFieldValue('name'),
                    contractAddress: form.getFieldValue('contractAddress'),
                    deployerAddress: '0x00'
                })
                alert('Error Occurred')
            })

    }

    return (
        <div>
            <Form
                requiredMark={true}
                layout={"vertical"}
                onFinish={onFinishHandle}
                form={form}
                onChange={() => {
                    console.log(contractId)
                }}>
                <Form.Item label={'Name'} name={'name'} rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label={'Contract'}>
                    <ContractSelector contractId={contractId} setContractId={setContractId}/>
                </Form.Item>

                <Form.Item label={'Chain'}>
                    <ChainSelector chainSeq={chainSeq} setChainSeq={setChainSeq}/>
                </Form.Item>

                <Form.Item label={'Contract Address'} name={'contractAddress'}
                           rules={[{required: true}, {type: 'string', min: 41, message: 'too short'}, {
                               validator: validateHexString
                           }]}>
                    <Input/>
                </Form.Item>

                <Button htmlType={"submit"}> SUBMIT</Button>
            </Form>
        </div>
    )
}


export default Contracts
