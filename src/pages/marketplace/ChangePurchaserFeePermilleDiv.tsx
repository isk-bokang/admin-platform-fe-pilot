import {MKP_FUNCTION, MKPBaseComponent} from "./MKPBaseComponent";
import {Input, InputRef} from "antd";
import React, {useRef, useState} from "react";
import {Contract} from "web3-eth-contract";
import {callMethod, sendTransaction} from "../utils/metamask";

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
                    .then(() => {
                        callMethod(contract.methods.purchaserFeePermille()).then(res => {
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
            <h4> CHANGE MKP PURCHASE FEE </h4>
            <MKPBaseComponent onClickSendTx={sendTx} InputDiv={InputDiv} contractSetter={setContract}
                              functionType={MKP_FUNCTION.CHANGE_PURCHASE_FEE}/>
        </div>
    )
}
