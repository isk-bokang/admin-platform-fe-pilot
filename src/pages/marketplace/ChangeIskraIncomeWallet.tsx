import { PlatformContractType, RouteName } from "../../constants"
import { Button, Input, Spin } from "antd"
import { useEffect, useState } from "react"
import { AbiItem, toBN } from "web3-utils"
import { ContractApi } from "../apis/ContractApi"
import { DeployedContractApi, DeployedContractsDto } from "../apis/DeployedContractApi"
import { web3 } from "../DeployByMetamaks"
import { callMethod, sendTransaction } from "../utils/metamask"
import { Contract } from "web3-eth-contract"
import { TargListView } from "../utils/OutputDiv"
import { RadioTargListDiv } from "../utils/InputDiv"

export function ChangeIskraIncomeWalletDiv() {
    const [loading, setLoading] = useState<boolean>(false)
    const [address, setAddress] = useState<string>('')
    const [owner, setOwner] = useState<string>('')
    const [deployedContracts, setDeployedContracts] = useState<DeployedContractsDto[]>([])
    const [contract, setContract] = useState<Contract>()
    const [curReciver, setCurReciver] = useState<string>('')
    const [idx, setIdx] = useState<number>(0)
    useEffect(() => {
        window.ethereum?.on('chainChanged', ()=>window.location.reload())
        if (window.ethereum?.chainId && window.ethereum.selectedAddress) {
            DeployedContractApi.getDeployedContracts({
                chainId: toBN(window.ethereum.chainId).toString(),
                contractType: PlatformContractType.ISKRA_MKP
            })
                .then(res => {
                    setDeployedContracts(res.data)
                    if (res.data.length == 1) {
                        prepareContract()
                    }
                    else {

                    }
                })
        }
    }, [])

    async function prepareContract() {
        let tmpContract: Contract;
        let ret = await ContractApi.getContract(deployedContracts[idx].contract.id)

        tmpContract = new web3.eth.Contract(JSON.parse(JSON.stringify(ret.data.abi)) as AbiItem[], deployedContracts[idx].address)

        setContract(tmpContract)

        if (tmpContract) {
            callMethod(tmpContract.methods.owner()).then(res => {
                setOwner(res)
            })
            callMethod(tmpContract.methods.iskraIncomeWallet()).then(res => {
                setCurReciver(res)
            })
        }
    }

    function onClickHandle() {
        setLoading(true)
        if (contract) {
            sendTransaction(contract.methods.changeIskraIncomeWallet(address))
                .then((res) => {
                    setLoading(false)
                    callMethod(contract.methods.iskraIncomeWallet()).then(res => {
                        setCurReciver(res)
                    })
                    alert("DONE")
                })
                .catch((err) => {
                    setLoading(false)
                    alert("ERROR OCCURED")
                })
        }
    }

    return (
        <div>
            <h4> CHANGE MKP FEE RECIVER ACCOUNT  </h4>

            <Spin spinning={loading}>
            {deployedContracts.length > 0 && <RadioTargListDiv targList={deployedContracts.map(item => {
                return {
                    id: item.id,
                    contractName: item.contract.name,
                    contractType: item.contract.contractType,
                    chainName: item.chain.name,
                    address: item.address
                }
            })} callBack ={prepareContract}/>}

                <Input type={'text'} placeholder="ADDRESS" onChange={e => { setAddress(e.target.value) }} title='ADDRESS' />
                {<Button type='primary' onClick={onClickHandle} disabled={contract == null || ((window.ethereum?.selectedAddress) ? (owner.toLocaleUpperCase() !== window.ethereum?.selectedAddress.toLocaleUpperCase()) : true)}> CHANGE FEE RECIVER </Button>}
                <p>owner : {owner && owner}</p>
                <p>curent receiver : {curReciver && curReciver}</p>
                
            </Spin>
        </div>
    )
}
