

import React from 'react';
import { Pie, PieChart, Tooltip } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { useState, useEffect } from 'react';
import { DiVim } from 'react-icons/di';
import { CgFontSpacing } from 'react-icons/cg';



function local(key) {
  let data = localStorage.getItem(key)
  return data ? JSON.parse(data) : 0;
}









// #endregion
const NEEDLE_BASE_RADIUS_PX = 5;
const NEEDLE_COLOR = '#d0d000';
const Needle = ({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0 }) => {
  const needleBaseCenterX = cx;
  const needleBaseCenterY = cy;
  const needleLength = innerRadius + (outerRadius - innerRadius) / 2;

  return (
    <g>
      <circle
        cx={needleBaseCenterX}
        cy={needleBaseCenterY}
        r={NEEDLE_BASE_RADIUS_PX}
        fill={NEEDLE_COLOR}
        stroke="none"
      />
      <path
        d={`M${needleBaseCenterX},${needleBaseCenterY}l${needleLength},0`}
        strokeWidth={2}
        stroke={NEEDLE_COLOR}
        fill={NEEDLE_COLOR}
        style={{
          transform: `rotate(-${midAngle}deg)`,
          transformOrigin: `${needleBaseCenterX}px ${needleBaseCenterY}px`,
        }}
      />
    </g>
  );
};

const HalfPie = ({ data, ...props }) => (


  <Pie

    stroke="none"
    dataKey="value"
    startAngle={180}
    endAngle={0}
    data={data}
    cx={100}
    cy={100}
    innerRadius={50}
    outerRadius={100}
    {...props}
  />

);
export default function PieChartWithNeedle({ isAnimationActive = true }) {

  const [pending, setpending] =useState(0)
  const [completed, setcompleted] = useState(0)

  useEffect(() => {
    const lengthdata = async () => {
      const api = await fetch(`http://localhost:4000/data/number?id=${JSON.parse(localStorage.getItem("id"))}`)

      const dataApi = await api.json()
      setcompleted(dataApi.completed)
      setpending(dataApi.pending)
      // console.log(dataApi)
    }

    setInterval(() => {
      lengthdata()
    }, 500);

  }, [])





  let chartData=[ 
    { name: 'A', value: pending, fill: '#9d28d8' },
    { name: 'B', value: completed, fill: '#24e4f1' },
    { name: 'C', value: 0, fill: '#0000ff' },
  ];





  return (
    <PieChart width={210} height={120} style={{ margin: '0 auto' }}>
      <HalfPie data={chartData} isAnimationActive={isAnimationActive} />
      <HalfPie data={chartData} isAnimationActive={isAnimationActive} activeIndex={0} activeShape={Needle} />
      <Tooltip defaultIndex={0} content={() => null} active />
      <RechartsDevtools />
    </PieChart>
  );
}
