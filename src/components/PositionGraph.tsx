import { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import type { PositionData, Driver } from '@/types/f1';
import { getTeamColor } from '@/lib/f1Utils';

interface PositionGraphProps {
  positions: Map<number, PositionData[]>;
  drivers: Driver[];
  selectedDrivers: number[];
}

export function PositionGraph({ positions, drivers, selectedDrivers }: PositionGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const driverMap = useMemo(() => new Map(drivers.map(d => [d.driver_number, d])), [drivers]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || selectedDrivers.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = 250;
    const margin = { top: 20, right: 60, bottom: 30, left: 30 };

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    // Build data
    const allData: { driver: number; lap: number; position: number }[] = [];
    selectedDrivers.forEach(dn => {
      const pos = positions.get(dn) || [];
      pos.forEach((p, i) => {
        allData.push({ driver: dn, lap: i + 1, position: p.position });
      });
    });

    if (allData.length === 0) return;

    const maxLap = d3.max(allData, d => d.lap) || 57;
    const maxPos = Math.min(20, d3.max(allData, d => d.position) || 20);

    const x = d3.scaleLinear().domain([1, maxLap]).range([margin.left, width - margin.right]);
    const y = d3.scaleLinear().domain([1, maxPos]).range([margin.top, height - margin.bottom]);

    // Grid
    svg.append('g')
      .selectAll('line')
      .data(d3.range(1, maxPos + 1))
      .join('line')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', d => y(d))
      .attr('y2', d => y(d))
      .attr('stroke', 'hsl(220, 15%, 14%)')
      .attr('stroke-dasharray', '2,4');

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(10).tickSize(0))
      .call(g => g.select('.domain').attr('stroke', 'hsl(220, 15%, 18%)'))
      .call(g => g.selectAll('text').attr('fill', 'hsl(220, 10%, 55%)').attr('font-size', '10px').attr('font-family', 'JetBrains Mono'));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(maxPos).tickSize(0).tickFormat(d => `P${d}`))
      .call(g => g.select('.domain').attr('stroke', 'hsl(220, 15%, 18%)'))
      .call(g => g.selectAll('text').attr('fill', 'hsl(220, 10%, 55%)').attr('font-size', '10px').attr('font-family', 'JetBrains Mono'));

    // Lines
    const line = d3.line<{ lap: number; position: number }>()
      .x(d => x(d.lap))
      .y(d => y(d.position))
      .curve(d3.curveMonotoneX);

    selectedDrivers.forEach(dn => {
      const driver = driverMap.get(dn);
      const color = driver ? getTeamColor(driver.team_colour) : '#888';
      const driverPositions = allData.filter(d => d.driver === dn).sort((a, b) => a.lap - b.lap);

      if (driverPositions.length === 0) return;

      const path = svg.append('path')
        .datum(driverPositions)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2.5)
        .attr('d', line);

      // Animate
      const totalLength = path.node()?.getTotalLength() || 0;
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(600)
        .ease(d3.easeQuadOut)
        .attr('stroke-dashoffset', 0);

      // End label
      const last = driverPositions[driverPositions.length - 1];
      svg.append('text')
        .attr('x', x(last.lap) + 6)
        .attr('y', y(last.position) + 4)
        .attr('fill', color)
        .attr('font-size', '10px')
        .attr('font-family', 'Orbitron')
        .attr('font-weight', '600')
        .text(driver?.name_acronym || `#${dn}`);
    });

  }, [positions, selectedDrivers, driverMap]);

  if (selectedDrivers.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 flex items-center justify-center h-64">
        <p className="text-sm text-muted-foreground">Select drivers to view positions</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-sm font-display tracking-wider text-foreground">Position Graph</h3>
      </div>
      <div ref={containerRef} className="p-4">
        <svg ref={svgRef} className="w-full" />
      </div>
    </div>
  );
}
