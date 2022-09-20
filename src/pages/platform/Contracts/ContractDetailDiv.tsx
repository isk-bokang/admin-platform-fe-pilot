import React, {useEffect, useState} from "react";
import {ContractApi} from "@/pages/apis/ContractApi";
import {DetailView} from "@/pages/utils/OutputDiv";
import {AbiItem} from "web3-utils";
import {Button, Collapse} from "antd";
import Table from "antd/lib/table";
import {useParams} from "react-router-dom";
import {ContractDetail, RoleAttributeType} from "@/types/types";

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
            <h4>METHODS</h4>
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

export function RolesDiv(prop: { contractId: string }) {
    const [roleList, setRoleList] = useState<RoleAttributeType[]>([])
    useEffect(() => {
        ContractApi.getContractRoles(prop.contractId).then(ret => {
            setRoleList(ret.data.map(item => {
                return {
                    key: item.id!!,
                    name: item.name!!,
                    onChainName: item.onChainName!!
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


    return (
        <div>
            <h4>ROLES</h4>
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

            {contractId && <RolesDiv contractId={contractId}/>}
            <hr/>

            {contractId && <MethodListDiv contractId={contractId}/>}
        </>
    )
}