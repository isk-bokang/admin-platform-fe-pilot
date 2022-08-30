import React, {useState} from 'react';
import {WalletListDiv} from "../pages/wallet/WalletsDiv";
import {Button} from "antd";
import {PlatformWalletApi} from "../pages/apis/WalletApi";
import {ChainSelector, ContractSelector} from "../pages/utils/InputDiv";


function Home() {
    const [chainSeq, setChainSeq] = useState('')
    const [contractId, setContractId] = useState('')
    return (
        <div>
            <ChainSelector chainSeq={chainSeq} setChainSeq={setChainSeq}/>
            <ContractSelector contractId={contractId} setContractId={setContractId}/>
            <h2>{chainSeq}</h2>
            <h2>{contractId}</h2>
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
