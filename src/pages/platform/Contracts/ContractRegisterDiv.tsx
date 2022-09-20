import React, {useState} from "react";
import {ContractApi, PostContractDto} from "@/pages/apis/ContractApi";
import {Button, Form, Input, Popconfirm, Select, Upload, UploadFile} from "antd";
import {AbiItem} from "web3-utils";
import {CONTRACT_TYPES, RouteName, toUpperCase_Custom} from "@/constants";
import {readJsonFileByUrl} from "@/pages/utils/InputDiv";
import {RuleObject} from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";
import Table from "antd/lib/table";
import {RoleAttributeType} from "@/types/types";

export function ContractRegisterDiv() {
    const [registerDto, setRegisterDto] = useState<PostContractDto>()
    const [roleOfContracts, setRoleOfContracts] = useState<RoleAttributeType[]>([])
    const [form] = Form.useForm()
    let isRemoved: boolean = false;


    function extractRoles(abi: AbiItem[]) {
        setRoleOfContracts(
            abi.filter(item => {
                if (item.name && item.type == "function" && item.inputs?.length == 0 && item.outputs?.length == 1 && item.outputs[0].type == "address") {
                    return true
                }
            }).map((item, idx) => {
                return {
                    key: idx,
                    name: toUpperCase_Custom(item.name!!, '_'),
                    onChainName: item.name!!
                }
            }))
    }

    const handleDelete = (key: React.Key) => {
        const newData = roleOfContracts.filter((item) => item.key !== key);
        setRoleOfContracts(newData);
    };
    const handleSave = (newName: string, key: number) => {
        let newData = [...roleOfContracts]
        newData.forEach(item => {
            if (item.key == key)
                item.name = newName
        })
        console.log(newData)
        console.log(roleOfContracts)
        setRoleOfContracts(newData);
    };

    const columns = [
        {
            key: 1,
            title: "NAME",
            dataIndex: 'name',
            editable: true,
            render: (_, record: RoleAttributeType) => (
                <Input defaultValue={record.name} onChange={(e) => {
                    handleSave(e.target.value, record.key)
                }}/>
            ),

        },
        {
            key: 2,
            title: "ON CHAIN NAME",
            dataIndex: 'onChainName',
        },
        {
            key: 3,
            title: "ACTION",
            dataIndex: 'action',
            render: (_, record: { key: React.Key }) =>
                roleOfContracts.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                        <a>Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ]

    function onChangeHandle() {
        try {
            const retAbi: AbiItem[] = JSON.parse(form.getFieldValue('abi'))
            setRegisterDto({
                name: form.getFieldValue("name"),
                bytecode: form.getFieldValue("bytecode"),
                contractType: CONTRACT_TYPES[form.getFieldValue("contractType")],
                abi: retAbi
            })
        } catch {
            setRegisterDto({
                name: form.getFieldValue("name"),
                bytecode: form.getFieldValue("bytecode"),
                contractType: form.getFieldValue("contractType"),
                abi: []
            })
        }

    }

    function onFinishHandle() {
        console.log(roleOfContracts)
        if (registerDto)
            ContractApi.postContract(registerDto).then(
                (ret) => {
                    if (roleOfContracts.length > 0) {
                        roleOfContracts.map(item => {
                            ContractApi.postContractRoles(ret.data.id, {
                                onChainName: item.onChainName,
                                name: item.name
                            }).then(() => {
                                window.location.href = `/${RouteName.CONTRACTS}/${RouteName.CONTRACT_META_DATA}`
                            })
                        })
                    } else {
                        window.location.href = `/${RouteName.CONTRACTS}/${RouteName.CONTRACT_META_DATA}`
                    }
                }
            )
    }

    function onChangeHandleURL(targFile: UploadFile) {
        if (!isRemoved && targFile.originFileObj) {
            try {
                readJsonFileByUrl(targFile.originFileObj)
                    .then(res => {
                        if (res['abi']) {
                            form.setFieldsValue({abi: JSON.stringify(res['abi'])})
                            console.log('upload')
                            extractRoles(res['abi'])
                        } else {
                            form.setFieldsValue({abi: ''})
                        }
                        if (res['bytecode']) {
                            form.setFieldsValue({bytecode: res['bytecode']})
                        } else {
                            form.setFieldsValue({bytecode: ''})
                        }
                        if (res['abi'] == null && res['bytecode'] == null) {
                            alert("INVALID FORMAT \n NEED CHCECK")
                        }

                        onChangeHandle()
                    })


            } catch {

            }
        }
        isRemoved = false
        targFile.status = "success"
    }

    async function onRemoveHandle() {
        isRemoved = true
    }


    async function validAbi(rule: RuleObject, value: any) {
        try {
            JSON.parse(value)
        } catch {
            return false
        }
        return true
    }

    return (
        <div>
            {CONTRACT_TYPES.length > 0 &&
                <Form layout="vertical" form={form} onFieldsChange={onChangeHandle} onFinish={onFinishHandle}>
                    <Form.Item label="Name" name='name'
                               rules={[{required: true, message: 'Require Name'}]}>
                        <Input></Input>
                    </Form.Item>
                    <Form.Item label="Contract Type" name='contractType'
                               rules={[{required: true, message: 'Require Contract Type'}]}>
                        <Select>
                            {
                                CONTRACT_TYPES.map((item, idx) => {
                                    return (
                                        <Select.Option value={idx} key={item.id}> {item.name} </Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="ABI" name='abi'
                               rules={[{required: true, message: 'ABI Must Be JSON', validator: validAbi}]}>
                        <TextArea></TextArea>
                    </Form.Item>
                    <Form.Item label="ByteCode" name='bytecode'
                               rules={[{required: true, message: 'Require ByteCode'}]}>
                        <Input></Input>
                    </Form.Item>

                    <Upload
                        accept=".json"
                        action={''}
                        maxCount={1}
                        onChange={(info) => onChangeHandleURL(info.file)}
                        onRemove={() => {
                            onRemoveHandle()
                        }}
                    >
                        <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                    </Upload>
                    <br/>
                    <h3>ROLES</h3>
                    <Table columns={columns} dataSource={roleOfContracts}/>

                    <Button htmlType="submit"> REGISTER </Button>
                </Form>}
        </div>
    )
}