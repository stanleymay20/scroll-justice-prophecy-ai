
import { useRef, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { Graph, ScrollPhase, PrincipleStrength } from '@/types';

// Helper function to get scroll phase color
const getScrollPhaseColor = (phase: ScrollPhase): string => {
  switch (phase) {
    case 'DAWN': return '#1EAEDB'; // Blue
    case 'RISE': return '#FEC6A1'; // Gold
    case 'ASCEND': return '#FFFFFF'; // White
    default: return '#1EAEDB';
  }
};

// Helper function to get principle strength color
const getPrincipleStrengthColor = (strength: PrincipleStrength): string => {
  switch (strength) {
    case 'strong': return '#F2FCE2'; // Green
    case 'medium': return '#FEF7CD'; // Yellow
    case 'weak': return '#ea384c'; // Red
    default: return '#F2FCE2';
  }
};

interface ForceGraphProps {
  data: Graph;
  height?: number;
}

// Ensure we only import and use the 2D version of the graph
export function ForceGraph({ data, height = 600 }: ForceGraphProps) {
  const graphRef = useRef<any>();

  useEffect(() => {
    if (graphRef.current) {
      // Adjust graph simulation
      const linkForce = graphRef.current.d3Force('link');
      if (linkForce) {
        linkForce.distance(() => 100);
      }
      
      const chargeForce = graphRef.current.d3Force('charge');
      if (chargeForce) {
        chargeForce.strength(-120);
      }
    }
  }, []);

  const getNodeColor = (node: any) => {
    if (node.type === 'case' && node.phase) {
      return getScrollPhaseColor(node.phase);
    }
    if (node.type === 'principle' && node.strength) {
      return getPrincipleStrengthColor(node.strength);
    }
    return '#9b87f5'; // Default color (primary purple)
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-justice-dark">
      <ForceGraph2D
        ref={graphRef}
        graphData={data}
        height={height}
        width={800}
        nodeLabel={(node: any) => `${node.label} (${node.id})`}
        nodeColor={getNodeColor}
        nodeRelSize={8}
        nodeVal={(node: any) => node.type === 'principle' ? 12 : 8}
        linkWidth={(link: any) => link.value * 2}
        linkColor={() => 'rgba(155, 135, 245, 0.3)'}
        cooldownTicks={100}
        onEngineStop={() => graphRef.current?.zoomToFit(400, 50)}
        // Disable 3D and VR related features
        enableNodeDrag={true}
        enableZoomPanInteraction={true}
      />
    </div>
  );
}
