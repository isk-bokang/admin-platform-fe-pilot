import { Button, Input, Spin } from "antd"
import { useEffect, useState } from "react"
import { AbiItem } from "web3-utils"
import { ContractApi } from "../apis/ContractApi"
import { DeployedContractApi } from "../apis/DeployedContractApi"
import { web3 } from "../DeployByMetamaks"
import { callMethod, sendTransaction } from "../utils/metamask"

export function ChangeIskraIncomeWalletDiv() {
    const [loading, setLoading] = useState<boolean>(false)
    const [address, setAddress] = useState<string>('')
    const [owner, setOwner] = useState<string>('')
    const [contract, setContract] = useState<any>()
    const [curReciver, setCurReciver] = useState<string>('')
    useEffect(()=>{
      DeployedContractApi.getDeployedCotract('1')
      .then(deployedContract =>{
        ContractApi.getContract(deployedContract.data.contract.id)
        .then(ret=>{
          const tmpContract = new web3.eth.Contract(JSON.parse(JSON.stringify(ret.data.abi)) as AbiItem, deployedContract.data.address)
          setContract(tmpContract)
  
          callMethod(tmpContract.methods.owner()).then(res=>{
            setOwner(res)
          })
          callMethod(tmpContract.methods.iskraIncomeWallet()).then(res=>{
            setCurReciver(res)
          })
  
        })
      })
    }, [])
  
  
    function onClickHandle(){
      setLoading(true)
  
      sendTransaction(contract.methods.changeIskraIncomeWallet(address))
      .then((res)=>{
        console.log(res)
        setLoading(false)
        callMethod(contract.methods.iskraIncomeWallet()).then(res=>{
          setCurReciver(res)
        })
        alert("DONE")
      })
      .catch((err)=>{
        setLoading(false)
        alert("ERROR OCCURED")
      })  
    }
  
    return (
      <div>
        <h4> CHANGE MKP FEE RECIVER ACCOUNT  </h4>
        <Spin spinning={loading}>
          <Input type={'text'} placeholder="ADDRESS" onChange={e => { setAddress(e.target.value) }} title = 'ADDRESS' />
          <Button type='primary' onClick={onClickHandle} disabled={(window.ethereum?.selectedAddress && contract) ? (owner.toLocaleUpperCase() !== window.ethereum?.selectedAddress.toLocaleUpperCase()) : true}> CHANGE FEE RECIVER </Button>
          <p>owner : {owner && owner }</p>
          <p>curent receiver : {curReciver && curReciver }</p>
        </Spin>
      </div>
    )
  }