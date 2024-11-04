import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

const AuthLayout = ({ children }) => (
  <Layout style={{ minHeight: '100vh' }}>
    <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </Content>
  </Layout>
);

export default AuthLayout;
