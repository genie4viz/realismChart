import React from "react";
import { Layout } from "antd";
import LineChart from "../LineChart";
import BarChart from "../BarChart";
const { Header, Footer, Sider, Content } = Layout;
import './index.css';

const App = () => {
  return (
    <Layout>
      <Header>
        <span>Realtime charts (Line Chart, Bar Chart)</span>
      </Header>
      <Content>
        <div>
          <LineChart />
        </div>
        <div>
          <BarChart />
        </div>
      </Content>
    </Layout>
  );
};

export default App;
