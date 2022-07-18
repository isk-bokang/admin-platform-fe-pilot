import React, { CSSProperties } from 'react';
import { UserOutlined, BankOutlined, CopyrightOutlined, WalletOutlined } from '@ant-design/icons';
import { RoutePage, SidebarRoute } from './common/common.interface';
import { RouteName } from './constants';

import Home from './pages/Home';
import Contracts, { ContractListDiv, DeployedContractListDiv, RegisterContractDiv } from './pages/Contracts';
import Chains, { ChainListDiv } from './pages/Chains';
import Deploy from './pages/Deploy';

export const routePages: RoutePage[] = [
  {
    key: '',
    page: <Home />,
  },
  {
    key: RouteName.CONTRACTS,
    page: <Contracts />,
    children : [
      {
        key: RouteName.CONTRACT_META_DATA,
        page: <ContractListDiv />,
      },
      {
        key: RouteName.DEPLOYED_CONTRACTS,
        page: <DeployedContractListDiv />,
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
    children:[
      {
        key: RouteName.CHAIN_META_DATA,
        page: <ChainListDiv />,
      },
    ]
  },
  {
    key: RouteName.DEPLOY_CONTRACT,
    page: <Deploy />,
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
    key : RouteName.CHAINS,
    label : "CHAIN",
    children : [
      {
        key: RouteName.CHAIN_META_DATA,
        label: 'Chain Metadata',
      }
    ]
  },
  {
    key : RouteName.DEPLOY_CONTRACT,
    label : "DEPLOY"
  }

];
