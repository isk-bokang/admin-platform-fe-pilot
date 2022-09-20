import React, {useEffect, useState} from "react";
import {DeployedContractApi} from "@/pages/apis/DeployedContractApi";
import {TargListView} from "@/pages/utils/OutputDiv";
import {Button} from "antd";
import {RouteName} from "@/constants";
import {DeployedContracts} from "@/types/types";

export function DeployedContractListDiv() {
    const [deployedContractList, setDeployedContractList] = useState<DeployedContracts[]>([])

    useEffect(() => {
        DeployedContractApi.getDeployedContracts()
            .then(res => {
                console.log(res.data)
                setDeployedContractList(
                    res.data.map(item => {
                        return {
                            id: item.id,
                            contractName: item.contract.name,
                            contractType: item.contract.contractType.name,
                            serviceName: item.gameApp ? item.gameApp.name : 'ISKRA',
                            chainName: item.chain.name,
                            address: item.address
                        }
                    })
                )
            })

    }, [])

    return (<div>
        {deployedContractList.length !== 0 && <TargListView targList={deployedContractList}/>}
        <Button onClick={() => window.location.href = `/${RouteName.DEPLOY_CONTRACT}`}> DEPLOY </Button>
    </div>)
}