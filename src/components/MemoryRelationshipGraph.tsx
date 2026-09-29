import React, { useState } from 'react';
import {
  Brain,
  Shield,
  Layers,
  FileCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { HindsightMemory } from '../types';

interface MemoryRelationshipGraphProps {
  memories: HindsightMemory[];
  onSelectMemory?: (memoryId: string) => void;
}

interface GraphNode {
  id: string;
  label: string;
  type: 'INCIDENT' | 'ROOT_CAUSE' | 'CONTROL' | 'REMEDIATION' | 'EVIDENCE' | 'POST_MORTEM';
  x: number;
  y: number;
  details: string;
  color: string;
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
}

export const MemoryRelationshipGraph: React.FC<MemoryRelationshipGraphProps> = ({
  memories,
  onSelectMemory
}) => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  // Defined Nodes for the core INC-1024 -> INC-1038 Knowledge Map
  const nodes: GraphNode[] = [
    {
      id: 'node-inc-1024',
      label: 'INC-1024: Public Storage Exposure',
      type: 'INCIDENT',
      x: 120,
      y: 80,
      details: 'Production customer-data-bucket exposed via unauthenticated read ACL.',
      color: '#38bdf8' // cyan
    },
    {
      id: 'node-rc-1024',
      label: 'Root Cause: Incorrect Access Policy',
      type: 'ROOT_CAUSE',
      x: 380,
      y: 80,
      details: 'Inherited IAM policy template failed to override default bucket ACL.',
      color: '#f43f5e' // rose
    },
    {
      id: 'node-ctrl-ac',
      label: 'Control: Access Control (AC-01)',
      type: 'CONTROL',
      x: 640,
      y: 160,
      details: 'SOC 2 CC6.1 & ISO 27001 A.9.1 least-privilege boundary specification.',
      color: '#a855f7' // purple
    },
    {
      id: 'node-rem-0042',
      label: 'Remediation: Review IAM & Block Public Access',
      type: 'REMEDIATION',
      x: 380,
      y: 220,
      details: 'Automated patch deployed, organization BPA enforced, 24/7 monitoring enabled.',
      color: '#10b981' // emerald
    },
    {
      id: 'node-evd-301',
      label: 'Evidence: EVD-301 Configuration Snapshot',
      type: 'EVIDENCE',
      x: 120,
      y: 220,
      details: 'SHA-256 verified configuration baseline and CloudTrail trace log.',
      color: '#f59e0b' // amber
    },
    {
      id: 'node-inc-1038',
      label: 'INC-1038: Public Storage Exposure',
      type: 'INCIDENT',
      x: 120,
      y: 340,
      details: 'Recurring exposure on customer-reports-bucket. Recalled INC-1024 with 92% similarity.',
      color: '#38bdf8'
    },
    {
      id: 'node-pm-1024',
      label: 'Post-Mortem: PM-1024 Stored in Hindsight',
      type: 'POST_MORTEM',
      x: 640,
      y: 320,
      details: 'Permanent organizational memory artifact capturing root causes and preventive SCP rules.',
      color: '#6366f1' // indigo
    }
  ];

  const edges: GraphEdge[] = [
    { from: 'node-inc-1024', to: 'node-rc-1024', label: 'CAUSED_BY' },
    { from: 'node-rc-1024', to: 'node-ctrl-ac', label: 'MAPS_TO' },
    { from: 'node-rc-1024', to: 'node-rem-0042', label: 'REMEDIATED_BY' },
    { from: 'node-rem-0042', to: 'node-evd-301', label: 'SUPPORTED_BY' },
    { from: 'node-inc-1038', to: 'node-inc-1024', label: 'RECALLS (92%)' },
    { from: 'node-inc-1038', to: 'node-ctrl-ac', label: 'MAPS_TO' },
    { from: 'node-inc-1024', to: 'node-pm-1024', label: 'RETAINED_IN' },
    { from: 'node-rem-0042', to: 'node-pm-1024', label: 'INFORMS' }
  ];

  const filteredNodes = filterType === 'ALL'
    ? nodes
    : nodes.filter(n => n.type === filterType);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl">
      {/* Graph Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span>Hindsight Knowledge & Relationship Graph</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive associative memory connecting incidents, root causes, controls, remediation, and evidence
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-[11px] font-medium">
          {['ALL', 'INCIDENT', 'ROOT_CAUSE', 'CONTROL', 'REMEDIATION', 'EVIDENCE'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-blue-600/30 text-cyan-300 font-bold border border-blue-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative overflow-x-auto bg-slate-950/80 rounded-lg border border-slate-800/60 p-2 min-h-[420px] flex items-center justify-center">
        <svg
          viewBox="0 0 820 440"
          className="w-full h-auto max-w-4xl"
          style={{ minWidth: '700px' }}
        >
          {/* Defs for Arrowhead Markers */}
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
            </marker>
            <marker
              id="arrow-cyan"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
            </marker>
          </defs>

          {/* Render Edges */}
          {edges.map((edge, idx) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isRecallEdge = edge.label.includes('RECALLS');
            const isHighlighted = selectedNode && (selectedNode.id === edge.from || selectedNode.id === edge.to);

            return (
              <g key={idx}>
                <line
                  x1={fromNode.x + 80}
                  y1={fromNode.y + 20}
                  x2={toNode.x + 80}
                  y2={toNode.y + 20}
                  stroke={isRecallEdge ? '#06b6d4' : isHighlighted ? '#94a3b8' : '#334155'}
                  strokeWidth={isRecallEdge ? 2.5 : isHighlighted ? 2 : 1.5}
                  strokeDasharray={isRecallEdge ? '5,5' : undefined}
                  markerEnd={isRecallEdge ? 'url(#arrow-cyan)' : 'url(#arrow)'}
                  className="transition-colors"
                />
                <text
                  x={(fromNode.x + toNode.x) / 2 + 80}
                  y={(fromNode.y + toNode.y) / 2 + 15}
                  fill={isRecallEdge ? '#38bdf8' : '#64748b'}
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="select-none font-semibold"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Render Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer group"
                transform={`translate(${node.x}, ${node.y})`}
              >
                {/* Node Box */}
                <rect
                  width="180"
                  height="44"
                  rx="8"
                  fill="#090d16"
                  stroke={isSelected ? '#38bdf8' : node.color}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-all filter drop-shadow group-hover:brightness-125"
                />

                {/* Node Type Pill Indicator */}
                <rect
                  x="8"
                  y="8"
                  width="6"
                  height="28"
                  rx="3"
                  fill={node.color}
                />

                {/* Node Label */}
                <text
                  x="20"
                  y="20"
                  fill="#f8fafc"
                  fontSize="10"
                  fontWeight="600"
                  fontFamily="sans-serif"
                  className="select-none"
                >
                  {node.label.length > 25 ? node.label.slice(0, 23) + '...' : node.label}
                </text>

                {/* Node Subtitle */}
                <text
                  x="20"
                  y="34"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  className="select-none"
                >
                  {node.type}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <div className="mt-4 p-3.5 bg-slate-900 border border-slate-800 rounded-lg flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40">
                {selectedNode.type}
              </span>
              <h4 className="text-xs font-bold text-slate-100">{selectedNode.label}</h4>
            </div>
            <p className="text-xs text-slate-300">{selectedNode.details}</p>
          </div>

          <button
            onClick={() => setSelectedNode(null)}
            className="text-slate-400 hover:text-slate-200 text-xs px-2 py-1 rounded bg-slate-800"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
