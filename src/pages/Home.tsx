import React from 'react';
import { MetamaskView } from './MetamaskContract';
import {ChangeIskraIncomeWalletDiv} from "./marketplace/ChangeIskraIncomeWalletDiv";


function Home() {
  return (
    <div>
      <ChangeIskraIncomeWalletDiv/>
      <hr></hr>

      <MetamaskView />

      <hr></hr>

      </div>
  )
}

export default Home;