import qs from "query-string";
import {useEffect, useState} from "react";
import {NodeApi, PostNodeDto} from "@/pages/apis/NodeApi";
import {Button, Form, Input} from "antd";
import {RouteName} from "@/constants";
import {SelectChain} from "@/pages/platform/DeployByBackEnd";

export function RegisterNodeDiv() {

    return (
        <>
            <RegisterNodeByPropDiv chainSeq={parseInt(qs.parse(window.location.search).chainSeq?.toString()!!)}/>
        </>
    )
}

export function RegisterNodeByPropDiv(prop: { chainSeq?: number }) {
    const [registerDto, setRegisterDto] = useState<PostNodeDto>()
    const [chainSeq, setChainSeq] = useState<number>(0)
    const [form] = Form.useForm()

    useEffect(() => {
        prop.chainSeq ? setChainSeq(prop.chainSeq) : null

    }, [prop])

    function onChangeHandle() {
        setRegisterDto({
            nodeType: form.getFieldValue("nodeType"),
            ipAddress: form.getFieldValue("ipAddress"),
            chainSeq: chainSeq ? chainSeq.toString() : ''
        })
        console.log(registerDto)
    }

    function onClickHandle() {
        if (registerDto != null) {
            NodeApi.registerNode(registerDto).then(
                () => {
                    window.location.href = `/${RouteName.CHAINS}/${RouteName.CHAIN_META_DATA}/${chainSeq}`
                }
            )
        }
    }

    return (
        <div>
            <SelectChain idSetter={setChainSeq} defaultId={prop.chainSeq}/>
            <Form layout="vertical" form={form} onFieldsChange={onChangeHandle} onFinish={onClickHandle}>
                <Form.Item label="Node Type" name='nodeType'
                           rules={[{required: true, message: 'Require Node Type'}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="IP ADDRESS" name='ipAddress'
                           rules={[{required: true, message: 'Require IP ADDRESS'}]}>
                    <Input type={"text"}/>
                </Form.Item>

                <Button htmlType="submit"> REGISTER </Button>

            </Form>
        </div>
    )

}