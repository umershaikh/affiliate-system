import React from 'react';
import './MyTree.css';

const treeData = {
  name: "user",
  status: "root",
  children: [
    {
      name: "Subuser",
      status: "active",
      children: [
        {
          name: "Subuser",
          status: "active",
          children: [
            { name: "Subuser", status: "filled" },
            { name: "Subuser", status: "empty" }
          ]
        },
        {
          name: "Subuser",
          status: "active",
          children: [
            { name: "Subuser", status: "filled" },
            { name: "Subuser", status: "filled" }
          ]
        }
      ]
    },
    {
      name: "Subuser",
      status: "filled",
      children: [
        {
          name: "Subuser",
          status: "empty",
          children: [
            { name: "Subuser", status: "empty" },
            { name: "Subuser", status: "empty" }
          ]
        },
        {
          name: "Subuser",
          status: "filled",
          children: [
            { name: "Subuser", status: "filled" },
            { name: "Subuser", status: "filled" }
          ]
        }
      ]
    }
  ]
};

const TreeNode = ({ node, isRoot = false }) => {
  return (
    <div className={`MT_node_branch ${isRoot ? 'MT_is_root' : ''}`}>
      <div className="MT_node_item">
        <div className={`MT_avatar_outer ${node.status}`}>
          <div className="MT_avatar_inner">
            {node.status === 'empty' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
          </div>
        </div>
        <span className="MT_node_name">{node.name}</span>
      </div>

      {node.children && node.children.length > 0 && (
        <div className="MT_children_wrapper">
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const MyTree = () => {
  return (
    <div className="MT_page_bg">
      <div className="MT_card_container">
        <h2 className="MT_card_title">My Tree</h2>
        <div className="MT_tree_flow">
          <TreeNode node={treeData} isRoot={true} />
        </div>
      </div>
    </div>
  );
};

export default MyTree;