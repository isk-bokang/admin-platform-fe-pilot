import Table, { ColumnsType } from "antd/lib/table";
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";




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
        <div>
            <table border={1} style={{ alignItems: "left" }}  >
                <tbody>
                    {
                        keys.map(key => {
                            return (
                                <tr key={key + '_tr'}>
                                    <th id={key + '_th'}>{key}</th>
                                    <td id={key + 'td'} key={key + 'td'}> <textarea id={key} onChange={onChangeHandle} /> </td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>
        </div>
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


