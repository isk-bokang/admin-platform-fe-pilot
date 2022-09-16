import React, {useState} from 'react';
import {WalletListDiv} from "../pages/wallet/WalletsDiv";
import {Button} from "antd";
import {PlatformWalletApi} from "../pages/apis/WalletApi";
import {ChainSelector, ContractSelector} from "../pages/utils/InputDiv";
import {RegisterDeployedContract} from "./platform/Contracts";


function Home() {
    const [chainSeq, setChainSeq] = useState('')
    const [contractId, setContractId] = useState('')
    return (
        <div>

            <hr></hr>

        </div>
    )
}

export default Home;
