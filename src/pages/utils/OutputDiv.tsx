import {Table, Descriptions, Typography, Button} from "antd"
import {ColumnsType} from "antd/lib/table"
import {Dispatch, SetStateAction, useEffect, useState} from "react"
import {ELLIPSIS_COUNT} from "../../constants";

const {Paragraph, Text} = Typography;

type listProps = { targList: any[], connectPath?: string, title?: string }

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
            , {
                title: 'Detail',
                dataIndex: 'Detail',
                key: 'Detail',
                render(value, record, index) {
                    function onClickHandle() {
                        if (prop.connectPath)
                            window.location.href = `/${prop.connectPath}/${record.id}`
                        else
                            window.location.href = `${window.location.href}/${record.id}`
                    }

                    return (<Button onClick={onClickHandle}> See Detail </Button>)
                },
            }]
        )

    }, [prop.targList])

    return (
        <div>
            {prop.title && <h4>{prop.title}</h4>}
            <Table columns={columns} dataSource={data}/>
        </div>
    )
}


type targProps = { targ: any, title?: string }

export function TargView(prop: targProps) {
    const [columns, setColumns] = useState<ColumnsType<any[]>>([])
    const [data, setData] = useState<any>()

    useEffect(() => {
        prop.targ.key = prop.targ.id
        setData([prop.targ])
        setColumns(
            Object.keys(prop.targ).map(item => {
                return {
                    title: item,
                    dataIndex: item,
                    key: item,
                }
            }).filter(item => {
                return item.title !== 'key'
            })
        )


    }, [prop.targ])

    return (
        <div>
            <Table columns={columns} dataSource={data}/>
        </div>
    )


}

export function DetailView(prop: targProps) {

    const [ellipsis, setEllipsis] = useState(true);
    return (
        <Descriptions bordered title={prop.title}>
            {
                Object.entries(prop.targ).map((entry) => {
                    return (
                        <>
                            {(entry[0] && entry[1]) &&
                                <Descriptions.Item label={entry[0]} span={3}>
                                    <Paragraph
                                        ellipsis={ellipsis ? {rows: 3, expandable: true, symbol: 'more'} : false}>
                                        {entry[1] as string}
                                    </Paragraph>

                                </Descriptions.Item>}
                        </>
                    )
                })

            }
        </Descriptions>
    )

}

export function AccountDisplay(prop: { account?: string }) {
    //@TODO Add Link to Finder Link
    return (
        <Paragraph ellipsis={{expandable : false, suffix : '' }}>
            {(prop.account && (prop.account?.length > ELLIPSIS_COUNT*2)) && prop.account.slice(0, ELLIPSIS_COUNT) + '...' + prop.account.slice(-ELLIPSIS_COUNT)}
            {  ( prop.account && ( prop.account?.length < ELLIPSIS_COUNT*2 ) ) && prop.account }
        </Paragraph>
    )
}

export function ContractDisplay(prop: { account?: string }) {
    //@TODO Add Link to Finder Link
    return (
        <Paragraph ellipsis={{expandable : false, suffix : '' }}>
            {(prop.account && (prop.account?.length > ELLIPSIS_COUNT*2)) && prop.account.slice(0, ELLIPSIS_COUNT) + '...' + prop.account.slice(-ELLIPSIS_COUNT)}
            {  ( prop.account && ( prop.account?.length < ELLIPSIS_COUNT*2 ) ) && prop.account }
        </Paragraph>
    )
}




