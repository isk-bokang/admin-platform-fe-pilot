import {useState} from "react";
import {ChainApi, PostChainDto} from "@/pages/apis/ChainApi";
import {Button, Form, Input, Select} from "antd";
import {CHAIN_TYPES, RouteName} from "@/constants";

export function RegisterChainDiv() {
    const [registerDto, setRegisterDto] = useState<PostChainDto>()
    const [form] = Form.useForm()

    function onChangeHandle() {
        setRegisterDto({
            name: form.getFieldValue("name"),
            chainId: form.getFieldValue("chainId"),
            chainType: form.getFieldValue("chainType"),
            rpcUrl: form.getFieldValue("rpcUrl"),
        })
    }

    function onClickHandle() {
        if (registerDto != null) {
            console.log(registerDto)
            ChainApi.postChain(registerDto).then(
                () => {
                    window.location.href = `/${RouteName.CHAINS}/${RouteName.CHAIN_META_DATA}`
                }
            )
        }
    }

    return (
        <div>
            <Form layout="vertical" form={form} onFieldsChange={onChangeHandle} onFinish={onClickHandle}>
                <Form.Item label="Chain Name" name='name'
                           rules={[{required: true, message: 'Require Chain Name'}]}>
                    <Input/>
                </Form.Item>

                <Form.Item label="Chain ID" name='chainId'
                           rules={[{required: true, message: 'Require Chain ID'}]}>
                    <Input type={"number"}/>
                </Form.Item>

                <Form.Item label="Chain Type" name='chainType'
                           rules={[{required: true, message: 'Require Chain Type'}]}>
                    <Select>
                        {CHAIN_TYPES.map(item => {
                            return (
                                <Select.Option value={item} key={item}>
                                    {item}
                                </Select.Option>
                            )
                        })}

                    </Select>
                </Form.Item>

                <Form.Item label="RPC URL" name='rpcUrl'
                           rules={[{required: true, message: 'Require RPC URL'}]}>
                    <Input type={"url"}/>
                </Form.Item>

                <Button htmlType="submit"> REGISTER </Button>

            </Form>
        </div>
    )
}