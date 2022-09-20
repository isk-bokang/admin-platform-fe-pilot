import React from 'react';
import {MetamaskView} from "../pages/MetamaskContract";
import {DeployContractDiv} from "@/pages/platform/DeployContract";

function Home() {

    return (
        <div>
                <h3>DEPLOY</h3>
                <DeployContractDiv/>

                <h4>Chain Connection Test</h4>
                <MetamaskView/>

        </div>
)
}

export default Home;
