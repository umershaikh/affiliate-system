import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '../../../../utils/api';
import './MyTree.css';

const TreeNode = ({ node, isRoot = false, depth = 0 }) => {
  const navigate = useNavigate();
  const initials = node.status !== 'empty'
    ? (node.name || '??').slice(0, 2).toUpperCase()
    : '+';

  const handleEmptyClick = () => {
    if (node.status === 'empty') {
      navigate('/dashboard/create-account');
    }
  };

  return (
    <div className={`mt-branch ${isRoot ? 'mt-branch--root' : ''}`}>
      <div className="mt-node">
        <div
          className={`mt-avatar mt-avatar--${node.status}`}
          onClick={handleEmptyClick}
          style={node.status === 'empty' ? { cursor: 'pointer' } : {}}
          title={node.status === 'empty' ? 'Click to add a member' : ''}
        >
          <span className="mt-avatar__text">{initials}</span>
          {node.status === 'root' && <div className="mt-avatar__ring" />}
        </div>
        <div className="mt-node__info">
          <span className="mt-node__name">{node.name}</span>
          {node.position && node.status !== 'root' && (
            <span className={`mt-badge mt-badge--${node.position}`}>
              {node.position === 'left' ? '← Left' : 'Right →'}
            </span>
          )}
        </div>
      </div>

      {node.children && node.children.length > 0 && (
        <div className="mt-children">
          {node.children.map((child, i) => (
            <TreeNode key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const countNodes = (node) => {
  if (!node || node.status === 'empty') return { total: 0, left: 0, right: 0 };
  let total = 1, left = 0, right = 0;
  if (node.children) {
    node.children.forEach(c => {
      const sub = countNodes(c);
      total += sub.total;
      if (c.position === 'left') left += sub.total;
      if (c.position === 'right') right += sub.total;
    });
  }
  return { total, left, right };
};

const MyTree = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/tree')
      .then(res => res.json())
      .then(data => { setTreeData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mt-page">
        <div className="mt-loader">
          <div className="mt-spinner" />
          <span>Loading your network...</span>
        </div>
      </div>
    );
  }

  if (!treeData || !treeData.name) {
    return (
      <div className="mt-page">
        <div className="mt-empty">
          <div className="mt-empty__icon">🌳</div>
          <h3>No Tree Data</h3>
          <p>Your referral network will appear here once you start building your team.</p>
        </div>
      </div>
    );
  }

  const stats = countNodes(treeData);
  const totalDescendants = stats.total > 0 ? stats.total - 1 : 0;

  return (
    <div className="mt-page">
      {/* Header */}
      <div className="mt-header">
        <div className="mt-header__left">
          <h1 className="mt-header__title">My Network Tree</h1>
          <p className="mt-header__sub">Your binary referral network visualization</p>
        </div>
        <div className="mt-header__stats">
          <div className="mt-stat">
            <span className="mt-stat__num">{stats.left}</span>
            <span className="mt-stat__label">Left-Side Members</span>
          </div>
          <div className="mt-stat">
            <span className="mt-stat__num">{totalDescendants}</span>
            <span className="mt-stat__label">Total Members</span>
          </div>
          <div className="mt-stat">
            <span className="mt-stat__num">{stats.right}</span>
            <span className="mt-stat__label">Right-Side Members</span>
          </div>
        </div>
      </div>

      {/* Tree Card */}
      <div className="mt-card">
        <div className="mt-card__hint">
          <span>👆</span> Scroll horizontally to explore the full tree on smaller screens
        </div>
        <div className="mt-tree-scroll">
          <div className="mt-tree-flow">
            <TreeNode node={treeData} isRoot={true} />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-legend">
        <div className="mt-legend__item">
          <div className="mt-legend__dot mt-legend__dot--root" />
          <span>You (Root)</span>
        </div>
        <div className="mt-legend__item">
          <div className="mt-legend__dot mt-legend__dot--active" />
          <span>Active Member</span>
        </div>
        <div className="mt-legend__item">
          <div className="mt-legend__dot mt-legend__dot--empty" />
          <span>Empty Slot</span>
        </div>
      </div>
    </div>
  );
};

export default MyTree;