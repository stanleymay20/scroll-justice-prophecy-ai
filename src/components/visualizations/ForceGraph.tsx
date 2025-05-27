
import React, { useEffect, useRef } from 'react';
import { Graph, PrincipleStrength } from '@/types';

interface ForceGraphProps {
  data: Graph;
  width?: number;
  height?: number;
}

// Sample test data with proper types
const sampleData: Graph = {
  nodes: [
    { id: 'justice', label: 'Justice', phase: 'DAWN', strength: 'strong' as PrincipleStrength },
    { id: 'equality', label: 'Equality', phase: 'RISE', strength: 'moderate' as PrincipleStrength },
    { id: 'freedom', label: 'Freedom', phase: 'ASCEND', strength: 'absolute' as PrincipleStrength }
  ],
  edges: [
    { source: 'justice', target: 'equality', weight: 0.8 },
    { source: 'equality', target: 'freedom', weight: 0.9 }
  ],
  links: [
    { source: 'justice', target: 'equality', weight: 0.8 },
    { source: 'equality', target: 'freedom', weight: 0.9 }
  ]
};

export const ForceGraph: React.FC<ForceGraphProps> = ({ 
  data = sampleData, 
  width = 600, 
  height = 400 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    // Simple visualization - in production would use D3.js
    const svg = svgRef.current;
    svg.innerHTML = '';

    // Create simple circle layout
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;

    data.nodes.forEach((node, index) => {
      const angle = (index * 2 * Math.PI) / data.nodes.length;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Create node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', '20');
      circle.setAttribute('fill', getNodeColor(node.strength));
      circle.setAttribute('stroke', '#333');
      circle.setAttribute('stroke-width', '2');
      svg.appendChild(circle);

      // Create node label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', x.toString());
      text.setAttribute('y', (y + 35).toString());
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#fff');
      text.setAttribute('font-size', '12');
      text.textContent = node.label;
      svg.appendChild(text);
    });

  }, [data, width, height]);

  const getNodeColor = (strength: PrincipleStrength): string => {
    switch (strength) {
      case 'weak': return '#fbbf24';
      case 'moderate': return '#3b82f6';
      case 'strong': return '#10b981';
      case 'absolute': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="w-full bg-gray-900 rounded-lg p-4">
      <svg ref={svgRef} width={width} height={height} className="w-full h-auto" />
    </div>
  );
};
