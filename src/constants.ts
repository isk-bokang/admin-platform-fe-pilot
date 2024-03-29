import {ChainApi} from "./pages/apis/ChainApi";
import {ContractApi} from "./pages/apis/ContractApi";
import {RuleObject, StoreValue} from "rc-field-form/lib/interface";
import {ContractTypeDto, GetChainDto} from "@/pages/apis/dto";

export enum PlatformContractType {
    ISKRA_MKP = 'MARKETPLACE'
}

export enum Color {
    MAIN_BACKGROUND = '#16172B',
    MAIN_BLACK = '#000000',
    MAIN_COBALT = '#00339B',
    MAIN_CYAN = '#00CCFF',
    MAIN_EMBER = '#FF2899',
}

export enum RouteName {
    CONTRACTS = 'contract',
    CONTRACT_META_DATA = 'contracts',
    DEPLOYED_CONTRACTS = 'deployed',
    REGISTER_CONTRACT = 'register',
    CONTRACT_DETAIL = ':contractId',
    DEPLOYED_DETAIL = ':deployedId',

    CHAINS = 'chain',
    CHAIN_META_DATA = 'chains',
    CHAIN_DETAIL = ':chainSeq',
    REGISTER_CHAIN = 'register',

    NODES = 'node',
    NODE_DETAIL = ':nodeId',
    NODE_REGISTER = 'register',

    DEPLOY_CONTRACT = 'deploy',
    DEPLOY_BY_FRONTEND = 'feDeploy',

    MKP = 'mkp',
    MKP_CHANGE_ISKRA_INCOME_WALLET = 'changeIncomeWallet',
    MKP_CHANGE_PURCHASER_FEE_PERMILLE = 'changePurchaserFee',
    MKP_CHANGE_GAME_OWNER = 'changeGameOwner',
    MKP_CHANGE_GAME_RS_RATE = 'changeGameRsRate',
    MKP_CLAIM_REVENUE = 'claimRevenue',

    WALLET = 'wallet'
}

export const UNKNOWN = -1

export let CHAINS: GetChainDto[];
await ChainApi.getChainList().then(ret => CHAINS = ret.data)

export let CONTRACT_TYPES: ContractTypeDto[];
await ContractApi.getContractTypes().then(ret => CONTRACT_TYPES = ret.data)

export let CHAIN_TYPES : string[];
await ChainApi.getChainTypes().then(ret => CHAIN_TYPES = ret.data)

export async function validateHexString(rule: RuleObject, value: StoreValue) {

    const reg = /^0x([0-9a-f]*)$/i;
    if (reg.test(value))
        return Promise.resolve()
    else
        return Promise.reject('Need to Insert Hex String')

}

export function toUpperCase_Custom(originStr: string, interFix: string = ' ') {
    let ret: string = ''
    for(const char of originStr){
        if(char >= 'A' && char <= 'Z') {
            ret += interFix
            ret += char
        }
        else
            ret += char.toUpperCase()
    }
    return ret
}

export const NONE = -1

export const ELLIPSIS_COUNT: number = 5
