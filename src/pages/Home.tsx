import { Button, Spin } from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { AbiItem } from 'web3-utils';
import { ChainApi } from './apis/ChainApi';
import { ContractApi } from './apis/ContractApi';
import { DeployedContractApi } from './apis/DeployedContractApi';
import { web3 } from './DeployByMetamaks';
import { MetamaskView } from './MetamaskContract';
import { sendTransaction, signTransaction } from './utils/metamask';


function Home() {
  
  const [loading, setLoading] = useState<boolean>(false)
  function onClickHandle() {
    setLoading(true)
    ContractApi.getContract('1').then(async res => {
      if (window.ethereum?.selectedAddress) {
        const contract = new web3.eth.Contract(JSON.parse(JSON.stringify(res.data.abi)) as AbiItem[], "0x18152aDed3f8eD8c4827E527fe0fda1a50eA04AF")
        const method = contract.methods.setApprovalForAll('0xe32e7D57b63Ce2E0CB2bFB1A4f1A610094EcfE64', 1)
        sendTransaction(method, window.ethereum?.selectedAddress)
        .then((ret)=>{
          console.log(ret)
          setLoading(false)
        })
      }
    })
  }

  return (
    <div>
      <Spin spinning = {loading}>
        <Button onClick={onClickHandle}> SIGN TX </Button>
      </Spin>

      <hr></hr>

      <MetamaskView />

      <hr></hr>

      <p>home</p>
      <div>
        <h2> GET CONTRACT API TEST </h2>
        <Button onClick={() => ContractApi.getContractList().then(res => console.log(res.data))}> GET CONTRACTS </Button>
        <Button onClick={() => ContractApi.getContractList({ contractName: '1' }).then(res => console.log(res.data))}> GET CONTRACTS By Name - '1'</Button>
        <Button onClick={() => ContractApi.getContractList({ contractType: 'ERC20' }).then(res => console.log(res.data))}> GET CONTRACTS By Type - 'ERC20'</Button>
        <Button onClick={() => ContractApi.getContract('1').then(res => console.log(res.data))}> GET CONTRACT </Button>
        <Button onClick={() => ContractApi.getContractTypes().then(res => console.log(res.data))}> GET CONTRACT TYPES </Button>
        <Button onClick={() => ContractApi.getContractMethods('1').then(res => console.log(res.data))}> GET METHODS </Button>
        <Button onClick={() => ContractApi.getContractMethods('1', { methodName: "constructor" }).then(res => console.log(res.data))}> GET METHODS - By Name 'Constructor' </Button>
      </div>
      <br></br>
      <div>
        <h2> GET CHAIN API TEST </h2>
        <Button onClick={() => ChainApi.getChainList().then(res => console.log(res.data))}> GET CHAINS </Button>
        <Button onClick={() => ChainApi.getChain('1').then(res => console.log(res.data))}> GET CHAIN </Button>
        <Button onClick={() => ChainApi.getSearchChains({ chainName: 'bao' }).then(res => console.log(res.data))}> GET SEARCH CHAIN by ChainName - 'bao' </Button>
        <Button onClick={() => ChainApi.getSearchChains({ chainId: '1' }).then(res => console.log(res.data))}> GET SEARCH CHAIN by ChainId - '1' </Button>
        <Button onClick={() => ChainApi.getChainTypes().then(res => console.log(res.data))}> GET CHAIN TYPES </Button>
      </div>
      <br></br>
      <div>
        <h2> GET DEPLOYED CONTRACT API TEST</h2>
        <Button onClick={() => DeployedContractApi.getDeployedContracts().then(res => console.log(res.data))}> GET DEPLOYED CONTRACTS </Button>
        <Button onClick={() => DeployedContractApi.getDeployedContracts({ chainSeq: '1' }).then(res => console.log(res.data))}> GET DEPLOYED CONTRACTS by Chain SEQ - '1' </Button>
        <Button onClick={() => DeployedContractApi.getDeployedCotract('2').then(res => console.log(res.data))}> GET DEPLOYED CONTRACT by ID - '2' </Button>
      </div>
    </div>
  )
}

export default Home;