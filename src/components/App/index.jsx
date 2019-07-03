import React, { useRef, useEffect, useState } from "react";
import { Layout, Input, Spin, notification, Icon } from "antd";
import LineChart from "../LineChart";
import BarChart from "../BarChart";
import io from "socket.io-client";
import './index.css';

const { Header, Content } = Layout;
const antIcon = <Icon type="loading" style={{ fontSize: 18, marginRight: 5 }} spin />

const App = () => {

  const [recvData, setRecvData] = useState({value: null, timestamp: new Date()});
  const thredholdRef = useRef(0);

  useEffect(() => {    
    try {
      const ioClient = io.connect("http://localhost:5050");
      ioClient.on("data", msg => {
        if(msg.value > thredholdRef.current){
          notification.open({
            message: 'Warning!',
            description:
            `Received value (${msg.value}) is greater than threshold (${thredholdRef.current}).`,
            icon: <Icon type="smile" style={{ fontSize: 18, color: '#108ee9' }} />,
          });
        }
        setRecvData(msg);
      });
    } catch (err) {
      console.log(err);
    }
    return () => io.close();
  }, []);

  const onChangeThreshold = threshold => {
    thredholdRef.current = threshold;
  };
  
  return (
    <Layout>
      <Header>
        <span className="titlePlaceholder">Realtime charts (Line Chart, Bar Chart)</span>        
      </Header>
      <Content>
        <div className="thresholdWrapper">
          <Input
            className="thredholdPlaceholder"            
            addonBefore="Alert threshold"
            addonAfter=""
            placeholder="Input number..."
            defaultValue={0}
            onChange={e => onChangeThreshold(e.target.value)}
          />
        </div>
        {recvData.value != null 
          ? <div className="chartContainer">
              <div>
                <LineChart recvValue={recvData.value} recvTimeStamp={recvData.timestamp} />
              </div>
              <div>
                <BarChart recvValue={recvData.value} />
              </div>
            </div>
          : <div className="loadingHolder">
              <span className="loadingIndicator" >
                <Spin indicator={antIcon} />Loading Server data...
              </span>
            </div>
        }
      </Content>
    </Layout>
  );
};

export default App;
