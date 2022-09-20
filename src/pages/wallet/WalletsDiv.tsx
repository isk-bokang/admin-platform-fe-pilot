import {Button, Descriptions, Form, Modal, Select, Table, Typography} from 'antd';
import React, {useEffect, useState} from 'react';
import {
    PlatformWalletApi,
    PlatformWalletInfoDto,
    PlatformContractInfoDto,
    WalletGrantRequestDto
} from "../apis/WalletApi";
import {DeployedContractApi, DeployedContractsDto} from "../apis/DeployedContractApi";
import {AccountDisplay} from "@/pages/utils/OutputDiv";
import {ContractRoleDto} from "@/pages/apis/ContractApi";

const NONE = -1

export function WalletListDiv() {

    const [form] = Form.useForm();
    const [data, setData] = useState<PlatformWalletInfoDto[]>([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false)
    const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false)
    const [detailViewKey, setDetailViewKey] = useState<number>(NONE);
    const [detailViewId, setDetailViewId] = useState<number>(NONE);

    useEffect(() => {
        PlatformWalletApi.getPlatformWalletList()
            .then((ret) => {
                setData(ret.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [])

    interface AttributeType {
        key?: number;
        id: number,
        name?: string,
        walletAddress?: string,
        contractAddress?: string,
        chainName?: string,
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
                id: item.platformWalletDto.id,
                name: item.platformWalletDto.name,
                walletAddress: item.platformWalletDto.accountAddress,
            }
            if (item.platformContractInfoDtos.length > 0) {
                commonData.spanCnt = item.platformContractInfoDtos.length
                for (const jtem of item.platformContractInfoDtos) {
                    let retItem: AttributeType = JSON.parse(JSON.stringify(commonData))
                    retItem.key = jtem.roleId
                    retItem.chainName = jtem.deployedContractDto.chain.name
                    retItem.contractAddress = jtem.deployedContractDto.address
                    retItem.contractName = jtem.deployedContractDto.contract.name
                    retItem.contractType = jtem.deployedContractDto.contract.contractType.name
                    retItem.role = jtem.contractRoleDto.name
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
            onCell: onCellHandle,

        },
        {
            key: 3,
            title: "Wallet Address",
            dataIndex: 'walletAddress',
            onCell: onCellHandle,
            render: (_, record: AttributeType) => {
                return (
                    <AccountDisplay account={record.walletAddress}/>
                )
            }
        },
        {
            key: 4,
            title: "Chain Name",
            dataIndex: 'chainName',
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
        {
            key: 8,
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
            key: 9,
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
        const [walletItem, setWalletItem] = useState<PlatformWalletInfoDto>()
        const [contractInfo, setContractInfo] = useState<PlatformContractInfoDto>()
        const [contractRoleList, setContractRoleList] = useState<ContractRoleDto[]>([])
        const [contractRole, setContractRole] = useState<number>(NONE)
        useEffect(() => {
            setWalletItem(data.find((value) => {
                return value.platformWalletDto.id == detailViewId
            }))
            const tmpContractInfo = data.find((value) => {
                return value.platformWalletDto.id == detailViewId
            })!!.platformContractInfoDtos!!.find(value => {
                return value.roleId == detailViewKey
            })
            setContractInfo(tmpContractInfo)
            DeployedContractApi.getContractRoles(tmpContractInfo!!.deployedContractDto.id).then(ret => {
                setContractRoleList(ret.data)
            })
        })

        function onChangeWalletRole(roleId: number) {
            setContractRole(roleId)
        }

        function onOk() {
            // @TODO Send Transaction

            PlatformWalletApi.grantWalletRole(new WalletGrantRequestDto(
                    walletItem!!.platformWalletDto.id,
                    parseInt(contractInfo!!.deployedContractDto.id),
                    contractRole
                )
            ).then(() => {
                PlatformWalletApi.getPlatformWalletList()
                    .then((ret) => {
                        setData(ret.data)
                    })
                    .catch((err) => {
                        console.error(err)
                    })
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
                            <Descriptions.Item label={"ID"}
                                               span={3}> {walletItem.platformWalletDto.id} </Descriptions.Item>
                            <Descriptions.Item label={"NAME"}
                                               span={3}> {walletItem.platformWalletDto.name} </Descriptions.Item>
                            <Descriptions.Item label={"WALLET ADDRESS"}
                                               span={3}> {walletItem.platformWalletDto.accountAddress} </Descriptions.Item>
                        </>}
                    {contractInfo &&
                        <>
                            <Descriptions.Item label={"CONTRACT ADDRESS"}
                                               span={3}> {contractInfo.deployedContractDto.address} </Descriptions.Item>
                            <Descriptions.Item label={"CONTRACT NAME"}
                                               span={3}> {contractInfo.deployedContractDto.contract.name} </Descriptions.Item>
                            <Descriptions.Item label={"CONTRACT TYPE"}
                                               span={3}> {contractInfo.deployedContractDto.contract.contractType.name} </Descriptions.Item>
                            <Descriptions.Item label={"CHAIN ID"}
                                               span={3}> {contractInfo.deployedContractDto.chain.chainId} </Descriptions.Item>
                            <Descriptions.Item label={"CHAIN NAME"}
                                               span={3}> {contractInfo.deployedContractDto.chain.name} </Descriptions.Item>
                        </>}
                </Descriptions>
                <br/>
                <Form onFinish={onOk} labelCol={{span: 8}} wrapperCol={{span: 16}}>
                    <Form.Item label="ROLE" name='ROLE'
                               rules={[{required: true, message: 'Require Role'}]}>
                        {<Select onChange={onChangeWalletRole} style={{width: '100%'}}>
                            {contractRoleList.length > 0 &&
                                contractRoleList.map((item, idx) => {
                                    return (<Select.Option value={item.id} key={idx}>{item.name}</Select.Option>)
                                })
                            }
                        </Select>}
                    </Form.Item>

                    <Button type={"primary"} htmlType="submit"
                            style={{position: "absolute", right: '5%'}}> REGISTER </Button>
                    <Button style={{position: "absolute", right: '25%'}}
                            onClick={() => setIsEditModalVisible(!isEditModalVisible)}> CANCEL </Button>
                </Form>
            </Modal>
        )
    }

    function AddRoleModal() {
        const [walletItem, setWalletItem] = useState<PlatformWalletInfoDto>()
        const [deployedContracts, setDeployedContracts] = useState<DeployedContractsDto[]>([])
        const [deployedContractId, setDeployedContractId] = useState<number>(NONE)
        const [contractRoleList, setContractRoleList] = useState<ContractRoleDto[]>([])
        const [contractRole, setContractRole] = useState<number>(NONE)

        useEffect(() => {
            setWalletItem(data.find((value) => {
                return value.platformWalletDto.id == detailViewId
            }))
            DeployedContractApi.getDeployedContracts().then(ret => {
                setDeployedContracts(ret.data)
            })
        }, [])

        function onChangeWalletRole(roleId: number) {
            setContractRole(roleId)

        }

        function onChangeContract(deployedContractId: number) {
            setDeployedContractId(deployedContractId)
            DeployedContractApi.getContractRoles(deployedContractId.toString()).then(ret => {
                setContractRoleList(ret.data)
            })
        }

        function onOk() {

            //@TODO Send Transaction

            PlatformWalletApi.grantWalletRole(new WalletGrantRequestDto(
                    walletItem!!.platformWalletDto.id,
                    deployedContractId,
                    contractRole
                )
            ).then(() => {
                PlatformWalletApi.getPlatformWalletList()
                    .then((ret) => {
                        setData(ret.data)
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            })

            setIsAddModalVisible(!isAddModalVisible)
        }

        return (

            <Modal title=" Wallet Info " visible={isAddModalVisible}
                   footer={[]}
                   onCancel={() => setIsAddModalVisible(!isAddModalVisible)}
                   onOk={onOk}>
                <Descriptions bordered>
                    {walletItem &&
                        <>
                            <Descriptions.Item label={"ID"}
                                               span={3}> {walletItem.platformWalletDto.id} </Descriptions.Item>
                            <Descriptions.Item label={"NAME"}
                                               span={3}> {walletItem.platformWalletDto.name} </Descriptions.Item>
                            <Descriptions.Item label={"WALLET ADDRESS"}
                                               span={3}> {walletItem.platformWalletDto.accountAddress} </Descriptions.Item>
                        </>}
                </Descriptions>
                <br/>
                <Form onFinish={onOk} labelCol={{span: 8}} wrapperCol={{span: 16}}>
                    <Form.Item label="CONTRACT" name='CONTRACT'
                               rules={[{required: true, message: 'Require Contract'}]}>
                        <Select onChange={onChangeContract} style={{width: '100%'}}>
                            {deployedContracts.length > 0 &&
                                deployedContracts.map((item, idx) => {
                                    return (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.contract.contractType.name}
                                            <br/>
                                            {item.chain.name}
                                            <br/>
                                            {item.address}
                                        </Select.Option>)
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="ROLE" name='ROLE'
                               rules={[{required: true, message: 'Require Role'}]}>
                        {<Select onChange={onChangeWalletRole} style={{width: '100%'}}>
                            {contractRoleList.length > 0 &&
                                contractRoleList.map((item, idx) => {
                                    return (<Select.Option value={item.id} key={idx}>{item.name}</Select.Option>)
                                })
                            }
                        </Select>}
                    </Form.Item>

                    <Button type={"primary"} htmlType="submit"
                            style={{position: "absolute", right: '5%'}}> REGISTER </Button>
                    <Button style={{position: "absolute", right: '25%'}}
                            onClick={() => setIsAddModalVisible(!isAddModalVisible)}> CANCEL </Button>
                </Form>
            </Modal>


        )
    }


    return (
        <div>
            <Form form={form} component={false}>
                <Table
                    bordered
                    dataSource={data && generateData()}
                    columns={columns}
                />
                {(detailViewId != NONE && detailViewKey != NONE && isEditModalVisible) && <EditRoleModal/>}
                {(detailViewId != NONE && isAddModalVisible) && <AddRoleModal/>}
            </Form>

        </div>
    )
}


