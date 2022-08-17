import React from 'react';
import {MetamaskView} from './MetamaskContract';
import {ChangeIskraIncomeWalletDiv} from "./marketplace/ChangeIskraIncomeWalletDiv";
import {ChangePurchaserFeePermilleDiv} from "./marketplace/ChangePurchaserFeePermilleDiv";
import {ChangeGameOwnerDiv} from "./marketplace/ChangeGameOwnerDiv";
import {ChangeGameRsRateDiv} from "./marketplace/ChangeGameRsRateDiv";


function Home() {
    return (
        <div>
            <ChangeGameRsRateDiv/>
            <hr></hr>
            <hr></hr>
            <hr></hr>

            <ChangeGameOwnerDiv/>
            <hr></hr>
            <hr></hr>
            <hr></hr>

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