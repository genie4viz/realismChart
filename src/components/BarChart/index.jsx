import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const initBarData = () => {
  let initialArrs = [];
  for (let i = -100; i <= 90; i += 10) {
    initialArrs.push({
      value: 0,
      range: `${i}~${i + 10}`
    });    
  }
  return initialArrs;
};

const BarChart = ({ recvValue, width, height }) => {
  
  const margin = 30;
  const keepDataRef = useRef(initBarData()),
        xAxisRef = useRef(),
        yAxisRef = useRef();

  keepDataRef.current.filter(e => Number(e.range.split("~")[0]) <= recvValue && recvValue < Number(e.range.split("~")[1]))[0].value++;
  
  const x = d3
    .scaleBand()
    .rangeRound([0, width - margin * 2])
    .domain(keepDataRef.current.map(d => d.range))
    .padding(0.1);

  const yMax = recvValue ? d3.max(keepDataRef.current, d => d.value) : 1;
  const y = d3
    .scaleLinear()
    .rangeRound([height - margin, margin])
    .domain([0, yMax]);
  
  useEffect(() => {
    d3.select(xAxisRef.current).call(d3.axisBottom().scale(x));
    d3.select(yAxisRef.current).call(d3.axisLeft().scale(y).ticks(yMax));
        
    d3.selectAll(".bar").each(function(_, i){      
      d3.select(this)
        .transition()
        .duration(300)
        .attr("y", y(keepDataRef.current[i].value))
        .attr("height", height - margin - y(keepDataRef.current[i].value));      
    })
  });

  return (
    <div>
      <svg width={width} height={height}>
        <g transform={`translate(${margin}, 0)`}>        
          <g ref={xAxisRef} transform={`translate(0,${height - margin})`} />
          <g ref={yAxisRef} />
          <text x={0} y={20} fontSize="12px" color="red" textAnchor="middle">Counts</text>          
          {keepDataRef.current.map((e, i) => 
            <rect
              className="bar"
              key={i}
              fill="steelblue" 
              x={x(e.range)}
              y={height - margin}
              width={x.bandwidth()} />
          )}          
        </g>        
      </svg>
    </div>
  );
};

export default BarChart;
