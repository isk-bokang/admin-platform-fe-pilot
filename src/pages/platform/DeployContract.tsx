import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {NONE, toUpperCase_Custom, validateHexString} from "@/constants";
import {ChangeChainNetwork} from "@/pages/MetamaskContract";
import {SelectContract, SelectService} from "@/pages/platform/DeployByBackEnd";
import {ContractApi} from "@/pages/apis/ContractApi";
import {Button, Form, Input, Spin} from "antd";
import {AbiInput, AbiItem} from "web3-utils";
import {DeployedContractApi} from "@/pages/apis/DeployedContractApi";
import {web3} from "@/pages/platform/DeployByMetamaks";

export function DeployContractDiv(){
    const [contractId, setContractId] = useState<number>(NONE)
    const [serviceId, setServiceId] = useState<number>(NONE)
    const [chainSeq, setChainSeq] = useState<number>(NONE)
    const [paramList, setParamList] = useState<AbiInput[]>()
    const [loading, setLoading] = useState<boolean>(false)
    const [form] = Form.useForm()

    function onChangeHandle(){

    }
    function onFinishHandle(){
        if(contractId == NONE || serviceId == NONE || chainSeq == NONE || paramList == null ){
            alert("NEED TO CHECK INPUTS")
        }
        else{
            setLoading(true)
            ContractApi.getContract(contractId.toString())
                .then(res=>{
                    console.log({
                        appId : serviceId.toString(),
                        contractId : contractId.toString(),
                        chainSeq : chainSeq.toString(),
                        contractName : form.getFieldValue('name'),
                        deployerAddress : window.ethereum?.selectedAddress!!,
                        arguments : paramList.map(item=>{
                            return form.getFieldValue(item.name)
                        })
                    })
                    const abi = res.data.abi
                    const contract = new web3.eth.Contract(abi)
                    contract.deploy( {
                        data : res.data.bytecode,
                        arguments : paramList.map(item=>{
                            return form.getFieldValue(item.name)
                        })
                    }).send({
                        from : window.ethereum?.selectedAddress!!,
                        gasPrice : "250000000000"
                    }).on('receipt', (receipt)=>{
                        setLoading(false)
                        DeployedContractApi.postRegisterDeployedContract({
                            appId : serviceId.toString(),
                            contractId : contractId.toString(),
                            chainSeq : chainSeq.toString(),
                            contractName : form.getFieldValue('name'),
                            contractAddress : receipt.contractAddress!!,
                            deployerAddress : window.ethereum?.selectedAddress!!
                        })
                    })
                })
        }


    }

    return(
        <div>
            <Spin spinning={loading}>
            <h4>Chain</h4>
            <ChangeChainNetwork setChainSeq={setChainSeq}/>
            <SelectService idSetter={setServiceId}/>
            <SelectContract idSetter={setContractId}/>
            {contractId != NONE && <SetParamTypes contractId={contractId} setParams={setParamList}/>}
            {paramList &&
                <Form layout={"vertical"} form={form} onChange={onChangeHandle} onFinish={onFinishHandle}>
                    <Form.Item label={'NAME'} name={'name'} rules={[{required : true, message : 'Require This Field'}]}>
                        <Input/>
                    </Form.Item>
                    {paramList.map(item=>{
                        return(
                            <Form.Item label={toUpperCase_Custom(item.name)}
                                       name={item.name}
                                       rules={[{required : true, message : 'Require This Field'},
                                           item.type == 'address' ? {type: 'string', min:41, message : 'Too Short'} : {},
                                           item.type == 'address' ? {validator : validateHexString} : {}]}>
                                <Input type={item.type.includes('int') ? 'number' : item.type.includes('url') ? 'url' : 'string'} />
                            </Form.Item>
                        )
                    })}

                    <Button htmlType={'submit'} type={"primary"}> DEPLOY </Button>
                </Form>
            }

            </Spin>
        </div>
    )
}

function SetParamTypes(prop : {contractId : number, setParams : Dispatch<SetStateAction<AbiInput[] | undefined>>}){
    const [paramTypes, setParamTypes] = useState<string[]>([])
    useEffect(()=>{
        ContractApi.getContractMethods(prop.contractId.toString(), { methodName : 'CONSTRUCTOR'} ).then(res=>{
            if(res.data.length == 1){
                if(res.data[0].inputs != null){
                    prop.setParams(res.data[0].inputs)
                }
            }
            else{
                prop.setParams([])
            }
        })
    }, [prop])

    return(
        <>
        </>
    )
}
