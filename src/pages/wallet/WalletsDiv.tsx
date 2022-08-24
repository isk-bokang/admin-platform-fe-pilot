import {Button, Descriptions, Form, Modal, Select, Table, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {PlatformWalletInfo, WalletContractInfo} from "../apis/WalletApi";
import {WALLET_ROLE_TYPES} from "../../constants";
import {DeployedContractApi, DeployedContractsDto} from "../apis/DeployedContractApi";

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
            roleId: 1,
            chainID: "babobab",
            chainName: "babobab",
        },
        {
            contractId: 2,
            contractAddress: "contract1",
            contractType: "contract1",
            contractName: "contract1",
            role: "qweqwe",
            roleId: 2,
            chainID: "babobab",
            chainName: "babobab",
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
                roleId: 3,
                chainID: "cypress",
                chainName: "cypress",
            },
            {
                contractId: 2,
                contractAddress: "contract2",
                contractType: "contract2",
                contractName: "contract2",
                role: "qweqwe",
                roleId: 4,
                chainID: "babobab",
                chainName: "babobab",
            }
        ]
    }, {
        name: 'asd',
        id: 2,
        walletAddress: 'wallet address2',
    }
]

export function WalletListDiv() {

    const [form] = Form.useForm();
    const [data, setData] = useState<PlatformWalletInfo[]>(dummyData);
    const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false)
    const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false)
    const [detailViewKey, setDetailViewKey] = useState<number>(NONE);
    const [detailViewId, setDetailViewId] = useState<number>(NONE);

    interface AttributeType {
        key?: number;
        id: number,
        name?: string,
        walletAddress?: string,
        contractAddress?: string,
        contractName?: string,
        role?: string,
        contractType?: string,
        spanCnt?: number
    }

    function onClickViewEditModal(record: AttributeType) {
        setDetailViewKey(record.key!!)
        setDetailViewId(record.id)
        setIsEditModalVisible(true)
    }

    function onClickViewAddModal(record: AttributeType) {
        setDetailViewId(record.id)
        setIsAddModalVisible(true)
    }

    function generateData() {
        let ret: AttributeType[] = []
        for (const item of data) {
            let commonData: AttributeType = {
                id: item.id,
                name: item.name,
                walletAddress: item.walletAddress,
            }
            if (item.walletContractInfoList) {
                commonData.spanCnt = item.walletContractInfoList.length
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
            } else {
                ret.push(commonData)
            }
        }
        return ret
    }

    function onCellHandle(record) {
        return {rowSpan: record.spanCnt}
    }


    const columns = [
        {
            key: 1,
            title: "ID",
            dataIndex: 'id',
            onCell: onCellHandle
        },
        {
            key: 2,
            title: "Wallet Name",
            dataIndex: 'name',
            onCell: onCellHandle
        },
        {
            key: 3,
            title: "Wallet Address",
            dataIndex: 'walletAddress',
            onCell: onCellHandle
        },
        {
            key: 4,
            title: "Contract Name",
            dataIndex: 'contractName',
        },
        {
            key: 5,
            title: "Contract Type",
            dataIndex: 'contractType',

        },
        {
            key: 6,
            title: "Role",
            dataIndex: 'role',
        },
        {
            key: 7,
            title: 'EDIT',
            render: (_: any, record: AttributeType) => {
                return (
                    <Typography.Link disabled={!record.key} onClick={() => {
                        onClickViewEditModal(record)
                    }}>
                        EDIT ROLE
                    </Typography.Link>
                )
            }
        },
        {
            key: 8,
            title: "ADD",
            dataIndex: 'walletAddress',
            render: (_: any, record: AttributeType) => {
                return (
                    <Typography.Link disabled={!record.id} onClick={() => {
                        onClickViewAddModal(record)
                    }}>
                        ADD ROLE
                    </Typography.Link>
                )
            },
            onCell: onCellHandle
        },
    ]

    function EditRoleModal() {
        const [walletItem, setWalletItem] = useState<PlatformWalletInfo>()
        const [contractInfo, setContractInfo] = useState<WalletContractInfo>()
        const [walletRole, setWalletRole] = useState<string>('')
        useEffect(() => {
            setWalletItem(data.find((value) => {
                return value.id == detailViewId
            }))
            setContractInfo(
                data.find((value) => {
                    return value.id == detailViewId
                })!!.walletContractInfoList!!.find(value => {
                    return value.roleId == detailViewKey
                })
            )
        })

        function onChangeWalletRole(roleIdx: number) {
            setWalletRole(WALLET_ROLE_TYPES[roleIdx])
        }

        function onOk() {
            //@TODO SEND CHANGE WALLET ROLE API / SEND TRANSACTION
            console.log({
                walletId: walletItem?.id,
                deployedContractId: contractInfo?.contractId,
                walletRole: walletRole
            })
            setIsEditModalVisible(!isEditModalVisible)
        }


        return (
            <Modal title=" Wallet Info " visible={isEditModalVisible}
                   onCancel={() => setIsEditModalVisible(!isEditModalVisible)}
                   onOk={onOk}
                   footer={[]}>
                <Descriptions bordered>
                    {walletItem &&
                        <>
                            <Descriptions.Item label={"ID"} span={3}> {walletItem.id} </Descriptions.Item>
                            <Descriptions.Item label={"NAME"} span={3}> {walletItem.name} </Descriptions.Item>
                            <Descriptions.Item label={"WALLET ADDRESS"}
                                               span={3}> {walletItem.walletAddress} </Descriptions.Item>
                        </>}
                    {contractInfo &&
                        <>
                            <Descriptions.Item label={"CONTRACT ADDRESS"}
                                               span={3}> {contractInfo.contractAddress} </Descriptions.Item>
                            <Descriptions.Item label={"CONTRACT NAME"}
                                               span={3}> {contractInfo.contractName} </Descriptions.Item>
                            <Descriptions.Item label={"CONTRACT TYPE"}
                                               span={3}> {contractInfo.contractType} </Descriptions.Item>
                            <Descriptions.Item label={"CHAIN ID"} span={3}> {contractInfo.chainID} </Descriptions.Item>
                            <Descriptions.Item label={"CHAIN NAME"}
                                               span={3}> {contractInfo.chainName} </Descriptions.Item>
                        </>}
                </Descriptions>
                <br/>
                <Form onFinish={onOk} labelCol={{span: 8}} wrapperCol={{span: 16}}>
                    <Form.Item label="ROLE" name = 'ROLE'
                               rules={[{required: true, message: 'Require Role'}]}>
                        {<Select onChange={onChangeWalletRole} style={{width: '100%'}}>
                            {WALLET_ROLE_TYPES.length > 0 &&
                                WALLET_ROLE_TYPES.map((item, idx) => {
                                    return (<Select.Option value={idx} key={idx}>{item}</Select.Option>)
                                })
                            }
                        </Select>}
                    </Form.Item>

                    <Button type={"primary"} htmlType="submit" style={{position : "absolute", right : '5%'}}> REGISTER </Button>
                    <Button style={{position : "absolute", right : '25%'}} onClick={() => setIsEditModalVisible(!isEditModalVisible)}> CANCEL </Button>
                </Form>
            </Modal>
        )
    }

    function AddRoleModal() {
        const [walletItem, setWalletItem] = useState<PlatformWalletInfo>()
        const [deployedContracts, setDeployedContracts] = useState<DeployedContractsDto[]>([])
        const [deployedContractId, setDeployedContractId] = useState<number>(NONE)
        const [walletRole, setWalletRole] = useState<string>('')

        useEffect(() => {
            setWalletItem(data.find((value) => {
                return value.id == detailViewId
            }))
            DeployedContractApi.getDeployedContracts().then(ret => {
                setDeployedContracts(ret.data)
            })
        }, [])

        function onChangeWalletRole(roleIdx: number) {
            setWalletRole(WALLET_ROLE_TYPES[roleIdx])
        }

        function onChangeContract(contractIdx: number) {
            setDeployedContractId(contractIdx)
        }

        function onOk() {
            //@TODO SEND CHANGE WALLET ROLE API / SEND TRANSACTION
            console.log({
                walletId: walletItem?.id,
                deployedContractId: deployedContractId,
                walletRole: walletRole
            })
            setIsAddModalVisible(!isAddModalVisible)
        }

        return (

            <Modal title=" Wallet Info " visible={isAddModalVisible}
                   footer={[
                   ]}
                   onCancel={() => setIsAddModalVisible(!isAddModalVisible)}
                   onOk={onOk}>
                <Descriptions bordered>
                    {walletItem &&
                        <>
                            <Descriptions.Item label={"ID"} span={3}> {walletItem.id} </Descriptions.Item>
                            <Descriptions.Item label={"NAME"} span={3}> {walletItem.name} </Descriptions.Item>
                            <Descriptions.Item label={"WALLET ADDRESS"}
                                               span={3}> {walletItem.walletAddress} </Descriptions.Item>
                        </>}
                </Descriptions>
                <br/>
                <Form onFinish={onOk} labelCol={{span: 8}} wrapperCol={{span: 16}}>
                    <Form.Item label="CONTRACT" name = 'CONTRACT'
                               rules={[{required: true, message: 'Require Contract'}]}>
                        <Select onChange={onChangeContract} style={{width: '100%'}}>
                            {deployedContracts.length > 0 &&
                                deployedContracts.map((item, idx) => {
                                    return (
                                        <Select.Option value={idx} key={idx}>
                                            {item.contract.contractType}
                                            <br/>
                                            {item.chain.name}
                                            <br/>
                                            {item.address}
                                        </Select.Option>)
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="ROLE" name = 'ROLE'
                               rules={[{required: true, message: 'Require Role'}]}>
                        {<Select onChange={onChangeWalletRole} style={{width: '100%'}}>
                            {WALLET_ROLE_TYPES.length > 0 &&
                                WALLET_ROLE_TYPES.map((item, idx) => {
                                    return (<Select.Option value={idx} key={idx}>{item}</Select.Option>)
                                })
                            }
                        </Select>}
                    </Form.Item>

                    <Button type={"primary"} htmlType="submit" style={{position : "absolute", right : '5%'}}> REGISTER </Button>
                    <Button style={{position : "absolute", right : '25%'}} onClick={() => setIsAddModalVisible(!isAddModalVisible)}> CANCEL </Button>
                </Form>
            </Modal>


        )
    }


    return (
        <div>
            <Form form={form} component={false}>
                <Table
                    bordered
                    dataSource={generateData()}
                    columns={columns}
                />
                {(detailViewId != NONE && detailViewKey != NONE && isEditModalVisible) && <EditRoleModal/>}
                {(detailViewId != NONE && isAddModalVisible) && <AddRoleModal/>}
            </Form>

        </div>
    )
}


