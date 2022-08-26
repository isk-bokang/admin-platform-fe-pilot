import { MetaMaskInpageProvider } from '@metamask/providers';
import { Button, Select } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ChainApi, GetChainDto } from './apis/ChainApi';
import { AddEthereumChainParameter, addNetwork, connectMetamask, switchNetwork } from './utils/metamask';
import { toHex } from "web3-utils"
import { CHAINS } from '../constants';

export function MetamaskView() {
    const [curChainName, setCurChainName] = useState<string>('-')
    useEffect( ()=>{
        window.ethereum?.on("chainChanged", (chainId)=>{
            setCurChainName(CHAINS.filter((val) => val.chainId == window.ethereum?.chainId)[0] ?
                CHAINS.filter((val) => val.chainId == window.ethereum?.chainId)[0].name : '-')
        })
        setCurChainName(CHAINS.filter((val) => val.chainId == window.ethereum?.chainId)[0] ?
                CHAINS.filter((val) => val.chainId == window.ethereum?.chainId)[0].name : '-')
    },[window.ethereum?.chainId] )

    return (
        <div>
            <ConnectMetamask />
            {CHAINS && <ChangeChainNetwork  />}
            <p>ADDRESS : {window.ethereum?.selectedAddress ? window.ethereum?.selectedAddress : '-'}</p>
            {CHAINS.length > 0 && <p>NETWORK : {curChainName}</p>}
        </div>
    )
}


export function ConnectMetamask() {
    return (
        <div>
            { ! window.ethereum?.selectedAddress &&<Button type='primary' onClick={() => connectMetamask()}> CONNECT METAMASK </Button>}
            { window.ethereum?.selectedAddress &&<Button type='primary' onClick={() => connectMetamask()} disabled = {true}> DISCONNECT METAMASK </Button>}
        </div>
    )
}

export function ChangeChainNetwork(prop: { setChainSeq ?: Dispatch<SetStateAction<string>> }) {
    const [chainParam, setChainParam] = useState<AddEthereumChainParameter>()
    const [isDisable, setIsDisable] = useState<boolean>(true)

    function onChangeHandle(chainIdx: number) {
        setChainParam({
            chainId: toHex(CHAINS[chainIdx].chainId),
            chainName: CHAINS[chainIdx].name,
            rpcUrls: [CHAINS[chainIdx].rpcUrl],
        })

        setIsDisable(false)
    }

    function onClickHandle() {
        if (chainParam) {
            addNetwork(chainParam)
                .then(() => switchNetwork(chainParam.chainId).then(() => {
                    if (prop.setChainSeq) {
                        CHAINS.map(item=>{
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
                {CHAINS.length > 0 &&
                    CHAINS.map((item, idx) => {
                        return (<Select.Option value={idx} key={idx}>{item.name}</Select.Option>)
                    })
                }
            </Select>
            <Button disabled={isDisable} onClick={onClickHandle}> SWITCH Network </Button>
        </>
    )
}

export function MetamaskRoleCheckDiv(props : {availRoleAddress ?: string, children : JSX.Element}){
    const [curAddress, setCurAddress] = useState<string>('')
    useEffect(()=>{
        if(window.ethereum)
            setCurAddress(window.ethereum.selectedAddress ? window.ethereum.selectedAddress : '')
    },[])


    return(
        <div>
            {window.ethereum == null && <h3> NEED METAMASK </h3>}
            {((props.availRoleAddress == curAddress) || (props.availRoleAddress == null)) && props.children}
        </div>
    )
}
