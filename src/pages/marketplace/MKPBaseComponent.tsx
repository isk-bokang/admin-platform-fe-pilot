import {PlatformContractType} from "../../constants"
import {Button, Spin} from "antd"
import React, {Dispatch, SetStateAction, useEffect, useState} from "react"
import {AbiItem, toBN} from "web3-utils"
import {ContractApi} from "../apis/ContractApi"
import {DeployedContractApi, DeployedContractsDto} from "../apis/DeployedContractApi"
import {web3} from "../DeployByMetamaks"
import {callMethod} from "../utils/metamask"
import {Contract} from "web3-eth-contract"
import {RadioTargListDiv} from "../utils/InputDiv"

type SendTx = () => Promise<any>

export enum MKP_FUNCTION {
    CHANGE_MKP_ISKRA_FEE_RECEIVER,
    CHANGE_MKP_FEE_RATE,
    CLAIM
}

export function MKPBaseComponent(prop: {
                              onClickSendTx: SendTx,
                              contractSetter: Dispatch<SetStateAction<Contract | undefined>>,
                              InputDiv?: Function,
                              functionType: MKP_FUNCTION
                          }
) {
    const [loading, setLoading] = useState<boolean>(false)
    const [owner, setOwner] = useState<string>('')
    const [deployedContracts, setDeployedContracts] = useState<DeployedContractsDto[]>([])
    const [curReceiver, setCurReceiver] = useState<string>('')
    const [idx, setIdx] = useState<number>(0)

    useEffect(() => {
        window.ethereum?.on('chainChanged', () => window.location.reload())
        if (window.ethereum?.chainId && window.ethereum.selectedAddress) {
            DeployedContractApi.getDeployedContracts({
                chainId: toBN(window.ethereum.chainId).toString(),
                contractType: PlatformContractType.ISKRA_MKP
            })
                .then(res => {
                    setDeployedContracts(res.data)
                })
        }
    }, [])

    function prepareContract() {
        let tmpContract: Contract;
        ContractApi.getContract(deployedContracts[idx].contract.id)
            .then(ret =>{
                tmpContract = new web3.eth.Contract(JSON.parse(JSON.stringify(ret.data.abi)) as AbiItem[], deployedContracts[idx].address)
                prop.contractSetter(tmpContract)
                if (tmpContract) {
                    callMethod(tmpContract.methods.owner()).then(res => {
                        setOwner(res)
                    })
                    callMethod(tmpContract.methods.iskraIncomeWallet()).then(res => {
                        setCurReceiver(res)
                    })
                }
            })
    }

    function onClickHandle() {
        setLoading(true)
        prop.onClickSendTx()
            .then(ret => {
                if(prop.functionType ==MKP_FUNCTION.CHANGE_MKP_ISKRA_FEE_RECEIVER)
                    setCurReceiver(ret)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                alert('ERROR OCCURRED')
                setLoading(false)
            })
    }

    return (
        <div>
            <Spin spinning={loading}>
                {deployedContracts.length > 0 && <RadioTargListDiv targList={deployedContracts.map(item => {
                    return {
                        id: item.id,
                        contractName: item.contract.name,
                        contractType: item.contract.contractType,
                        chainName: item.chain.name,
                        address: item.address
                    }
                })} callBack={prepareContract} setTarg={setIdx}/>}
                {prop.InputDiv && <prop.InputDiv/>}
                {<Button type='primary' onClick={onClickHandle}
                         disabled={((window.ethereum?.selectedAddress) ? (owner.toLocaleUpperCase() !== window.ethereum?.selectedAddress.toLocaleUpperCase()) : true)}>
                SEND TX </Button>}
                <p>owner : {owner && owner}</p>
                <p>current receiver : {curReceiver && curReceiver}</p>

            </Spin>
        </div>
    )
}
