import {AbiItem} from "web3-utils";
import React, {useEffect, useState} from "react";
import {callMethod} from "./metamask";
import { Descriptions} from "antd";
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

export function extractConstructorParams(abi: AbiItem[]){
    return new Promise<string[]>( (resolve)=>{
        abi.map(item=>{
            if( (item.name == '' || item.name == null)  ){

            }
        })
    } )
}

export function DeployedContractInfo(prop: { contract : Contract }) {
    const [contractInfoCols, setContractInfoCols] = useState<string[]>([])
    const [contractInfoData, setContractInfoData] = useState<string[]>([])

    useEffect(() => {

        extractInfoFromAbi(prop.contract.options.jsonInterface).then(res => {
            let tmpContractInfoData: string[] = Array<string>(res.length)
            setContractInfoCols(res)
            res.map((item, index) => {
                callMethod(prop.contract.methods[item]())
                    .then(val => {
                        tmpContractInfoData[index] = val
                        setContractInfoData(tmpContractInfoData)
                    })
                    .catch(()=>{
                        tmpContractInfoData[index] = ''
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

