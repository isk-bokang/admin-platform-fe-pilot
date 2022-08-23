import {Table} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React from 'react';
import {PlatformWalletInfo} from "../apis/WalletApi";

export function WalletListDiv() {

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

    interface DataType {
        key ?: number;
        id ?: number,
        name ?: string,
        walletAddress : string,
        contractAddress ?: string,
        contractName ?: string,
        role ?: string,
        contractType ?: string,
        spanCnt ?: number
    }

    function generateData(originData : PlatformWalletInfo[]){
        let ret : DataType[] = []
        for(const item of originData){
            let commonData : DataType ={
                id : item.id,
                name : item.name,
                walletAddress : item.walletAddress,
                spanCnt : item.walletContractInfoList.length
            }
            for(const jtem of item.walletContractInfoList){
                let retItem : DataType = JSON.parse(JSON.stringify(commonData))
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

    function onCellHandle(record){
        return {rowSpan : record.spanCnt}
    }

    const columns: ColumnsType<DataType> = [
        {
            key: 1,
            title: "ID",
            dataIndex: 'id',
            onCell : onCellHandle
        },
        {
            key: 2,
            title: "Wallet Name",
            dataIndex: 'name',
            onCell : onCellHandle
        },
        {
            key: 3,
            title: "Wallet Address",
            dataIndex: 'walletAddress',
            onCell : onCellHandle
        },
        {
            key: 4,
            title: "Contract Address",
            dataIndex: 'contractAddress',
        },
        {
            key: 5,
            title: "Contract Name",
            dataIndex: 'contractName',
        },
        {
            key: 6,
            title: "Contract Type",
            dataIndex: 'contractType',

        },
        {
            key: 7,
            title: "Role",
            dataIndex: 'role',
        },
    ]

    return (
        <div>
            <Table columns={columns} bordered dataSource={generateData(dummyData)}/>
        </div>
    )
}
