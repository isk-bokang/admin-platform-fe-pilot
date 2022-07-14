import React from 'react';
import styled from 'styled-components';
import { MenuFoldOutlined } from '@ant-design/icons';
import {useLocation, useNavigate} from 'react-router-dom';
import {sidebarRouters} from '../routers';
import {Layout, Menu as AntdMenu} from 'antd';
import LOGO from '../assets/images/IskraLogo.png';

const {Sider} = Layout;

const Logo = styled.div`
  width: 100%;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;

  & > img {
    height: 32px;
    display: block; 
    margin-bottom: 10px;
    margin: 10px auto;
  }
`;

const Menu = styled(AntdMenu)`
  border-right: none;
`;

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <Sider
      style={{ borderRight: '1px solid #f4f4f4' }}
      collapsible={true}
      collapsedWidth={50}
      defaultCollapsed={false}
      width={150}
      breakpoint={'lg'}
      theme={'light'}
      trigger={<MenuFoldOutlined />}
    >
      <Logo onClick={() => navigate('/')}>
        <img src={LOGO} alt='logo' />
      </Logo>
      <Menu 
        mode={'inline'} 
        inlineIndent={16}
        selectedKeys={location?.pathname?.split('/')}
        items={sidebarRouters.map(({key, label, icon, children}) => ({
          key,
          label,
          icon,
          children,
        }))}
        onClick={({keyPath}: {keyPath: string[]}) => {
          navigate(keyPath.reverse().join('/'))
        }}
      />
    </Sider>
  );
}

export default Sidebar;
