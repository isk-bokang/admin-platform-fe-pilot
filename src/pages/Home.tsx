import React from 'react';
import {MetamaskView} from './MetamaskContract';
import {ChangeIskraIncomeWalletDiv} from "./marketplace/ChangeIskraIncomeWalletDiv";
import {ChangePurchaserFeePermilleDiv} from "./marketplace/ChangePurchaserFeePermilleDiv";
import {ChangeGameOwnerDiv} from "./marketplace/ChangeGameOwnerDiv";


function Home() {
    return (
        <div>
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