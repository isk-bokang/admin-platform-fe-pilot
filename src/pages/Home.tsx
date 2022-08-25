import React from 'react';
import {WalletListDiv} from "../pages/wallet/WalletsDiv";
import {Button} from "antd";
import {PlatformWalletApi} from "../pages/apis/WalletApi";


function Home() {
    return (
        <div>
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
