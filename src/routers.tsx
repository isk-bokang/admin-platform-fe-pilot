import React, { CSSProperties } from 'react';
import { UserOutlined, BankOutlined, CopyrightOutlined, WalletOutlined } from '@ant-design/icons';
import { RoutePage, SidebarRoute } from './common/common.interface';
import { RouteName } from './constants';
import Isk from './pages/ISK';
import User from './pages/User';
import UserDetail from './pages/UserDetail';
import Wallet from './pages/Wallet';
import WalletDetail from './pages/WalletDetail';
import Home from './pages/Home';

const SIDEBAR_ICON_STYLE: CSSProperties = {
  width: '20px',
  height: '20px',
};

export const routePages: RoutePage[] = [
  {
    key: '',
    page: <Home />,
  },
  {
    key: RouteName.USER,
    page: <User />,
    children: [
      {
        key: RouteName.USER_ID,
        page: <UserDetail />
      }
    ]
  },
  {
    key: RouteName.ISKRA,
    children: [
      {
        key: RouteName.ISK,
        page: <Isk/>
      },
      {
        key: RouteName.WALLET,
        page: <Wallet/>,
        children: [
          {
            key: RouteName.WALLET_ID,
            page: <WalletDetail/>
          }
        ]
      }
    ],
  }
];

export const sidebarRouters: SidebarRoute[] = [
  {
    key: RouteName.USER,
    label: 'User',
    icon: <UserOutlined style={SIDEBAR_ICON_STYLE} />,
  },
  {
    key: RouteName.ISKRA,
    label: 'Iskra',
    icon: <BankOutlined style={SIDEBAR_ICON_STYLE} />,
    children: [
      {
        key: RouteName.ISK,
        label: 'ISK',
        icon: <CopyrightOutlined style={SIDEBAR_ICON_STYLE} />,
      },
      {
        key: RouteName.WALLET,
        label: 'Wallet',
        icon: <WalletOutlined style={SIDEBAR_ICON_STYLE} />,
      }
    ]
  },
];
