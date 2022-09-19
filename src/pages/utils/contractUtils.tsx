import {AbiItem} from "web3-utils";
import {DeployedContractsDto} from "../apis/DeployedContractApi";
import React, {useEffect, useState} from "react";
import {web3} from "../platform/DeployByMetamaks";
import {callMethod} from "./metamask";
import {Button, Descriptions} from "antd";
import {Contract} from "web3-eth-contract";
import DescriptionsItem from "antd/es/descriptions/Item";

export function extractInfoFromAbi(abi: AbiItem[], type ?: string) {
    return new Promise<string[]>((resolve) => {
        let result: string[] = []
        abi.map(item => {
            if (item.stateMutability == 'view'
                && item.name != null
                && (item.inputs == null || item.inputs.length == 0)
                && (item.outputs != null && item.outputs.length == 1)) {
                if (type != null && item.outputs[0].type === type) {
                    result.push(item.name)
                } else {
                    result.push(item.name)
                }
            }
        })
        resolve(result)
    })

}

export function DeployedContractInfo(prop: { contract : Contract }) {
    const [contractInfoCols, setContractInfoCols] = useState<string[]>([])
    const [contractInfoData, setContractInfoData] = useState<string[]>([])
    contractInfoData?.entries()
    useEffect(() => {

        extractInfoFromAbi(prop.contract.options.jsonInterface).then(res => {
            let tmpContractInfoData: string[] = []
            setContractInfoCols(res)
            res.map(item => {
                callMethod(prop.contract.methods[item]())
                    .then(val => {
                        tmpContractInfoData.push(val)
                        setContractInfoData(tmpContractInfoData)
                    })
                    .catch(()=>{
                        tmpContractInfoData.push('')
                        setContractInfoData(tmpContractInfoData)
                    })

            })
        })
    }, [prop])

    return (
        <>
            <Descriptions bordered title={'CONTRACT INFO'}>
                {
                    contractInfoCols.map((item, idx)=>{
                        return(
                            <DescriptionsItem label={item} span={3}> {contractInfoData[idx]} </DescriptionsItem>
                        )
                    })
                }
            </Descriptions>
        </>
    )
}

