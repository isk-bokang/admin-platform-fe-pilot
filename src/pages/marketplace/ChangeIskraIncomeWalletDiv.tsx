import {MKP_FUNCTION, MKPBaseComponent} from "./MKPBaseComponent";
import {Input} from "antd";
import React, {useState} from "react";
import {Contract} from "web3-eth-contract";
import {callMethod, sendTransaction} from "../utils/metamask";

export function ChangeIskraIncomeWalletDiv() {
    const [address, setAddress] = useState<string>('')
    const [contract, setContract] = useState<Contract>()

    function InputDiv() {
        return (<Input type={'text'} placeholder="ADDRESS" onChange={e => {
            setAddress(e.target.value)
        }} title='ADDRESS'/>)
    }

    function sendTx(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (contract) {
                sendTransaction(contract.methods.changeIskraIncomeWallet(address))
                    .then(() => {
                        callMethod(contract.methods.iskraIncomeWallet()).then(res => {
                            resolve(res)
                        })
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
            <h4> CHANGE MKP FEE RECEIVER ACCOUNT </h4>
            <MKPBaseComponent onClickSendTx={sendTx} InputDiv={InputDiv} contractSetter={setContract} functionType={MKP_FUNCTION.CHANGE_MKP_ISKRA_FEE_RECEIVER}/>
        </div>
    )
}
