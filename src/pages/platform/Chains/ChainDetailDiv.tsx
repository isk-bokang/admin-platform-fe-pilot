import {useEffect, useState} from "react";
import {DeployedContracts, ListViewChain} from "@/types/types";
import {ChainApi} from "@/pages/apis/ChainApi";
import {DeployedContractApi} from "@/pages/apis/DeployedContractApi";
import {DetailView, TargListView} from "@/pages/utils/OutputDiv";
import {useParams} from "react-router-dom";
import {Button} from "antd";
import {RouteName} from "@/constants";
import {NodeListDiv} from "@/pages/platform/Nodes/NodeListDiv";

export function ChainByPropDiv(prop: { chainSeq: string }) {
    const [chain, setChain] = useState<ListViewChain>()
    const [deployedContractList, setDeployedContractList] = useState<DeployedContracts[]>([])
    useEffect(() => {
        if (prop.chainSeq != null) {
            ChainApi.getChain(prop.chainSeq)
                .then(res => {
                    setChain({
                        id: res.data.seq,
                        chainId: res.data.chainId,
                        chainType: res.data.chainType,
                        name: res.data.name,
                        rpcUrl: res.data.rpcUrl,
                    })
                })

            DeployedContractApi.getDeployedContracts({chainSeq: prop.chainSeq})
                .then(res => {
                    console.log(res.data)
                    setDeployedContractList(
                        res.data.map(item => {
                            return {
                                id: item.id,
                                contractName: item.contract.name,
                                contractType: item.contract.contractType.name,
                                serviceName: item.gameApp ? item.gameApp.name : 'ISKRA',
                                chainId: item.chain.chainId,
                                chainName: item.chain.name,
                                address: item.address,

                            }
                        })
                    )
                })
        }
    }, [prop.chainSeq])


    return (
        <div id="chain">
            {chain && <DetailView targ={chain} title="CHAIN"/>}
            <hr></hr>
            {deployedContractList.length > 0 && <TargListView targList={deployedContractList} title="DEPLOYED CONTRACTS"
                                                              connectPath="contract/deployed"/>}
        </div>)
}

export function ChainDetailDiv() {
    const {chainSeq} = useParams()
    return (
        <div>
            {chainSeq && <ChainByPropDiv chainSeq={chainSeq}/>}
            {chainSeq && <NodeListDiv chainSeq={chainSeq}/>}
            <Button onClick={() => {
                window.location.href = `/${RouteName.NODES}/${RouteName.NODE_REGISTER}?chainSeq=${chainSeq}`
            }}> REGISTER NODE </Button>
        </div>
    )
}