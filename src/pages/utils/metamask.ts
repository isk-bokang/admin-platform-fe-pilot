import { MetaMaskInpageProvider } from "@metamask/providers"
import { resolve } from "path";

(window as any).global = window;
declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider
    }
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

export async function  addNetwork(networkInfo: AddEthereumChainParameter) {
    return new Promise<void>((resolve, reject)=>{
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
    return new Promise<void>((resolve, reject)=>{
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

