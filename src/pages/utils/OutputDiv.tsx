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
    const [columns, setColumns] = useState<ColumnsType<any[]>>([])
    const [data, setData] = useState<any>()

    useEffect(() => {
        prop.targ.key = prop.targ.id
        setData( [prop.targ] )
        setColumns(
            Object.keys(prop.targ).map(item => {
                return {
                    title: item,
                    dataIndex: item,
                    key: item
                }
            }).filter(item =>{
                return item.title !== 'key'
            })
        )
    }, [prop.targ])

    return (
        <div>
            <Table columns={columns} dataSource={data}  />
        </div>
    )


}

