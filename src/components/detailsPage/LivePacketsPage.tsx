import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from 'reactflow';
// The 'import' is better than a CDN link, but I'll keep your CDN logic if you need it.
import 'reactflow/dist/style.css';

// --- Styling Constants ---
const HIGHLIGHT_COLOR = '#FF0072';
const BASE_COLOR = '#B1B1B7';
const DIMMED_OPACITY = 0.2;
const BASE_OPACITY = 1;

// --- Component ---
function LivePacketsGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const ws = useRef(null);

  // --- 1. WebSocket Connection ---
  useEffect(() => {
    // The packet processing logic is now defined inside the effect
    // to avoid stale closures and simplify dependencies.
    const processPacket = ({ source_ip, destination_ip }) => {
      setNodes((currentNodes) => {
        let newNodes = [...currentNodes];
        const sourceExists = currentNodes.some((node) => node.id === source_ip);
        const destExists = currentNodes.some((node) => node.id === destination_ip);

        if (!sourceExists) {
          newNodes.push({
            id: source_ip,
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            data: { label: source_ip },
          });
        }
        if (!destExists) {
          newNodes.push({
            id: destination_ip,
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            data: { label: destination_ip },
          });
        }
        return newNodes;
      });

      setEdges((currentEdges) => {
        const edgeId = `${source_ip}-${destination_ip}`;
        const reverseEdgeId = `${destination_ip}-${source_ip}`;
        const edgeExists = currentEdges.some(
          (edge) => edge.id === edgeId || edge.id === reverseEdgeId
        );

        if (!edgeExists && source_ip !== destination_ip) {
          return [...currentEdges, { id: edgeId, source: source_ip, target: destination_ip }];
        }
        return currentEdges;
      });
    };

    if (!ws.current) {
      console.log("Attempting to connect to WebSocket...");
      ws.current = new WebSocket('ws://localhost:8000/ws/live-packets/');
      ws.current.onopen = () => console.log('✅ WebSocket connection established.');
      ws.current.onclose = () => {
        console.log('❌ WebSocket connection closed.');
        ws.current = null;
      };
      ws.current.onerror = (error) => console.error('WebSocket Error:', error);
    }
    
    // Assign the message handler here
    ws.current.onmessage = (event) => {
      try {
        const packet = JSON.parse(event.data);
        if (packet.source_ip && packet.destination_ip) {
          processPacket(packet);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    // Cleanup on component unmount
    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []); // Empty dependency array is correct now.

  // --- 2. Derived State for Highlighting (using useMemo) ---
  const styledNodes = useMemo(() => {
    return nodes.map((node) => {
      if (!selectedNodeId) {
        return { ...node, style: { opacity: BASE_OPACITY } };
      }
      const isConnected = edges.some(
        (edge) => (edge.source === selectedNodeId && edge.target === node.id) ||
                  (edge.target === selectedNodeId && edge.source === node.id)
      );
      const isSelected = node.id === selectedNodeId;
      return {
        ...node,
        style: { opacity: isSelected || isConnected ? BASE_OPACITY : DIMMED_OPACITY },
      };
    });
  }, [nodes, edges, selectedNodeId]);

  const styledEdges = useMemo(() => {
    return edges.map((edge) => {
      const isConnected = edge.source === selectedNodeId || edge.target === selectedNodeId;
      return {
        ...edge,
        animated: !selectedNodeId || isConnected,
        style: { stroke: isConnected ? HIGHLIGHT_COLOR : BASE_COLOR },
      };
    });
  }, [edges, selectedNodeId]);

  // --- 3. Click Handlers ---
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId((currentId) => (currentId === node.id ? null : node.id));
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  // --- 4. JSX Rendering ---
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 4rem)', backgroundColor: '#1a192b' }}>
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}

export default LivePacketsGraph;