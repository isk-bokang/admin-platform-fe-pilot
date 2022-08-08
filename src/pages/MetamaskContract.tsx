import { MetaMaskInpageProvider } from '@metamask/providers';
import { Button, Select } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ChainApi, GetChainDto } from './apis/ChainApi';
import { AddEthereumChainParameter, addNetwork, connectMetamask, switchNetwork } from './utils/metamask';
import { toHex } from "web3-utils"

export function MetamaskView() {
    const [chainList, setChainList] = useState<GetChainDto[]>([])
    useEffect(() => {
        ChainApi.getChainList().then(ret => {
            setChainList(ret.data);
        })
    })

    return (
        <div>
            <ConnectMetamask />
            {chainList && <ChangeChainNetwork chainList={chainList} />}
            <p>ADDRESS : {window.ethereum?.selectedAddress ? window.ethereum?.selectedAddress : '-'}</p>
            {chainList.length > 0 && <p>NETWORK : {chainList.filter((val) => val.chainId == window.ethereum?.chainId)[0] ?
                chainList.filter((val) => val.chainId == window.ethereum?.chainId)[0].name : '-'}</p>}
        </div>
    )
}


export function ConnectMetamask() {
    return (
        <div>
            { ! window.ethereum?.selectedAddress &&<Button type='primary' onClick={() => connectMetamask()}> CONNECT METAMASK </Button>}
            { window.ethereum?.selectedAddress &&<Button type='primary' onClick={() => connectMetamask()}> DISCONNECT METAMASK </Button>}
        </div>
    )
}

export function ChangeChainNetwork(prop: { chainList: GetChainDto[], setChainSeq ?: Dispatch<SetStateAction<string>> }) {
    const [chainParam, setChainParam] = useState<AddEthereumChainParameter>()
    const [isDisable, setIsDisable] = useState<boolean>(true)

    function onChangeHandle(chainIdx: number) {
        setChainParam({
            chainId: toHex(prop.chainList[chainIdx].chainId),
            chainName: prop.chainList[chainIdx].name,
            rpcUrls: [prop.chainList[chainIdx].rpcUrl],
        })

        setIsDisable(false)
    }

    function onClickHandle() {
        if (chainParam) {
            addNetwork(chainParam)
                .then(() => switchNetwork(chainParam.chainId).then(() => {
                    if (prop.setChainSeq) {
                        prop.chainList.map(item=>{
                            if(item.chainId == chainParam.chainId){
                                prop.setChainSeq!!(item.seq.toString())
                            }
                        })
                    }
                }))

        }
        else {
            alert("Select Chain First")
        }
    }

    return (
        <>
            <Select onChange={onChangeHandle} style={{ width: 150 }}>
                {prop.chainList.length > 0 &&
                    prop.chainList.map((item, idx) => {
                        return (<Select.Option value={idx} key={idx}>{item.name}</Select.Option>)
                    })
                }
            </Select>
            <Button disabled={isDisable} onClick={onClickHandle}> SWITCH Network </Button>
        </>
    )


}
