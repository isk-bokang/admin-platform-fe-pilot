import { Table } from "antd"
import { ColumnsType } from "antd/lib/table"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

type listProps = { targList: any[] }

export function TargListView(prop: listProps) {
    const [columns, setColumns] = useState<ColumnsType<any>>([])
    const [data, setData] = useState<any[]>([])

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

    return (
        <div>
            <Table columns={columns} dataSource={data} />
        </div>
    )
}


type targProps = { targ: any }

export function TargView(prop: targProps) {
    const [keys, setKeys] = useState<string[]>([])

    useEffect(() => {
        let tmpKeys: string[] = []
        tmpKeys = tmpKeys.concat(Object.keys(prop.targ))
        setKeys(tmpKeys)
    }, [prop.targ])

    return (
        <div>
            <table border={1} style={{ alignItems: "left" }}>{
                keys.map(key => {
                    return (
                        <tr>
                            <th>{key}</th>
                            <td align={"left"}>{prop.targ[key]}</td>
                        </tr>
                    )
                })}
            </table>
        </div>
    )


}

