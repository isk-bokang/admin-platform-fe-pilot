import {GameContractInfo, MKP_FUNCTION, MKPBaseComponent} from "./MKPBaseComponent";
import {Button, Input, InputRef} from "antd";
import React, {useRef, useState} from "react";
import {Contract} from "web3-eth-contract";
import {sendTransaction} from "../utils/metamask";
import {AdminLogApi} from "../apis/AdminLogApi";

//@TODO Need to Check Authorization by Wallet Role

const functionType =  MKP_FUNCTION.CHANGE_GAME_OWNER

export function ChangeGameOwnerDiv() {
    const [contract, setContract] = useState<Contract>()
    const [gameAddress, setGameAddress] = useState<string>('')
    const [newGameOwner, setNewGameOwner] = useState<string>('')
    const [isModalVisible, setIsModalVisible] = useState(false);
    const gameContractRef = useRef<InputRef>(null);
    const newGameOwnerRef = useRef<InputRef>(null);

    function InputDiv() {
        return (
            <>
                <Input type={'text'} placeholder="GAME CONTRACT" title='GAME CONTRACT' ref={gameContractRef} defaultValue = {gameAddress}/>
                <Input type={'text'} placeholder="NEW GAME OWNER" title='GAME CONTRACT' ref={newGameOwnerRef} defaultValue = {newGameOwner}/>
            </>
        )
    }

    function sendTx(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (contract && newGameOwnerRef.current?.input?.value && gameContractRef.current?.input?.value) {
                setNewGameOwner(newGameOwnerRef.current.input.value)
                setGameAddress(gameContractRef.current.input.value)
                sendTransaction(contract.methods.changeGameOwner(gameContractRef.current.input.value, newGameOwnerRef.current.input.value) )
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
            <h2> CHANGE GAME OWNER </h2>
            <MKPBaseComponent onClickSendTx={sendTx} InputDiv={InputDiv} contractSetter={setContract}
                              functionType={functionType} gameAddress={gameContractRef.current?.input?.value} availRole={'owner'}/>
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
