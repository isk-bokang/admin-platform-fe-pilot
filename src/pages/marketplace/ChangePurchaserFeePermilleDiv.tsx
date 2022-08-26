import {MKP_FUNCTION, MKPBaseComponent} from "./MKPBaseComponent";
import {Input, InputRef} from "antd";
import React, {useRef, useState} from "react";
import {Contract} from "web3-eth-contract";
import {callMethod, sendTransaction} from "../utils/metamask";

const functionType = MKP_FUNCTION.CHANGE_PURCHASER_FEE_PERMILLE

export function ChangePurchaserFeePermilleDiv() {
    const [contract, setContract] = useState<Contract>()
    const inputRef = useRef<InputRef>(null);
    function InputDiv() {
        return (<Input type={'number'} placeholder="FEE RATE" title='FEE RATE' ref={inputRef}/>)
    }

    function sendTx(): Promise<any> {
        return new Promise((resolve, reject) => {
            if (contract) {
                sendTransaction(contract.methods.changePurchaserFeePermille(inputRef.current?.input?.value))
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
            <h2> CHANGE MKP PURCHASE FEE </h2>
            <MKPBaseComponent onClickSendTx={sendTx} InputDiv={InputDiv} contractSetter={setContract}
                              functionType={functionType} availRole={'owner'}/>
        </div>
    )
}
