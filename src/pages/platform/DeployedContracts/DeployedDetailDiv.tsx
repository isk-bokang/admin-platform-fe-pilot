import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {DeployedContractApi} from "@/pages/apis/DeployedContractApi";
import {DetailView} from "@/pages/utils/OutputDiv";
import {ContractByPropDiv, RolesDiv} from "@/pages/platform/Contracts/ContractDetailDiv";
import {DeployedContractDetail} from "@/types/types";
import {GetChainDto, GetContractDto, GetServiceDto} from "@/pages/apis/dto";

export function DeployedContractByPropDiv(prop: { deployedId: string }) {
    const [deployedContract, setDeployedContract] = useState<DeployedContractDetail>()
    const [chainInfo, setChainInfo] = useState<GetChainDto>()
    const [serviceInfo, setServiceInfo] = useState<GetServiceDto>()
    const [contractInfo, setContractInfo] = useState<GetContractDto>()
    useEffect(() => {
        if (prop.deployedId != null) {
            DeployedContractApi.getDeployedCotract(prop.deployedId)
                .then(res => {
                    setChainInfo(res.data.chain)
                    setServiceInfo(res.data.gameApp)
                    setContractInfo(res.data.contract)
                    setDeployedContract(
                        {
                            deployedId: res.data.id,
                            address: res.data.address
                        }
                    )
                })
        }
    }, [prop.deployedId])

    return (
        <>
            {deployedContract && <DetailView targ={deployedContract} title="DEPLOYED CONTRACT"/>}
            {contractInfo && <ContractByPropDiv contractId={contractInfo.id} needDownload={false}/>}
            {contractInfo && <RolesDiv contractId={contractInfo.id}/>}
            {chainInfo && <DetailView targ={chainInfo} title="CHAIN"/>}
            {serviceInfo && <DetailView targ={serviceInfo} title="SERVICE"/>}

        </>
    )
}

export function DeployedDetailDiv() {
    const {deployedId} = useParams()
    return (
        <div>
            {deployedId && <DeployedContractByPropDiv deployedId={deployedId}/>}
        </div>
    )
}