import { RouteName } from "../constants"
import { Button, Descriptions, Input } from "antd"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

import { ChainApi } from "./apis/ChainApi"
import { Abi, ContractApi } from "./apis/ContractApi"
import { DeployedContractApi } from "./apis/DeployedContractApi"
import { GetServiceDto, ServiceApi } from "./apis/ServiceApi"
import { ChainByPropDiv, ListViewChain } from "./Chains"
import { ContractByPropDiv, ListViewContract } from "./Contracts"
import { RadioTargListDiv } from "./utils/InputDiv"
import { DetailView, TargView } from "./utils/OutputDiv"

function DeployByBackEnd() {
    return (
        <div> <ContractDeployDiv /> </div>
    )
}

export enum STEPS {
    SELECT_TARGETS,
    SET_CONSTRUCTOR_PARAMS,
    DEPLOY
}

const UNKNOWN = -1

export function ContractDeployDiv() {

    const [contractId, setContractId] = useState<number>(UNKNOWN)
    const [serviceId, setServiceId] = useState<number>(UNKNOWN)
    const [chainId, setChainId] = useState<number>(UNKNOWN)
    const [curStep, setCurStep] = useState<STEPS>(STEPS.SELECT_TARGETS)
    const [paramList, setParamList] = useState<string[]>([])
    function onClickNextStepHandle() {
        if (curStep === STEPS.SELECT_TARGETS) {
            if (contractId === UNKNOWN || serviceId === UNKNOWN || chainId === UNKNOWN) {
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
        DeployedContractApi.postDeployContract({
            appId: serviceId.toString(),
            contractId: contractId.toString(),
            chainSeq: chainId.toString(),
            deployParams: paramList
        })
            .then(() => {
                alert('DEPLOY DONE')
                window.location.href = `/${RouteName.CONTRACTS}/${RouteName.DEPLOYED_CONTRACTS}`
            })
            .catch(err => {
                alert("FATAL ERROR : DEPLOY FAIL")
                window.location.href = `/${RouteName.DEPLOY_CONTRACT}`
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
            {(curStep > STEPS.SELECT_TARGETS) && <ChainByPropDiv chainSeq={chainId.toString()} />}
            {(curStep > STEPS.SELECT_TARGETS) && <ServiceByPropDiv serviceId={serviceId.toString()} />}
            {(curStep > STEPS.SELECT_TARGETS) && <ContractByPropDiv contractId={contractId.toString()} />}

            {(curStep > STEPS.SET_CONSTRUCTOR_PARAMS) && <GetConstructorParams contractId={contractId} params={paramList} />}

            {curStep === STEPS.DEPLOY && <Button type="primary" onClick={onClickDeployHandle}> DEPLOY </Button>}


        </div>)
}


type GetConstructorParamsProp = { contractId: number, params: string[] }
export function GetConstructorParams(prop: GetConstructorParamsProp) {
    const [constructorAbi, setConstructorAbi] = useState<Abi>()
    useEffect(() => {
        ContractApi.getContract(prop.contractId.toString())
            .then(res => {
                try {
                    const abi = JSON.parse(JSON.stringify(res.data.abi))
                    setConstructorAbi(abi.filter((item: Abi) => {
                        return item.type === "constructor"
                    })[0])

                }
                catch {
                    alert("WARN : Check ABI Format")
                    console.error(res.data.abi)
                    window.location.href = `/${RouteName.DEPLOY_CONTRACT}`
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



type SetConstructorParamsProp = { contractId: number, params: string[], paramSetter: Dispatch<SetStateAction<string[]>> }

function SetConstructorParams(prop: SetConstructorParamsProp) {
    const [constructorAbi, setConstructorAbi] = useState<Abi>()
    const [tokenType, setTokenType] = useState<string>('')
    useEffect(() => {
        ContractApi.getContract(prop.contractId.toString())
            .then(res => {
                setTokenType(res.data.contractType)
                try {
                    const abi = JSON.parse(JSON.stringify(res.data.abi))
                    setConstructorAbi(abi.filter((item: Abi) => {
                        return item.type === "constructor"
                    })[0])

                }
                catch {
                    alert("WARN : Check ABI Format")
                    console.error(res.data.abi)
                    window.location.href = `/${RouteName.DEPLOY_CONTRACT}`
                }
            })
    }, [prop])

    function onChangeHandle(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.name === 'amount') {
            if (tokenType.includes('20')){
                prop.params[parseInt(e.target.id)] = parseInt((e.target.value) + '0'.repeat(18)).toString(16)
            }
            else if(tokenType.includes('1155')){
                prop.params[parseInt(e.target.id)] = parseInt(e.target.value).toString(16)
            }
        }
        else{
            prop.params[parseInt(e.target.id)] = e.target.value
        }
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




type settersProp = { serviceSetter: Dispatch<SetStateAction<number>>, chainSetter: Dispatch<SetStateAction<number>>, contractSetter: Dispatch<SetStateAction<number>> }

function SelectTargets(prop: settersProp) {
    return (
        <>
            <h4>SERVICE</h4>
            <SelectService idSetter={prop.serviceSetter} />
            <hr />
            <h4>CHAIN</h4>
            <SelectChain idSetter={prop.chainSetter} />
            <hr />
            <h4>CONTRACT</h4>
            <SelectContract idSetter={prop.contractSetter} />
        </>
    )
}


type selectProp = { idSetter: Dispatch<SetStateAction<number>> , defaultId ?: string}

export function SelectContract(prop: selectProp) {
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
    }, [prop.idSetter])

    return (
        <div>
            {contractList.length !== 0 && <RadioTargListDiv targList={contractList} setTarg={prop.idSetter} defaultId={prop.defaultId ? prop.defaultId : undefined}/>}
        </div>
    )
}

export function SelectChain(prop: selectProp) {
    const [chainList, setChainList] = useState<ListViewChain[]>([])
    useEffect(() => {
        ChainApi.getChainList()
            .then(res => {
                setChainList(
                    res.data.map((item) => {
                        return {
                            id: item.seq,
                            name: item.name,
                            chainId: item.chainId,
                            rpcUrl: item.rpcUrl
                        }
                    })
                )
            })
    }, [prop.idSetter])
    return (
        <div>
            {chainList.length !== 0 && <RadioTargListDiv targList={chainList} setTarg={prop.idSetter} defaultId={prop.defaultId ? prop.defaultId : undefined}/>}
        </div>)
}

export function SelectService(prop: selectProp) {
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
    }, [prop.idSetter])

    return (
        <div>
            {serviceList.length !== 0 && <RadioTargListDiv targList={serviceList} setTarg={prop.idSetter} defaultId={prop.defaultId ? prop.defaultId : undefined}/>}
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


export default DeployByBackEnd



