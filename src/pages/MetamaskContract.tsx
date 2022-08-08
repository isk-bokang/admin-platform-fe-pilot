import { MetaMaskInpageProvider } from '@metamask/providers';
import { Button, Select } from 'antd';
import { useEffect, useState } from 'react';
import { ChainApi, GetChainDto } from './apis/ChainApi';
import { AddEthereumChainParameter, addNetwork, connectMetamask, switchNetwork } from './utils/metamask';
import { toHex } from "web3-utils"


export function ConnectMetamask() {

    return (
        <div>
        <Button type='primary' onClick={() => connectMetamask()}> CONNECT METAMASK </Button>
        </div>
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
            chainName: chainList[chainIdx].name,
            rpcUrls: [chainList[chainIdx].rpcUrl],
        })
        setIsDisable(false)
    }

    function onClickHandle() {
        if (chainParam) {
            addNetwork(chainParam)
            .then(()=>switchNetwork(chainParam.chainId))
            
        }
        else{
            alert("Select Chain First")
        }
    }

    return (
        <>
            <Select onChange={onChangeHandle} style={{width : 150}}>
                {chainList.length > 0 &&
                    chainList.map((item, idx) => {
                        return (<Select.Option value={idx} key={idx}>{item.name}</Select.Option>)
                    })
                }
            </Select>
            <Button disabled={isDisable} onClick={onClickHandle}> SWITCH Network </Button>
            <p>ADDRESS : {window.ethereum?.selectedAddress ? window.ethereum?.selectedAddress : '-'}</p>
            {chainList.length > 0 &&<p>NETWORK : {chainList.filter((val)=> val.chainId == window.ethereum?.chainId)[0] ? chainList.filter((val)=> val.chainId == window.ethereum?.chainId)[0].name : '-'}</p>}
        </>
    )


}
