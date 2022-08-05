import { MetaMaskInpageProvider } from '@metamask/providers';
import { Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import { ChainApi, GetChainDto } from './apis/ChainApi';
import { AddEthereumChainParameter, addNetwork, connectMetamask, switchNetwork } from './utils/metamask';
import { toHex } from "web3-utils"



export function ConnectMetamask() {

    return (
        <Button type='primary' onClick={() => connectMetamask()}> CONNECT METAMASK </Button>
    )
}

export function ChangeChainNetwork() {
    const [chainList, setChainList] = useState<GetChainDto[]>([])
    const [chainParam, setChainParam] = useState<AddEthereumChainParameter>()
    const [isDisable, setIsDisable] = useState<boolean>(true)
    useEffect(() => {
        ChainApi.getChainList().then(ret => {
            setChainList(ret.data);
        })
    })

    function onChangeHandle(chainIdx: number) {
        setChainParam({
            chainId: toHex(chainList[chainIdx].chainId),
            chainName: chainList[chainIdx].chainName,
            rpcUrls: [chainList[chainIdx].rpcUrl],
        }
        )
        setIsDisable(false)
    }

    function onClickHandle() {
        if (chainParam) {
            addNetwork(chainParam)
            switchNetwork(chainParam.chainId)
        }
        else{
            alert("Select Chain First")
        }
    }

    return (
        <>
            <Select onChange={onChangeHandle}>
                {chainList.length > 0 &&
                    chainList.map((item, idx) => {
                        return (<Select.Option value={idx} key={idx}>{item.chainName}</Select.Option>)
                    })
                }
            </Select>
            <Button disabled={isDisable} onClick={onClickHandle}> SWITCH Network </Button>
        </>
    )


}
