import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const SHOW_LENGTH = 30;
const initLineData = () => {
  let initialArrs = [];
  const now = new Date();

  for (let i = 0; i < SHOW_LENGTH; i++) {
    initialArrs.push({
      time: now - (SHOW_LENGTH - i + 1) * 1000,
      value: 0
    });
  }
  return initialArrs;
};

const LineChart = ({ recvValue, recvTimeStamp, width, height }) => {
  
  const margin = 30;
  const keepDataRef = useRef(initLineData()),        
        linePathRef = useRef(),
        xAxisRef = useRef(),
        yAxisRef = useRef();
  
  keepDataRef.current.push({time: recvTimeStamp, value: recvValue});
  keepDataRef.current.shift();
  
  const x = d3
    .scaleTime()
    .domain([keepDataRef.current[0].time, keepDataRef.current[SHOW_LENGTH - 1].time])
    .range([0, width - margin * 2]);

  const y = d3
    .scaleLinear()
    .domain([-100, 100])
    .range([height - margin, margin]);
  
  const line = d3
    .line()
    .x(d => x(d.time))
    .y(d => y(d.value));

  useEffect(() => {
    d3.select(xAxisRef.current).call(d3.axisBottom().scale(x));
    d3.select(yAxisRef.current)
      .call(d3.axisLeft().scale(y).ticks(10).tickSize(-width + margin * 2))
      .selectAll(".tick")
      .style("stroke-dasharray", "5,3")
      .style("opacity", 0.6);
  });
  
  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(${margin}, 0)`}>                
            <g ref={xAxisRef} transform={`translate(0, ${y(0)})`}/>
            <g ref={yAxisRef} />
            <text x={0} y={20} fontSize="12px" color="red" textAnchor="middle">Value</text>            
            <path
              ref={linePathRef} 
              d={line(keepDataRef.current)}
              stroke="steelblue"
              fill="transparent"
              transform={`translate(${x(keepDataRef.current[0].time)})`}/>
        </g>      
      </svg>      
    </div>
  );
};

export default LineChart;
