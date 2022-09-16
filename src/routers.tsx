import React, { CSSProperties } from 'react';
import { UserOutlined, BankOutlined, CopyrightOutlined, WalletOutlined } from '@ant-design/icons';
import { RoutePage, SidebarRoute } from './common/common.interface';
import { RouteName } from './constants';

import Home from './pages/Home';
import Contracts, { ContractDetailDiv, ContractListDiv, DeployedContractListDiv, DeployedDetailDiv, RegisterContractDiv } from './pages/platform/Contracts';
import Chains, { ChainDetailDiv, ChainListDiv, RegisterChainDiv } from './pages/platform/Chains';
import Nodes, { NodeDetailDiv, RegisterNodeDiv } from './pages/platform/Nodes';
import { DeployByFrontEnd } from './pages/platform/DeployByMetamaks';
import {ChangePurchaserFeePermilleDiv} from "./pages/marketplace/ChangePurchaserFeePermilleDiv";
import {ChangeIskraIncomeWalletDiv} from "./pages/marketplace/ChangeIskraIncomeWalletDiv";
import {ChangeGameOwnerDiv} from "./pages/marketplace/ChangeGameOwnerDiv";
import {ChangeGameRsRateDiv} from "./pages/marketplace/ChangeGameRsRateDiv";
import {WalletListDiv} from "./pages/wallet/WalletsDiv";

export const routePages: RoutePage[] = [
  {
    key: '',
    page: <Home />,
  },
  {
    key: RouteName.CONTRACTS,
    page: <Contracts />,
    children: [
      {
        key: RouteName.CONTRACT_META_DATA,
        page: <ContractListDiv />,
        children: [
          {
            key: RouteName.CONTRACT_DETAIL,
            page: <ContractDetailDiv />,
          },
        ]
      },
      {
        key: RouteName.DEPLOYED_CONTRACTS,
        page: <DeployedContractListDiv />,
        children: [
          {
            key: RouteName.DEPLOYED_DETAIL,
            page: <DeployedDetailDiv />,
          },
        ]
      },
      {
        key: RouteName.REGISTER_CONTRACT,
        page: <RegisterContractDiv />,
      },

    ]
  },
  {
    key: RouteName.CHAINS,
    page: <Chains />,
    children: [
      {
        key: RouteName.CHAIN_META_DATA,
        page: <ChainListDiv />,
        children: [
          {
            key: RouteName.CHAIN_DETAIL,
            page: <ChainDetailDiv />
          },
        ]
      },
      {
        key: RouteName.REGISTER_CHAIN,
        page: <RegisterChainDiv />
      },
    ]
  },
  {
    key: RouteName.NODES,
    page: <Nodes />,
    children : [
      {
        key : RouteName.NODE_DETAIL,
        page : <NodeDetailDiv/>
      },
      {
        key : RouteName.NODE_REGISTER,
        page : <RegisterNodeDiv/>
      }
    ]
  },
  {
    key: RouteName.WALLET,
    page: <WalletListDiv />,
  },
  {
    key: RouteName.MKP,
    page: <Home />,
    children : [
      {
        key : RouteName.MKP_CHANGE_PURCHASER_FEE_PERMILLE,
        page : <ChangePurchaserFeePermilleDiv/>
      },
      {
        key : RouteName.MKP_CHANGE_ISKRA_INCOME_WALLET,
        page : <ChangeIskraIncomeWalletDiv/>
      },
      {
        key : RouteName.MKP_CHANGE_GAME_OWNER,
        page : <ChangeGameOwnerDiv/>
      },
      {
        key : RouteName.MKP_CHANGE_GAME_RS_RATE,
        page : <ChangeGameRsRateDiv/>
      }
    ]
  },

];

export const sidebarRouters: SidebarRoute[] = [
  {
    key: RouteName.CONTRACTS,
    label: 'CONTRACT',

    children: [
      {
        key: RouteName.CONTRACT_META_DATA,
        label: 'Contract Metadata',
      },
      {
        key: RouteName.DEPLOYED_CONTRACTS,
        label: 'Deployed Contracts',
      }
    ]
  },
  {
    key: RouteName.CHAINS,
    label: "CHAIN",
    children: [
      {
        key: RouteName.CHAIN_META_DATA,
        label: 'Chain Metadata',
      },
      
    ]
  },

  {
    key: RouteName.WALLET,
    label: "Wallet"
  },
  {
    key: RouteName.MKP,
    label: 'MarketPlace',
    children : [
      {
        key : RouteName.MKP_CHANGE_PURCHASER_FEE_PERMILLE,
        label : 'Change Purchaser Fee'
      },
      {
        key : RouteName.MKP_CHANGE_ISKRA_INCOME_WALLET,
        label : 'Change Iskra Income Wallet'
      },
      {
        key : RouteName.MKP_CHANGE_GAME_OWNER,
        label : 'Change Game Owner'
      },
      {
        key : RouteName.MKP_CHANGE_GAME_RS_RATE,
        label : 'Change Game Rs Rate'
      }
    ]
  },

];
