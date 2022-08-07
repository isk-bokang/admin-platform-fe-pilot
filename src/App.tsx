import React, { useEffect } from 'react';
import './styles/App.css';
import { Layout } from 'antd';
import Sidebar from './layouts/Sidebar';
import CustomHeader from './layouts/CustomHeader';
import { Routes, Route } from 'react-router-dom';
import { routePages } from './routers';
import { RoutePage } from './common/common.interface';

const { Content } = Layout;
const routes: React.ReactElement[] = [];

function getRoute(key: string, page: JSX.Element, path: string) {
  return (
    <Route
      key={key}
      path={path + key}
      element={page}
    />
  );
}

function getRoutePage(routePage: RoutePage, path: string = '/') {
  const {key, page, children} = routePage;
  if (page) {
    routes.push(getRoute(key, page, path));
  }
  if (children) {
    children.forEach(child => getRoutePage(child, path + key + '/'))
  }
}

routePages.forEach(routePage => getRoutePage(routePage));

function App() {
  useEffect(()=>{
    window.process = {
      ...window.process,
    };
  }, [])
  return (
    <Layout
      hasSider={true}
      style={{ minHeight: '100vh' }}
    >
      <Sidebar />
      <Layout style={{ minHeight: '100%' }}>
        <CustomHeader />
        <Content style={{ backgroundColor: 'white' }}>
          <div style={{ padding: '12px' }}>
            <Routes>
              {routes}
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
