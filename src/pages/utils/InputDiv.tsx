import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import Table, { ColumnsType } from "antd/lib/table";
import Upload, { RcFile, UploadFile } from "antd/lib/upload";
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";



export enum inputTypes {
    NORMAL,
    TEXTAREA,
    FILE,
    CONTRACT_TYPE
}

export interface InputType {
    key : string,
    type : inputTypes
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
            {keys.map( item=>{
                return(
                    <Form.Item label = {item} key={item} name={item} >
                        <Input></Input>
                    </Form.Item>
                )
            } )}
        </Form>
    )

}


type radioProp = { targList: any[], setTarg: Dispatch<SetStateAction<string>> }

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
            }).filter(item =>{
                return item.title !== 'key'
            })
        )
    }, [prop.targList])

    function onChangeHandle(e : ChangeEvent<HTMLInputElement>){
        prop.setTarg(e.target.value)
        
    }


    return (
        <Table columns={columns} dataSource={data} rowSelection={{
            type : "radio",
            onChange : (key, row)=>{
                prop.setTarg(key.toString())
            }
        }} />
    )

}


export function JsonChooseDiv(props : any){
    let isRemoved : boolean = false;

    function readJsonFileByUrl(fileData: RcFile) {

        const fileReader = new FileReader();
    
        return new Promise( (resolve, reject) => {
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

    async function onChangeHandleURL(targFile : UploadFile){
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
                onRemove={() => { onRemoveHandle() }}
            >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
        </div>
    )
}
