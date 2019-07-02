import React, { useEffect, useRef } from "react";
import { Input, message } from 'antd';
import io from 'socket.io-client';
import * as d3 from 'd3';

const LineChart = () => {
    const w = 1000, h = 300, margin = 50;
    const thredholdRef = useRef();
    const svgRef = useRef();
 
  useEffect(() => {    
    const limit = 30, now = new Date();

    let current = [];
    for(let i = 0; i < limit; i++){
      current.push({
        time: now - (limit - i + 1) * 1000,
        value: 0
      });
    }
    
    let timeMin = d3.min(current, ((d) => d.time)),
        timeMax = d3.max(current, ((d) => d.time));
    
    const x = d3.scaleTime()
      .domain([timeMin, timeMax])
      .range([0, w - margin]);

    const y = d3.scaleLinear()
      .domain([-100, 100])
      .range([h - margin, 0]);

    const line = d3.line()
      .x((d) => x(d.time))
      .y((d) => y(d.value))
      // .curve(d3.curveBasis);

    const graph = d3.select(svgRef.current)
        .append('g')
        .attr('transform', `translate(${margin / 2}, ${margin / 2})`)
        .attr('width', w - margin)
        .attr('height', h - margin);

    const x_axis = graph.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${margin / 2}, ${y(0)})`)
      .call(x.axis = d3.axisBottom().scale(x));

    const y_axis = graph.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${margin / 2}, 0)`)
      .call(d3.axisLeft().scale(y).ticks(10).tickSize(-w));

    y_axis.selectAll('.tick').style("stroke-dasharray", ("5,3")).style('opacity', 0.6);

    const current_path = graph.append('g')
      .attr('transform', `translate(${margin})`)
      .append('path')
      .datum(current)
      .style('fill', 'transparent')
      .style('stroke', 'steelblue');

    tick(new Date(), 0);

    function tick(ts, v) {        
        current.push({
            value: v,
            time: new Date(ts)
          });      
      // Shift domain
      x.domain([new Date(current[1].time), new Date(ts)]);
      // Slide x-axis left
      x_axis
        .transition()
        .duration(300)
        .ease(d3.easeLinear, 2)
        .call(x.axis);
      // Slide path left
      current_path
        // .transition()
        // .duration(750)
        // .ease(d3.easeLinear, 1)
        .attr('transform', `translate(${x(current[1].time)})`);        
      
      

      current_path.attr('d', line);
      // Remove oldest data point from each group
      current.shift();      
    }
    
    try {
      const ioClient = io.connect("http://localhost:5050");
      ioClient.on("data", msg => {
        if(msg.value > thredholdRef.current)
            message.success(`LineChart : The received number from server ${msg.value} is greater than thredhold ${thredholdRef.current}`);
        tick(msg.timestamp, msg.value);
          
      });
    } catch (err) {
      console.log(err);
    }
    return () => io.close();
  }, []);
  const onChange = number => {        
    thredholdRef.current = number;
  }
  return (
    <div style={{width: '100%', textAlign: 'center'}}>
        <div>
            <Input addonBefore="Alert threshold" addonAfter="" placeholder="Input number..." defaultValue="" onChange={(e) => onChange(e.target.value)} style={{width: '20%', marginTop: '10px'}}/>
        </div>
        <div>
            <svg ref={svgRef} width={w} height={h} />
        </div>
    </div>
  );
}

export default LineChart;
