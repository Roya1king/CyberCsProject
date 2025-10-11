import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';

// --- Styling Constants ---
const HIGHLIGHT_COLOR = '#FF0072'; // A bright color for highlighted edges
const BASE_COLOR = '#B1B1B7';      // The default color for edges
const DIMMED_OPACITY = 0.2;       // Opacity for non-highlighted nodes
const BASE_OPACITY = 1;           // Opacity for highlighted nodes

// --- Component ---
function LivePacketsGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const ws = useRef(null); // Use a ref to hold the WebSocket instance

  // --- 1. WebSocket Connection and Style Injection ---
  useEffect(() => {
    // Dynamically inject the CSS for React Flow from a CDN
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/reactflow@11/dist/style.css';
    document.head.appendChild(link);

    // Connect only if there's no existing WebSocket connection
    if (!ws.current) {
      console.log("Attempting to connect to WebSocket...");
      ws.current = new WebSocket('ws://localhost:8000/ws/live-packets/');

      ws.current.onopen = () => {
        console.log('✅ WebSocket connection established.');
      };

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

      ws.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };

      ws.current.onclose = () => {
        console.log('❌ WebSocket connection closed.');
        ws.current = null; // Clear the ref when connection closes
      };
    }

    // Cleanup function
    return () => {
      // We only close the WebSocket when the component truly unmounts
      if(ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.close();
      }
      // Check if the link is still a child of head before removing
      if (link.parentNode === document.head) {
        document.head.removeChild(link);
      }
    };
  // We need processPacket in the dependency array if it's used inside the effect.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const processPacket = useCallback(({ source_ip, destination_ip }) => {
    // Add nodes if they don't exist
    setNodes((currentNodes) => {
      const newNodes = [...currentNodes];
      const sourceExists = currentNodes.some((node) => node.id === source_ip);
      const destExists = currentNodes.some((node) => node.id === destination_ip);

      if (!sourceExists) {
        newNodes.push({
          id: source_ip,
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          data: { label: source_ip },
          style: { opacity: selectedNodeId ? DIMMED_OPACITY : BASE_OPACITY }
        });
      }
      if (!destExists) {
        newNodes.push({
          id: destination_ip,
          position: { x: Math.random() * 500, y: Math.random() * 500 },
          data: { label: destination_ip },
          style: { opacity: selectedNodeId ? DIMMED_OPACITY : BASE_OPACITY }
        });
      }
      return newNodes;
    });

    // Add edge if it doesn't exist
    setEdges((currentEdges) => {
      const edgeId = `${source_ip}-${destination_ip}`;
      const reverseEdgeId = `${destination_ip}-${source_ip}`;
      const edgeExists = currentEdges.some(
        (edge) => edge.id === edgeId || edge.id === reverseEdgeId
      );

      if (!edgeExists && source_ip !== destination_ip) {
        const newEdge = {
          id: edgeId,
          source: source_ip,
          target: destination_ip,
          animated: true,
          style: { stroke: BASE_COLOR }
        };
        return [...currentEdges, newEdge];
      }
      return currentEdges;
    });
  }, [selectedNodeId, setNodes, setEdges]);

  // --- 2. Node Click and Highlighting Logic ---
  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId((prevSelectedId) => (prevSelectedId === node.id ? null : node.id));
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (!selectedNodeId) {
          node.style = { ...node.style, opacity: BASE_OPACITY };
        } else {
          const isConnected = edges.some(
            (edge) => (edge.source === selectedNodeId && edge.target === node.id) ||
                      (edge.target === selectedNodeId && edge.source === node.id)
          );
          const isSelected = node.id === selectedNodeId;
          node.style = { ...node.style, opacity: isSelected || isConnected ? BASE_OPACITY : DIMMED_OPACITY };
        }
        return node;
      })
    );

    setEdges((eds) =>
      eds.map((edge) => {
        if (!selectedNodeId) {
            edge.style = { ...edge.style, stroke: BASE_COLOR };
            edge.animated = true;
        } else {
            const isConnected = edge.source === selectedNodeId || edge.target === selectedNodeId;
            edge.style = { ...edge.style, stroke: isConnected ? HIGHLIGHT_COLOR : BASE_COLOR };
            edge.animated = isConnected;
        }
        return edge;
      })
    );
  }, [selectedNodeId, edges, setNodes, setEdges]);


  // --- 3. JSX Rendering ---
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 4rem)', backgroundColor: '#1a192b' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
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

