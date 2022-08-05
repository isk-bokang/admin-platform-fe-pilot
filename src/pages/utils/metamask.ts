import { MetaMaskInpageProvider } from "@metamask/providers"

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

export function addNetwork(networkInfo: AddEthereumChainParameter) {
    console.log(networkInfo)
    window.ethereum?.request({
      method: "wallet_addEthereumChain",
      params: [networkInfo]
    }).then(() => {
        alert("Successfully Added")
    }).catch(() => {
        alert(" ERROR OCCURED ")
        window.location.reload()
    })
  }
  
  export function switchNetwork(chainId: string) {
    window.ethereum?.request({
      method: "wallet_switchEthereumChain",
      params: [{ 'chainId': chainId }]
    }).then(() => {
        alert("Successfully Switched")
    }).catch(() => {
        alert(" ERROR OCCURED ")
        window.location.reload()
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

