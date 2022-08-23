import {Form, Input, Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {useState} from 'react';
import {PlatformWalletInfo} from "../apis/WalletApi";

const NONE = -1

const dummyData: PlatformWalletInfo[] = [{
    name: 'asd',
    id: 1,
    walletAddress: 'wallet address1',
    walletContractInfoList: [
        {
            contractId: 1,
            contractAddress: "contract1",
            contractType: "contract1",
            contractName: "contract1",
            role: "qweqwe",
            roleId: 1
        },
        {
            contractId: 2,
            contractAddress: "contract1",
            contractType: "contract1",
            contractName: "contract1",
            role: "qweqwe",
            roleId: 2
        }
    ]
},
    {
        name: 'asd',
        id: 2,
        walletAddress: 'wallet address2',
        walletContractInfoList: [
            {
                contractId: 1,
                contractAddress: "contract1",
                contractType: "contract1",
                contractName: "contract1",
                role: "qweqwe",
                roleId: 3
            },
            {
                contractId: 2,
                contractAddress: "contract2",
                contractType: "contract2",
                contractName: "contract2",
                role: "qweqwe",
                roleId: 4
            }
        ]
    }]

export function WalletListDiv() {

    const [form] = Form.useForm();
    const [data, setData] = useState<PlatformWalletInfo[]>(dummyData);
    const [editingKey, setEditingKey] = useState<number>(NONE);

    const isEditing = (record: AttributeType) => record.key === editingKey;

    interface AttributeType {
        key?: number;
        id?: number,
        name?: string,
        walletAddress?: string,
        contractAddress?: string,
        contractName?: string,
        role?: string,
        contractType?: string,
        spanCnt?: number
    }

    function edit( record: Partial<AttributeType> & { key: React.Key }) {
        form.setFieldsValue({ walletAddress : '', contractAddress : '', contractName : '', role : '', ...record });
        setEditingKey(record.key);
    }

    function cancel () {
        setEditingKey(NONE);
    };

    function generateData() {
        let ret: AttributeType[] = []
        for (const item of data) {
            let commonData: AttributeType = {
                id: item.id,
                name: item.name,
                walletAddress: item.walletAddress,
                spanCnt: item.walletContractInfoList.length
            }
            for (const jtem of item.walletContractInfoList) {
                let retItem: AttributeType = JSON.parse(JSON.stringify(commonData))
                retItem.key = jtem.roleId
                retItem.contractAddress = jtem.contractAddress
                retItem.contractName = jtem.contractName
                retItem.contractType = jtem.contractType
                retItem.role = jtem.role
                ret.push(retItem)
                commonData.spanCnt = 0
            }
        }
        return ret
    }

    function onCellHandle(record) {
        return {rowSpan: record.spanCnt}
    }

    interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
        editing: boolean;
        dataIndex: string;
        title: string;
        record: AttributeType;
        index: number;
        children: React.ReactNode;
        key: number
    }

    function EditableCell(prop: EditableCellProps) {

        const inputNode =  <Input />;

        return (
            <td {...prop}>
                {prop.editing ? (
                    <Form.Item
                        name={prop.dataIndex}
                        style={{margin: 0}}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${prop.title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    prop.children
                )}
            </td>
        );
    }

    const columns = [
        {
            key: 1,
            title: "ID",
            dataIndex: 'id',
            editable : false,
            onCell: onCellHandle
        },
        {
            key: 2,
            title: "Wallet Name",
            dataIndex: 'name',
            editable : false,
            onCell: onCellHandle
        },
        {
            key: 3,
            title: "Wallet Address",
            dataIndex: 'walletAddress',
            editable : false,
            onCell: onCellHandle
        },
        {
            key: 4,
            title: "Contract Address",
            dataIndex: 'contractAddress',
            editable : true,
        },
        {
            key: 5,
            title: "Contract Name",
            dataIndex: 'contractName',
            editable : true,
        },
        {
            key: 6,
            title: "Contract Type",
            dataIndex: 'contractType',
            editable : true,

        },
        {
            key: 7,
            title: "Role",
            dataIndex: 'role',
            editable : true,
        },
    ]

    return (
        <div>
            <Table columns={columns} bordered dataSource={generateData()}/>
        </div>
    )
}
