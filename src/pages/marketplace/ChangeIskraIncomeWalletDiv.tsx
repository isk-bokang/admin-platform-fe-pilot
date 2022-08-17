import {MKP_FUNCTION, MKPBaseComponent} from "./MKPBaseComponent";
import {Input, InputRef} from "antd";
import React, {useRef, useState} from "react";
import {Contract} from "web3-eth-contract";
import {callMethod, sendTransaction} from "../utils/metamask";

export function ChangeIskraIncomeWalletDiv() {
    const [contract, setContract] = useState<Contract>()
    const inputRef = useRef<InputRef>(null);

    function InputDiv() {
        return (<Input type={'text'} placeholder="ADDRESS" ref = {inputRef} title='ADDRESS'/>)
    }

    function sendTx(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (contract) {
                sendTransaction(contract.methods.changeIskraIncomeWallet(inputRef.current?.input?.value))
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
            <h2> CHANGE MKP ISKRA INCOME WALLET  </h2>
            <MKPBaseComponent onClickSendTx={sendTx} InputDiv={InputDiv} contractSetter={setContract}
                              functionType={MKP_FUNCTION.CHANGE_ISKRA_INCOME_WALLET}/>
        </div>
    )
}
