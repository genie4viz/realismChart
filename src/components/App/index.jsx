import React from 'react';
import { Layout } from 'antd';
import LineChart from '../LineChart';
import BarChart from '../BarChart';
const { Header, Footer, Sider, Content } = Layout;

const App = () => {

  return (  
    <Layout>
      <Header><span style={{color: 'white', fontSize: 18}}>Realtime charts (Line Chart, Bar Chart)</span></Header>
      <Content>
        <div style={{width: '100%', textAlign: 'center'}}>
          <LineChart />
        </div>
        <div style={{width: '100%', textAlign: 'center'}}>
          <BarChart />
        </div>
      </Content>
      
  </Layout>
  );
};

export default App;