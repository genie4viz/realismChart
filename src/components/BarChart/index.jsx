import React, { useEffect, useRef } from "react";
import { Input, message } from "antd";
import io from "socket.io-client";
import * as d3 from "d3";
import "./index.css";

const BarChart = () => {
  const w = 1000,
    h = 300,
    margin = 50;
  const thredholdRef = useRef();
  const svgRef = useRef();

  useEffect(() => {
    let x = d3
        .scaleBand()
        .rangeRound([margin, w - margin])
        .padding(0.1),
      y = d3.scaleLinear().rangeRound([h - margin, margin]);

    let data = [];
    for (let i = -100; i <= 90; i += 10) {
      data.push({
        value: 0,
        range: `${i}~${i + 10}`
      });
    }

    // set the domains of the axes
    x.domain(data.map(d => d.range));
    y.domain([0, 1]); //d3.max(data, ((d) => d.value))

    // add the svg elements
    d3.select(svgRef.current)
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${h - margin})`)
      .call(d3.axisBottom().scale(x));

    const y_axis = d3
      .select(svgRef.current)
      .append("g")
      .attr("class", "axis axis--y")
      .attr("transform", `translate(${margin},0)`)
      .call(
        (y.axis = d3
          .axisLeft()
          .scale(y)
          .ticks(10))
      );

    // create the bars
    var g = d3.select(svgRef.current).append("g");
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", "steelblue")
      .attr("x", d => x(d.range))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => h - margin - y(d.value));

    function tick(v) {
      for (let i = -100; i <= 90; i += 10) {
        if (i <= v && i + 10 > v) {
          data.filter(e => e.range === `${i}~${i + 10}`)[0].value++;
        }
      }
      let maxCounts = d3.max(data, d => d.value);
      y.domain([0, maxCounts < 1 ? 1 : maxCounts]);
      y_axis
        .transition()
        .duration(1000)
        .ease(d3.easeLinear, 2)
        .call(y.axis);

      d3.selectAll(".bar")
        .data(data)
        .transition()
        .duration(300)
        .attr("x", d => x(d.range))
        .attr("y", d => y(d.value))
        .attr("height", d => h - margin - y(d.value));
    }

    try {
      const ioClient = io.connect("http://localhost:5050");
      ioClient.on("data", msg => {
        if (msg.value > thredholdRef.current)
          message.warning(
            `BarChart : The received number from server ${msg.value} is greater than thredhold ${thredholdRef.current}`
          );

        tick(msg.value);
      });
    } catch (err) {
      console.log(err);
    }
    return () => io.close();
  }, []);

  const onChange = number => {
    thredholdRef.current = number;
  };

  return (
    <div>
      <div>
        <Input
          className="Input_Barchart"
          addonBefore="Alert threshold"
          addonAfter=""
          placeholder="Input number..."
          defaultValue=""
          onChange={e => onChange(e.target.value)}
        />
      </div>
      <div>
        <svg ref={svgRef} width={w} height={h} />
      </div>
    </div>
  );
};

export default BarChart;
