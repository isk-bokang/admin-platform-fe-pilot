import { CONTRACT_TYPES } from '../constants';
import { Button, Input, Spin } from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { AbiItem } from 'web3-utils';
import { ChainApi } from './apis/ChainApi';
import { ContractApi } from './apis/ContractApi';
import { DeployedContractApi } from './apis/DeployedContractApi';
import { web3 } from './DeployByMetamaks';
import { ChangeIskraIncomeWalletDiv } from './marketplace/ChangeIskraIncomeWallet';
import { MetamaskView } from './MetamaskContract';
import { callMethod, sendTransaction, signTransaction } from './utils/metamask';


function Home() {

  const [loading, setLoading] = useState<boolean>(false)

  function onClickHandle() {
    setLoading(true)
    ContractApi.getContract('1').then(async res => {
      if (window.ethereum?.selectedAddress) {
        const contract = new web3.eth.Contract(JSON.parse(JSON.stringify(res.data.abi)) as AbiItem[], "0x18152aDed3f8eD8c4827E527fe0fda1a50eA04AF")
        const method = contract.methods.setApprovalForAll('0xe32e7D57b63Ce2E0CB2bFB1A4f1A610094EcfE64', 1)
        sendTransaction(method, window.ethereum?.selectedAddress)
          .then((ret) => {
            console.log(ret)
            setLoading(false)
          })
      }
    })
  }

  return (
    <div>
      <ChangeIskraIncomeWalletDiv/>
      <hr></hr>

      <Spin spinning={loading}>
        <Button onClick={onClickHandle}> SIGN TX </Button>
      </Spin>

      <hr></hr>

      <MetamaskView />

      <hr></hr>

      </div>
  )
}

export default Home;