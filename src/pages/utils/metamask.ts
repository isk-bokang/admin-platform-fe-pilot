import { MetaMaskInpageProvider } from "@metamask/providers"
import { resolve } from "path";
import { TransactionReceipt } from "web3-eth";
import { ContractSendMethod } from "web3-eth-contract"
import { Contract } from "web3-eth-contract"
import { web3 } from "../platform/DeployByMetamaks";


(window as any).global = window;
declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider
    }
}

export async function signTransaction(
    contractAddress: string, 
    method: ContractSendMethod) {
    
    return new Promise((resolve, reject) => {
        const abi = method.encodeABI()
        console.log(abi)
        web3.eth.accounts.signTransaction({
            from: window.ethereum?.selectedAddress,
            to : contractAddress,
            gasPrice : "750000000000",
            gas : 21560,
            data : abi
        }).then(ret=>{
            console.log('ret : ', ret)
            resolve(ret.raw as string)
        })
    })
}

export async function sendTransaction(method: ContractSendMethod, fromAddress : string = window.ethereum?.selectedAddress!! ) : Promise<TransactionReceipt> {
    return new Promise( (resolve, reject) =>{

        method.send({ from: fromAddress , gasPrice : "250000000000" })
        .on("receipt", (receipt: TransactionReceipt) => {
            resolve(receipt);
        })
        .on("error", (error: Error) => {
            console.error(error)
            reject(error)
        })
    } )
}

export async function callMethod(method: ContractSendMethod, fromAddress ?: string ) : Promise<any> {
    return new Promise( (resolve, reject) =>{
        method.call({ from: fromAddress })
        .then( result=>{
            console.log(result)
            resolve(result)
        })
        .catch( err=>{
            console.error(err)
            reject(err)
        })
    } )
}


export function connectMetamask() {
    if (window.ethereum) {
        if (window.ethereum.selectedAddress) {
            return window.ethereum.selectedAddress
        }
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(() => {
                alert("Successfully connected")
            }).catch(() => {
                alert(" ERROR OCCURED ")
                window.location.reload()
            })

    }
    else {
        alert("Metamask가 필요합니다.");
        throw new Error('Cannot Found Metamask')
    }
}

export async function addNetwork(networkInfo: AddEthereumChainParameter) {
    return new Promise<void>((resolve, reject) => {
        window.ethereum?.request({
            method: "wallet_addEthereumChain",
            params: [networkInfo]
        }).then(() => {
            resolve()
        }).catch((e) => {
            alert(" wallet_addEthereumChain ERROR OCCURED ")
            reject(e)
            window.location.reload()
        })
    })
}

export async function switchNetwork(chainId: string) {
    return new Promise<void>((resolve, reject) => {
        window.ethereum?.request({
            method: "wallet_switchEthereumChain",
            params: [{ 'chainId': chainId }]
        }).then(() => {
            alert("Successfully Switched")
            resolve()
        }).catch((e) => {
            alert(" ERROR OCCURED ")
            window.location.reload()
            reject(e)
        })
    })
}


export interface AddEthereumChainParameter {
    chainId: string,
    blockExplorerUrls?: string[],
    chainName?: string,
    iconUrls?: string[],
    nativeCurrency?: {
        name: string,
        symbol: string,
        decimals: number,
    },
    rpcUrls?: string[],
}

