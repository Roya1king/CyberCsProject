
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';

// --- Styling Constants ---
const HIGHLIGHT_COLOR = '#FF0072';
const BASE_COLOR = '#B1B1B7';
const DIMMED_OPACITY = 0.25;
const BASE_OPACITY = 1;

// Base node style
const nodeStyle = {
  background: 'linear-gradient(145deg, #2e2b3f, #1e1b2c)',
  color: '#fff',
  border: '1px solid #444',
  borderRadius: 10,
  padding: 6,
  width: 80,
  height: 35,
  fontSize: 10,
  textAlign: 'center',
  boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
};

function LivePacketsGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const ws = useRef<WebSocket | null>(null);

  // --- WebSocket Connection ---
  useEffect(() => {
    const processPacket = ({ source_ip, destination_ip }: any) => {
      setNodes((currentNodes) => {
        const newNodes = [...currentNodes];
        const sourceExists = currentNodes.some((n) => n.id === source_ip);
        const destExists = currentNodes.some((n) => n.id === destination_ip);

        if (!sourceExists) {
          newNodes.push({
            id: source_ip,
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            data: { label: source_ip },
            style: nodeStyle,
          });
        }
        if (!destExists) {
          newNodes.push({
            id: destination_ip,
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            data: { label: destination_ip },
            style: nodeStyle,
          });
        }
        return newNodes;
      });

      setEdges((currentEdges) => {
        const edgeId = `${source_ip}-${destination_ip}`;
        const reverseEdgeId = `${destination_ip}-${source_ip}`;
        const exists = currentEdges.some(
          (e) => e.id === edgeId || e.id === reverseEdgeId
        );

        if (!exists && source_ip !== destination_ip) {
          return [
            ...currentEdges,
            { id: edgeId, source: source_ip, target: destination_ip, animated: true },
          ];
        }
        return currentEdges;
      });
    };

    // Connect WebSocket
    if (!ws.current) {
      ws.current = new WebSocket('ws://localhost:8000/ws/live-packets/');
      ws.current.onopen = () => console.log('✅ WebSocket connected.');
      ws.current.onclose = () => {
        console.log('❌ WebSocket closed.');
        ws.current = null;
      };
      ws.current.onerror = (err) => console.error('WebSocket Error:', err);
    }

    ws.current.onmessage = (event) => {
      try {
        const packet = JSON.parse(event.data);
        if (packet.source_ip && packet.destination_ip) processPacket(packet);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) ws.current.close();
    };
  }, []);

  // --- Highlight connected nodes & edges ---
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (!selectedNodeId) {
          return {
            ...node,
            style: { ...node.style, opacity: BASE_OPACITY, border: nodeStyle.border, transform: 'scale(1)' },
          };
        }

        const isConnected = edges.some(
          (e) =>
            (e.source === selectedNodeId && e.target === node.id) ||
            (e.target === selectedNodeId && e.source === node.id)
        );
        const isSelected = node.id === selectedNodeId;

        return {
          ...node,
          style: {
            ...node.style,
            border: isSelected ? `2px solid ${HIGHLIGHT_COLOR}` : nodeStyle.border,
            opacity: isSelected || isConnected ? BASE_OPACITY : DIMMED_OPACITY,
            transform: isSelected ? 'scale(1.15)' : 'scale(1)',
            boxShadow: isConnected
              ? `0 0 10px ${HIGHLIGHT_COLOR}80`
              : '0 0 10px rgba(255,255,255,0.1)',
          },
        };
      })
    );

    setEdges((eds) =>
      eds.map((edge) => {
        const isConnected =
          edge.source === selectedNodeId || edge.target === selectedNodeId;
        return {
          ...edge,
          animated: !selectedNodeId || isConnected,
          style: {
            ...edge.style,
            stroke: isConnected ? HIGHLIGHT_COLOR : BASE_COLOR,
            strokeWidth: 2,
          },
        };
      })
    );
  }, [selectedNodeId, edges, setNodes, setEdges]);

  // --- Handlers ---
  const onNodeClick = useCallback((_, node) => {
    setSelectedNodeId((current) => (current === node.id ? null : node.id));
  }, []);

  const onPaneClick = useCallback(() => setSelectedNodeId(null), []);

  // --- Render ---
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
        <Background color="#555" gap={16} />
      </ReactFlow>
    </div>
  );
}

export default LivePacketsGraph;

// import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import ReactFlow, {
//   useNodesState,
//   useEdgesState,
//   Background,
//   Controls,
// } from 'reactflow';
// import 'reactflow/dist/style.css';

// // --- Styling Constants ---
// const HIGHLIGHT_COLOR = '#FF0072';
// const BASE_COLOR = '#B1B1B7';
// const DIMMED_OPACITY = 0.25;
// const BASE_OPACITY = 1;

// // Node visual style
// const nodeStyle = {
//   background: 'linear-gradient(145deg, #2e2b3f, #1e1b2c)',
//   color: '#fff',
//   border: '1px solid #444',
//   borderRadius: 10,
//   padding: 6,
//   width: 80,
//   height: 35,
//   fontSize: 10,
//   textAlign: 'center',
//   boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
//   cursor: 'pointer',
//   transition: 'all 0.2s ease-in-out',
// };

// // --- Component ---
// function LivePacketsGraph() {
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [selectedNodeId, setSelectedNodeId] = useState(null);
//   const ws = useRef(null);

//   // --- 1. WebSocket Connection ---
//   useEffect(() => {
//     const processPacket = ({ source_ip, destination_ip }) => {
//       setNodes((currentNodes) => {
//         let newNodes = [...currentNodes];
//         const sourceExists = currentNodes.some((node) => node.id === source_ip);
//         const destExists = currentNodes.some((node) => node.id === destination_ip);

//         if (!sourceExists) {
//           newNodes.push({
//             id: source_ip,
//             position: { x: Math.random() * 500, y: Math.random() * 500 },
//             data: { label: source_ip },
//             style: nodeStyle,
//           });
//         }
//         if (!destExists) {
//           newNodes.push({
//             id: destination_ip,
//             position: { x: Math.random() * 500, y: Math.random() * 500 },
//             data: { label: destination_ip },
//             style: nodeStyle,
//           });
//         }
//         return newNodes;
//       });

//       setEdges((currentEdges) => {
//         const edgeId = `${source_ip}-${destination_ip}`;
//         const reverseEdgeId = `${destination_ip}-${source_ip}`;
//         const edgeExists = currentEdges.some(
//           (edge) => edge.id === edgeId || edge.id === reverseEdgeId
//         );

//         if (!edgeExists && source_ip !== destination_ip) {
//           return [
//             ...currentEdges,
//             { id: edgeId, source: source_ip, target: destination_ip, animated: true },
//           ];
//         }
//         return currentEdges;
//       });
//     };

//     if (!ws.current) {
//       console.log('Attempting to connect to WebSocket...');
//       ws.current = new WebSocket('ws://localhost:8000/ws/live-packets/');
//       ws.current.onopen = () => console.log('✅ WebSocket connection established.');
//       ws.current.onclose = () => {
//         console.log('❌ WebSocket connection closed.');
//         ws.current = null;
//       };
//       ws.current.onerror = (error) => console.error('WebSocket Error:', error);
//     }

//     ws.current.onmessage = (event) => {
//       try {
//         const packet = JSON.parse(event.data);
//         if (packet.source_ip && packet.destination_ip) {
//           processPacket(packet);
//         }
//       } catch (error) {
//         console.error('Error parsing WebSocket message:', error);
//       }
//     };

//     return () => {
//       if (ws.current && ws.current.readyState === WebSocket.OPEN) {
//         ws.current.close();
//       }
//     };
//   }, []);

//   // --- 2. Derived State for Highlighting ---
//   const styledNodes = useMemo(() => {
//     return nodes.map((node) => {
//       if (!selectedNodeId) {
//         return { ...node, style: { ...nodeStyle, opacity: BASE_OPACITY } };
//       }
//       const isConnected = edges.some(
//         (edge) =>
//           (edge.source === selectedNodeId && edge.target === node.id) ||
//           (edge.target === selectedNodeId && edge.source === node.id)
//       );
//       const isSelected = node.id === selectedNodeId;
//       return {
//         ...node,
//         style: {
//           ...nodeStyle,
//           border: isSelected ? `2px solid ${HIGHLIGHT_COLOR}` : nodeStyle.border,
//           opacity: isSelected || isConnected ? BASE_OPACITY : DIMMED_OPACITY,
//           transform: isSelected ? 'scale(1.15)' : 'scale(1)',
//         },
//       };
//     });
//   }, [nodes, edges, selectedNodeId]);

//   const styledEdges = useMemo(() => {
//     return edges.map((edge) => {
//       const isConnected =
//         edge.source === selectedNodeId || edge.target === selectedNodeId;
//       return {
//         ...edge,
//         animated: !selectedNodeId || isConnected,
//         style: { stroke: isConnected ? HIGHLIGHT_COLOR : BASE_COLOR, strokeWidth: 2 },
//       };
//     });
//   }, [edges, selectedNodeId]);

//   // --- 3. Click Handlers ---
//   const onNodeClick = useCallback((event, node) => {
//     setSelectedNodeId((currentId) => (currentId === node.id ? null : node.id));
//   }, []);

//   const onPaneClick = useCallback(() => {
//     setSelectedNodeId(null);
//   }, []);

//   // --- 4. JSX Rendering ---
//   return (
//     <div style={{ width: '100%', height: 'calc(100vh - 4rem)', backgroundColor: '#1a192b' }}>
//       <ReactFlow
//         nodes={styledNodes}
//         edges={styledEdges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onNodeClick={onNodeClick}
//         onPaneClick={onPaneClick}
//         fitView
//         attributionPosition="bottom-left"
//       >
//         <Controls />
//         <Background color="#555" gap={16} />
//       </ReactFlow>
//     </div>
//   );
// }

// export default LivePacketsGraph;
