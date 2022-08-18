import {GameContractInfo, MKP_FUNCTION, MKPBaseComponent} from "./MKPBaseComponent";
import {Button, Input, InputRef} from "antd";
import React, {useRef, useState} from "react";
import {Contract} from "web3-eth-contract";
import {sendTransaction} from "../utils/metamask";

const functionType =  MKP_FUNCTION.CHANGE_GAME_RS_RATE

export function ChangeGameRsRateDiv() {
    const [contract, setContract] = useState<Contract>()
    const [gameAddress, setGameAddress] = useState<string>('')
    const [rsRate, setRsRate] = useState<string>('')
    const [isModalVisible, setIsModalVisible] = useState(false);
    const gameContractRef = useRef<InputRef>(null);
    const rsRateRef = useRef<InputRef>(null);

    function InputDiv() {
        return (
            <>
                <Input type={'text'} placeholder="GAME CONTRACT" title='GAME CONTRACT' onChange={(e)=>{
                    if(e.target.value.length >= 42)
                        setGameAddress(e.target.value)
                }}
                       ref={gameContractRef} defaultValue = {gameAddress}/>
                <Input type={'number'} placeholder="RS RATE" title='GAME CONTRACT' ref={rsRateRef} defaultValue = {rsRate}/>
            </>
        )
    }

    function sendTx(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (contract && rsRateRef.current?.input?.value && gameContractRef.current?.input?.value) {
                setRsRate(rsRateRef.current.input.value)
                setGameAddress(gameContractRef.current.input.value)
                sendTransaction(contract.methods.changeGameRsRate(gameContractRef.current.input.value, rsRateRef.current.input.value) )
                    .then((ret) => {
                        resolve(ret)
                    })
                    .catch((err) => {
                        reject(err)
                    })
            } else {
                reject("Contract is Not Defined")
            }
        })
    }

    return (
        <div>
            <h2> CHANGE GAME RS RATE </h2>
            <MKPBaseComponent onClickSendTx={sendTx} InputDiv={InputDiv} contractSetter={setContract}
                              functionType={functionType} gameAddress={gameContractRef.current?.input?.value}/>
            { <Button onClick={() => {
                if(gameContractRef.current?.input?.value) {
                    setGameAddress(gameContractRef.current?.input?.value)
                    setIsModalVisible(true)
                }
            }}> SHOW GAME INFO </Button>}
            { contract && <GameContractInfo contract={contract} gameAddress={gameAddress} visible={isModalVisible} visibleSetter={setIsModalVisible}/>}
        </div>
    )
}
