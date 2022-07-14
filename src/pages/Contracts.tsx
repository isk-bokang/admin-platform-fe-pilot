import { useEffect, useState } from "react"
import { ContractApi } from "./apis/ContractApi"
import { ContractDeployApi } from "./apis/ContractDeployApi"
import { TargListView, TargView } from "./utils/OutputDiv"

function Contracts(){
    return (
        <div> Contracts </div>
    )
}

interface DeployedContracts {
    id: string
    contractName: string
    serviceName: string
    chainId: string
    address: string
}

export function DeployedContractListDiv() {
    const [deployedContractList, setDeployedContractList] = useState<DeployedContracts[]>([])

    useEffect(() => {
        ContractDeployApi.getDeployedContracts()
            .then(res => {
                setDeployedContractList(
                    res.data.map(item => {
                        return {
                            id: item.id,
                            contractName: item.contract.name,
                            serviceName: item.service.name,
                            chainId: item.chain.chainId,
                            address: item.address
                        }
                    })
                )
            })

    }, [])

    return (<div>
        {deployedContractList.length !== 0 && <TargListView targList={deployedContractList}/>}
    </div>)
}

export interface ListViewContract {
    id : string
    name : string
    contractType : string
}

export function ContractListDiv() {
    const [contractList, setContractList] = useState<ListViewContract[]>([])

    useEffect(() => {
        ContractApi.getContractList()
            .then(res => {
                setContractList(
                    res.data.map((item) => {
                        return {
                            id: item.id,
                            name: item.name,
                            contractType: item.contractType
                        }
                    })
                )
            })
    }, [])

    return (<div>
        {contractList.length !== 0 && <TargListView targList={contractList} />}
    </div>)

}

export function ContractByPropDiv(prop : {contractId : string}) {

    const [contract, setContract] = useState<any>()

    useEffect(() => {
        if (prop.contractId != null){
            ContractApi.getContract(prop.contractId)
                .then(res => {
                    setContract({
                        id: res.data.id,
                        name: res.data.name,
                        contractType: res.data.contractType
                    })
                })}
    }, [prop.contractId])


    return (
    <div id="contract">
        {contract && <TargView targ={contract}/>}
    </div>)
}


export default Contracts
