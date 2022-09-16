import { RouteName } from "../../constants"
import { Button, Input } from "antd"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ChainApi, GetChainDto } from "../apis/ChainApi"
import { Abi, ContractApi } from "../apis/ContractApi"
import { GetConstructorParams, SelectContract, SelectService, ServiceByPropDiv, STEPS } from "./DeployByBackEnd"
import { ChangeChainNetwork } from "../MetamaskContract"
import { ChainByPropDiv } from "./Chains"
import { ContractByPropDiv } from "./Contracts"
import Web3 from 'web3/dist/web3.min.js'
import { DeployedContractApi } from "../apis/DeployedContractApi"
import { AbiItem } from "web3-utils"
import { toBN } from "web3-utils"

export let web3: Web3 = new Web3(Web3.givenProvider)

const UNKNOWN = -1

export function DeployByFrontEnd() {
    const [contractId, setContractId] = useState<number>(UNKNOWN)
    const [serviceId, setServiceId] = useState<number>(UNKNOWN)
    const [chainSeq, setChainSeq] = useState<string>('')
    const [curStep, setCurStep] = useState<STEPS>(STEPS.SELECT_TARGETS)
    const [paramList, setParamList] = useState<string[]>([])

    function onClickNextStepHandle() {
        if (curStep === STEPS.SELECT_TARGETS) {
            console.log(chainSeq)
            if (contractId === UNKNOWN || serviceId === UNKNOWN || chainSeq === '') {
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
        
        ContractApi.getContract(contractId.toString())
            .then(res => {
                const abi = JSON.parse(JSON.stringify(res.data.abi))
                const contract = new web3.eth.Contract(abi as AbiItem);
                contract.deploy({ data: res.data.bytecode, arguments: paramList }).send({
                    from: window.ethereum?.selectedAddress!!,
                    gasPrice: "250000000000"
                }).on("receipt", (receipt) => {
                    console.log(receipt)
                    DeployedContractApi.postRegisterDeployedContract({
                        appId: serviceId.toString(),
                        chainSeq: chainSeq,
                        contractAddress: receipt.contractAddress!!,
                        contractId: contractId.toString(),
                        deployerAddress : window.ethereum?.selectedAddress!!,
                        contractName : "METAMASK"
                    })
                }).on("error", err => {
                    console.error(err)
                })
            })


    }

    return (
        <div>
            {curStep === STEPS.SELECT_TARGETS && <SelectTargets serviceSetter={setServiceId} chainSetter={setChainSeq} contractSetter={setContractId} />}
            {curStep === STEPS.SET_CONSTRUCTOR_PARAMS && <SetConstructorParams contractId={contractId.toString()} params={paramList} paramSetter={setParamList} />}
            {curStep !== STEPS.DEPLOY && <hr />}
            {curStep !== STEPS.DEPLOY && <Button onClick={onClickNextStepHandle}> NEXT STEP </Button>}
            {curStep !== STEPS.DEPLOY && <hr />}
            {(curStep > STEPS.SELECT_TARGETS) && <ChainByPropDiv chainSeq={chainSeq} />}
            {(curStep > STEPS.SELECT_TARGETS) && <ServiceByPropDiv serviceId={serviceId.toString()} />}
            {(curStep > STEPS.SELECT_TARGETS) && <ContractByPropDiv contractId={contractId.toString()} />}
            {(curStep > STEPS.SET_CONSTRUCTOR_PARAMS) && <GetConstructorParams contractId={contractId} params={paramList} />}
            {curStep === STEPS.DEPLOY && <Button type="primary" onClick={onClickDeployHandle}> DEPLOY </Button>}
        </div>
    )
}

type settersProp = { serviceSetter: Dispatch<SetStateAction<number>>, chainSetter: Dispatch<SetStateAction<string>>, contractSetter: Dispatch<SetStateAction<number>> }

function SelectTargets(prop: settersProp) {

    return (
        <>
            <h4>CHAIN</h4>
            <SelectChain setChainSeq={prop.chainSetter} />
            <hr />
            <h4>SERVICE</h4>
            <SelectService idSetter={prop.serviceSetter} />
            <hr />
            <h4>CONTRACT</h4>
            <SelectContract idSetter={prop.contractSetter} />
        </>
    )
}

function SelectChain(prop: { setChainSeq: Dispatch<SetStateAction<string>> }) {
    const [chainList, setChainList] = useState<GetChainDto[]>([])
    useEffect(() => {
        ChainApi.getChainList().then(ret => {
            setChainList(ret.data);
        })
    }, [prop])

    return (
        <div>
            {chainList && <ChangeChainNetwork setChainSeq={prop.setChainSeq} />}
        </div>
    )
}

type SetConstructorParamsProp = { contractId: string, params: string[], paramSetter: Dispatch<SetStateAction<string[]>> }

function SetConstructorParams(prop : SetConstructorParamsProp) {
    const [constructorAbi, setConstructorAbi] = useState<Abi>()
    const [tokenType, setTokenType] = useState<string>('')
    
    useEffect(() => {
        ContractApi.getContract(prop.contractId)
            .then(res => {
                setTokenType(res.data.contractType.name!!)
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
                prop.params[parseInt(e.target.id)] = toBN(e.target.value).toString()
            }
            else if(tokenType.includes('1155')){
                prop.params[parseInt(e.target.id)] = toBN(e.target.value).toString()
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
