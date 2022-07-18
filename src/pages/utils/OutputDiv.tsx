

import { Table, Descriptions, Typography, Button } from "antd"

import { ColumnsType } from "antd/lib/table"
import { useEffect, useState } from "react"
const { Paragraph, Text } = Typography;

type listProps = { targList: any[] }

export function TargListView(prop: listProps) {
    const [columns, setColumns] = useState<ColumnsType<any>>([])
    const [data, setData] = useState<any[]>([])

    useEffect(() => {
        setData(prop.targList.map(item => {
            item.key = item.id
            return item
        }))
        setColumns([...
            Object.keys(prop.targList[0]).map(item => {
                return {
                    title: item,
                    dataIndex: item,
                    key: item,
                }
            }).filter(item => {
                return item.title !== 'key'
            })
        ,{
            title: 'Detail',
            dataIndex: 'Detail',
            key: 'Detail',
            render(value, record, index) {
                function onClickHandle(){
                    window.location.href =record.id
                }
                return(<Button onClick={onClickHandle}> See Detail </Button>)
            },
        }]
        )

    }, [prop.targList])

    return (
        <div>
            <Table columns={columns} dataSource={data}/>
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
                    key: item,
                    render :  text => <a> {item} </a>
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

export function DetailView(prop: targProps){

    const [ellipsis, setEllipsis] = useState(true);
    return(
        <Descriptions bordered>
            {
                Object.entries(prop.targ).map((entry) =>{
                    return(
                        <>
                        {(entry[0] && entry[1]) && 
                        <Descriptions.Item label={entry[0]} span={3} > 
                        <Paragraph ellipsis={ellipsis ? { rows: 2, expandable: true, symbol: 'more' } : false}>
                            {entry[1]}
                        </Paragraph>
                        
                         </Descriptions.Item>}
                         </>
                    )
                })
                
            }
        </Descriptions >
    )

}

