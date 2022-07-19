import { Button, Descriptions, Input } from "antd"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { toBN, toHex } from "web3-utils"

import { ChainApi } from "./apis/ChainApi"
import { Abi, ContractApi } from "./apis/ContractApi"
import { ContractDeployApi } from "./apis/ContractDeployApi"
import { GetServiceDto, ServiceApi } from "./apis/ServiceApi"
import { ChainByPropDiv, ListViewChain } from "./Chains"
import { ContractByPropDiv, ListViewContract } from "./Contracts"
import { RadioTargListDiv } from "./utils/InputDiv"
import { DetailView, TargView } from "./utils/OutputDiv"

function Deploy() {
    return (
        <div> <ContractDeployDiv /> </div>
    )
}

enum STEPS {
    SELECT_TARGETS,
    SET_CONSTRUCTOR_PARAMS,
    DEPLOY
}

const UNKNOWN = -1

export function ContractDeployDiv() {

    const [contractId, setContractId] = useState<string>('')
    const [serviceId, setServiceId] = useState<string>('')
    const [chainId, setChainId] = useState<string>('')
    const [curStep, setCurStep] = useState<STEPS>(STEPS.SELECT_TARGETS)
    const [paramList, setParamList] = useState<string[]>([])
    function onClickNextStepHandle() {
        if (curStep === STEPS.SELECT_TARGETS) {
            if (contractId === '' || serviceId === '' || chainId === '') {
                alert(" SELECT ITEM FIRST ")
            }
            else {
                setCurStep(STEPS.SET_CONSTRUCTOR_PARAMS)
            }
        }
        else if (curStep === STEPS.SET_CONSTRUCTOR_PARAMS) {
            setCurStep(STEPS.DEPLOY)
            setParamList(paramList.map(item => {
                if (item == null || item === '') return '0x'
                else return item
            }))
        }
    }

    function onClickDeployHandle() {
        ContractDeployApi.deployContract({
            serviceId: serviceId,
            contractId: contractId,
            chainSeq: chainId,
            deployParams: paramList
        })
            .then(() => {
                alert('DEPLOY DONE')
                window.location.href = "/contract/deployed"
            })
            .catch(err => {
                alert("FATAL ERROR : DEPLOY FAIL")
                window.location.href = "/deploy"
                console.error(err)
            })
    }


    return (
        <div>
            {curStep === STEPS.SELECT_TARGETS && <SelectTargets serviceSetter={setServiceId} chainSetter={setChainId} contractSetter={setContractId} />}
            {curStep === STEPS.SET_CONSTRUCTOR_PARAMS && <SetConstructorParams contractId={contractId} params={paramList} paramSetter={setParamList} />}
            {curStep !== STEPS.DEPLOY && <hr />}
            {curStep !== STEPS.DEPLOY && <Button onClick={onClickNextStepHandle}> NEXT STEP </Button>}
            {curStep !== STEPS.DEPLOY && <hr />}
            {(curStep > STEPS.SELECT_TARGETS) && <ChainByPropDiv chainSeq={chainId} />}
            {(curStep > STEPS.SELECT_TARGETS) && <ServiceByPropDiv serviceId={serviceId} />}
            {(curStep > STEPS.SELECT_TARGETS) && <ContractByPropDiv contractId={contractId} />}

            {(curStep > STEPS.SET_CONSTRUCTOR_PARAMS) && <GetConstructorParams contractId={contractId} params={paramList} />}

            {curStep === STEPS.DEPLOY && <Button type="primary" onClick={onClickDeployHandle}> DEPLOY </Button>}


        </div>)
}


type GetConstructorParamsProp = { contractId: string, params: string[] }
function GetConstructorParams(prop: GetConstructorParamsProp) {
    const [constructorAbi, setConstructorAbi] = useState<Abi>()
    useEffect(() => {
        ContractApi.getContract(prop.contractId)
            .then(res => {
                try {
                    const abi = JSON.parse(res.data.abi)
                    setConstructorAbi(abi.filter((item: Abi) => {
                        return item.type === "constructor"
                    })[0])

                }
                catch {
                    alert("WARN : Check ABI Format")
                    console.error(res.data.abi)
                    window.location.href = "/deployed/add"
                }
            })
    }, [prop.contractId])
    return (
        <>
            <Descriptions title={"PARAMS"} bordered>
                {constructorAbi?.inputs.map((item, idx) => {
                    return (
                        <Descriptions.Item key={item.name} label={item.name === 'amount' ? item.name + ' HEX' : item.name} span={3}>
                            {prop.params[idx]}
                        </Descriptions.Item >
                    )
                })}
            </Descriptions>
        </>
    )
}



type SetConstructorParamsProp = { contractId: string, params: string[], paramSetter: Dispatch<SetStateAction<string[]>> }

function SetConstructorParams(prop: SetConstructorParamsProp) {
    const [constructorAbi, setConstructorAbi] = useState<Abi>()
    const [tokenType, setTokenType] = useState<string>('')
    useEffect(() => {
        ContractApi.getContract(prop.contractId)
            .then(res => {
                setTokenType(res.data.contractType)
                try {
                    const abi = JSON.parse(res.data.abi)
                    setConstructorAbi(abi.filter((item: Abi) => {
                        return item.type === "constructor"
                    })[0])

                }
                catch {
                    alert("WARN : Check ABI Format")
                    console.error(res.data.abi)
                    window.location.href = "/deployed/add"
                }
            })
    }, [prop.contractId])

    function onChangeHandle(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.name === 'amount') {
            if (tokenType.includes('20'))
                prop.params[parseInt(e.target.id)] = parseInt((e.target.value) + '0'.repeat(18)).toString(16)
            else (tokenType.includes('1155'))
                prop.params[parseInt(e.target.id)] = parseInt(e.target.value).toString(16)
        }
        else
            prop.params[parseInt(e.target.id)] = e.target.value
        prop.paramSetter(prop.params)
    }
    return (
        <>

            {constructorAbi?.inputs.map((item, idx) => {
                return (
                    <>
                        {item.type.includes('int') && <Input id={`${idx}`} type={"number"} name={item.name} placeholder={item.name.toUpperCase()} onChange={onChangeHandle} />}
                        {item.type.includes('address') && <Input id={`${idx}`} type={"text"} name={item.name} placeholder={item.name.toUpperCase()} onChange={onChangeHandle} />}
                        {item.type.includes('data') && <Input id={`${idx}`} type={"text"} name={item.name} placeholder={item.name.toUpperCase()} onChange={onChangeHandle} />}
                        {item.type.includes('string') && <Input id={`${idx}`} type={"text"} name={item.name} placeholder={item.name.toUpperCase()} onChange={onChangeHandle} />}
                    </>
                )
            })}

        </>
    )
}




type settersProp = { serviceSetter: Dispatch<SetStateAction<string>>, chainSetter: Dispatch<SetStateAction<string>>, contractSetter: Dispatch<SetStateAction<string>> }

function SelectTargets(prop: settersProp) {
    return (
        <>
            <SelectService idSetter={prop.serviceSetter} />
            <hr />
            <SelectChain idSetter={prop.chainSetter} />
            <hr />
            <SelectContract idSetter={prop.contractSetter} />
        </>
    )
}


type setterProp = { idSetter: Dispatch<SetStateAction<string>> }

export function SelectContract(prop: setterProp) {
    const [contractList, setContractList] = useState<ListViewContract[]>([])
    useEffect(() => {
        ContractApi.getContractList()
            .then(res => {
                setContractList(
                    res.data.map(item => {
                        return {
                            id: item.id,
                            name: item.name,
                            contractType: item.contractType
                        }
                    })
                )
            })
    }, [])

    return (
        <div>
            {contractList.length !== 0 && <RadioTargListDiv targList={contractList} setTarg={prop.idSetter} />}
        </div>
    )
}

export function SelectChain(prop: setterProp) {
    const [chainList, setChainList] = useState<ListViewChain[]>([])
    useEffect(() => {
        ChainApi.getChainList()
            .then(res => {
                setChainList(
                    res.data.map((item) => {
                        return {
                            id: item.chainSeq,
                            name: item.chainName,
                            chainId: item.chainId,
                            rpcUrl: item.rpcUrl
                        }
                    })
                )
            })
    }, [])
    return (
        <div>
            {chainList.length !== 0 && <RadioTargListDiv targList={chainList} setTarg={prop.idSetter} />}
        </div>)
}

export function SelectService(prop: setterProp) {
    const [serviceList, setServiceList] = useState<GetServiceDto[]>([])
    useEffect(() => {
        ServiceApi.getServices()
            .then(res => {
                setServiceList(
                    res.data.map(item => {
                        return {
                            id: item.id,
                            name: item.name,
                            category: item.category
                        }
                    })
                )
            })
    }, [])

    return (
        <div>
            {serviceList.length !== 0 && <RadioTargListDiv targList={serviceList} setTarg={prop.idSetter} />}
        </div>
    )
}


export function ServiceByPropDiv(prop: { serviceId: string }) {
    const [service, setService] = useState<GetServiceDto>()
    useEffect(() => {
        ServiceApi.getService(prop.serviceId)
            .then(res => {
                setService({
                    id: res.data.id,
                    name: res.data.name,
                    category: res.data.category
                })
            })
    }, [prop.serviceId])

    return (
        <div>
            {service && <DetailView targ={service} title="SERVICE" />}
        </div>
    )
}


export default Deploy



