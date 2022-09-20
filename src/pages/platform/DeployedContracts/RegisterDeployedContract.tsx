import {Button, Form, Input} from "antd";
import React, {useState} from "react";
import {DeployedContractApi} from "@/pages/apis/DeployedContractApi";
import {ChainSelector, ContractSelector} from "@/pages/utils/InputDiv";
import {validateHexString} from "@/constants";

export function RegisterDeployedContract() {
    const [form] = Form.useForm()
    const [chainSeq, setChainSeq] = useState('')
    const [contractId, setContractId] = useState('')

    function onFinishHandle() {
        DeployedContractApi.postRegisterDeployedContract({
            // @TODO Change AppId And DeployerAddress
            appId: '1',
            contractId: contractId,
            chainSeq: chainSeq,
            contractName: form.getFieldValue('name'),
            contractAddress: form.getFieldValue('contractAddress'),
            deployerAddress: '0x00'
        })
            .then(() => {
                console.log({
                    // @TODO Change AppId And DeployerAddress
                    appId: '1',
                    contractId: contractId,
                    chainSeq: chainSeq,
                    contractName: form.getFieldValue('name'),
                    contractAddress: form.getFieldValue('contractAddress'),
                    deployerAddress: '0x00'
                })
                alert("DONE")
            })
            .catch(err => {
                console.error(err)
                console.log({
                    // @TODO Change AppId And DeployerAddress
                    appId: '1',
                    contractId: contractId,
                    chainSeq: chainSeq,
                    contractName: form.getFieldValue('name'),
                    contractAddress: form.getFieldValue('contractAddress'),
                    deployerAddress: '0x00'
                })
                alert('Error Occurred')
            })

    }

    return (
        <div>
            <Form
                requiredMark={true}
                layout={"vertical"}
                onFinish={onFinishHandle}
                form={form}
                onChange={() => {
                    console.log(contractId)
                }}>
                <Form.Item label={'Name'} name={'name'} rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label={'Contract'}>
                    <ContractSelector contractId={contractId} setContractId={setContractId}/>
                </Form.Item>

                <Form.Item label={'Chain'}>
                    <ChainSelector chainSeq={chainSeq} setChainSeq={setChainSeq}/>
                </Form.Item>

                <Form.Item label={'Contract Address'} name={'contractAddress'}
                           rules={[{required: true}, {type: 'string', min: 41, message: 'too short'}, {
                               validator: validateHexString
                           }]}>
                    <Input/>
                </Form.Item>

                <Button htmlType={"submit"}> SUBMIT</Button>
            </Form>
        </div>
    )
}