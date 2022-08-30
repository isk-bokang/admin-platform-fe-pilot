import React, {useState} from 'react';
import {WalletListDiv} from "../pages/wallet/WalletsDiv";
import {Button} from "antd";
import {PlatformWalletApi} from "../pages/apis/WalletApi";
import {ChainSelector, ContractSelector} from "../pages/utils/InputDiv";
import {RegisterDeployedContract} from "../pages/Contracts";


function Home() {
    const [chainSeq, setChainSeq] = useState('')
    const [contractId, setContractId] = useState('')
    return (
        <div>
            <RegisterDeployedContract/>
            <hr></hr>
            <hr></hr>
            <hr></hr>
            <Button onClick={()=>{
                PlatformWalletApi.getPlatformWalletList().then((ret) =>{
                        console.log(ret)
                    }
                )
            }}> GET WALLET LIST </Button>
            <hr></hr>
            <hr></hr>
            <hr></hr>
            <WalletListDiv/>
            <hr></hr>
            <hr></hr>
            <hr></hr>




            <hr></hr>

        </div>
    )
}

export default Home;
