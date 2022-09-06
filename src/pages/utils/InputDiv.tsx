import {UploadOutlined} from "@ant-design/icons";
import {Button, Form, Input, Select} from "antd";
import Table, {ColumnsType} from "antd/lib/table";
import Upload, {RcFile, UploadFile} from "antd/lib/upload";
import React, { Dispatch, SetStateAction, useEffect, useState} from "react";
import {ChainApi, GetChainDto} from "../apis/ChainApi";
import {ContractApi, GetContractDto} from "../apis/ContractApi";


export enum inputTypes {
    NORMAL,
    TEXTAREA,
    FILE,
    CONTRACT_TYPE
}

export interface InputType {
    key: string,
    type: inputTypes
}


type targProps = { targ: any, setTarg: Dispatch<SetStateAction<any>> }

export function InputTargDiv(prop: targProps) {
    const [keys, setKeys] = useState<string[]>([])

    useEffect(() => {
        let tmpKeys: string[] = []
        tmpKeys = tmpKeys.concat(Object.keys(prop.targ))
        setKeys(tmpKeys)
    }, [prop.targ])

    function onChangeHandle(e: React.ChangeEvent<HTMLTextAreaElement>) {
        prop.targ[e.target.id] = e.target.value
        prop.setTarg(prop.targ)
    }

    return (
        <Form layout="vertical">
            {keys.map(item => {
                return (
                    <Form.Item label={item} key={item} name={item}>
                        <Input></Input>
                    </Form.Item>
                )
            })}
        </Form>
    )

}


type radioProp = { targList: any[], setTarg?: Dispatch<SetStateAction<number>>, defaultId?: string, callBack?: Function }

export function RadioTargListDiv(prop: radioProp) {
    const [columns, setColumns] = useState<ColumnsType<any>>([])
    const [data, setData] = useState<any[]>([])
    const [keys, setKeys] = useState<string[]>([])
    const groupNumber = Math.random()

    useEffect(() => {

        setData(prop.targList.map(item => {
            item.key = item.id
            return item
        }))
        setColumns(
            Object.keys(prop.targList[0]).map(item => {
                return {
                    title: item,
                    dataIndex: item,
                    key: item
                }
            }).filter(item => {
                return item.title !== 'key'
            })
        )
    }, [prop])

    return (
        <>
            <Table columns={columns} dataSource={data} rowSelection={{
                type: "radio",
                onChange: (key, row) => {
                    if (prop.setTarg)
                        prop.setTarg(parseInt(key.toString()))
                    if (prop.callBack)
                        prop.callBack()
                },
                defaultSelectedRowKeys: prop.defaultId ? [parseInt(prop.defaultId)] : undefined,

            }}/>
        </>
    )
}


export function readJsonFileByUrl(fileData: RcFile): Promise<any> {

    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
        fileReader.onloadend = () => {
            resolve(JSON.parse(fileReader.result as string));
        }

        return new Promise((resolve, reject) => {
            fileReader.onerror = () => {
                fileReader.abort();
                reject(null);
            };


            fileReader.readAsText(fileData);
        })
    })
}

export function JsonChooseDiv(props: any) {
    let isRemoved: boolean = false;


    async function onChangeHandleURL(targFile: UploadFile) {
        if (!isRemoved)
            props.setJsonFile(await readJsonFileByUrl(targFile.originFileObj!!))
        isRemoved = false
        targFile.status = "success"
    }

    async function onRemoveHandle() {
        props.setJsonFile([])
        isRemoved = true
    }


    return (
        <div>
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
        </div>
    )
}

export function ChainSelector(prop: {chainSeq ?: string, setChainSeq: Dispatch<SetStateAction<string>> }) {
    const [chainList, setChainList] = useState<GetChainDto[]>([])
    useEffect(() => {
        ChainApi.getChainList().then(res => {
            setChainList(res.data)
            if(prop.chainSeq == null || prop.chainSeq == '')
                prop.setChainSeq(res.data[0].seq)
        })

    }, [prop])

    const onChangeHandle = (selectedId : string)=>{
        prop.setChainSeq(selectedId)
    }

    return (
        <>
            {chainList.length > 0 &&
                <Select
                    style={{width : 150}}
                    onChange={onChangeHandle}
                    defaultValue={chainList[0].name}
                >
                    {chainList.map(item => {
                        return (
                            <Select.Option  key={item.seq} value={item.seq} >
                                {item.name} <br/> {item.chainId}
                            </Select.Option>
                        )
                    })}
                </Select>
            }
        </>
    )
}

export function ContractSelector(prop : {contractId ?: string , setContractId : Dispatch<SetStateAction<string>>}){
    const [contractList, setContractList] = useState<GetContractDto[]>([])
    useEffect( ()=>{
        ContractApi.getContractList().then(res =>{
            setContractList(res.data)
            if(prop.contractId == null || prop.contractId == '')
                prop.setContractId(res.data[0].id)
        })
    } , [prop])

    const onChangeHandle = (selectedId : string)=>{
        console.log(selectedId)
        prop.setContractId(selectedId)
    }

    return(
        <>
            {contractList.length > 0 &&
                <Select
                    style={{width: 150}}
                    onChange={onChangeHandle}
                    defaultValue={contractList[0].name}
                >

                    {contractList.map(item => {
                        return (
                            <Select.Option key={item.id} value={item.id}>
                                {item.name} <br/> {item.contractType.name}
                            </Select.Option>
                        )
                    })}

                </Select>
            }
        </>
    )
}

