import React from 'react';
import {MetamaskView} from './MetamaskContract';
import {ChangeIskraIncomeWalletDiv} from "./marketplace/ChangeIskraIncomeWalletDiv";
import {ChangePurchaserFeePermilleDiv} from "./marketplace/ChangePurchaserFeePermilleDiv";


function Home() {
    return (
        <div>
            <ChangePurchaserFeePermilleDiv/>

            <hr></hr>
            <hr></hr>
            <hr></hr>

            <ChangeIskraIncomeWalletDiv/>

            <hr></hr>

            <MetamaskView/>

            <hr></hr>

        </div>
    )
}

export default Home;