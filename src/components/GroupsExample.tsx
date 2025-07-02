/**
 * Simple Groups Example Component
 *
 * Shows how to use the useGroups hook in a basic way.
 */

import React, { useState } from "react";
import { useGroups } from "../hooks/useGroups";

export function GroupsExample() {
  const { groups, loading, error, createGroup, deleteGroup, refreshGroups } =
    useGroups();
  const [newGroupName, setNewGroupName] = useState("");

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newGroupName.trim()) {
      try {
        await createGroup({ name: newGroupName.trim() });
        setNewGroupName(""); // Clear the input
      } catch (error) {
        // Error is already handled by the hook
        console.error("Failed to create group:", error);
      }
    }
  };

  const handleDeleteGroup = async (id: number, name: string) => {
    if (window.confirm(`Delete group "${name}"?`)) {
      await deleteGroup(id);
    }
  };

  if (loading) {
    return <div>Loading groups...</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Groups Manager</h2>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>Error: {error}</div>
      )}

      {/* Create Group Form */}
      <form onSubmit={handleCreateGroup} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter group name"
          style={{ padding: "8px", marginRight: "10px", width: "200px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Create Group
        </button>
      </form>

      {/* Refresh Button */}
      <button
        onClick={refreshGroups}
        style={{ padding: "8px 16px", marginBottom: "20px" }}
      >
        Refresh Groups
      </button>

      {/* Groups List */}
      <div>
        <h3>Groups ({groups.length})</h3>
        {groups.length === 0 ? (
          <p>No groups found. Create one above!</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {groups.map((group) => (
              <li
                key={group.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  border: "1px solid #ddd",
                  marginBottom: "8px",
                  borderRadius: "4px",
                }}
              >
                <div>
                  <strong>{group.name}</strong>
                  <br />
                  <small>
                    Created: {new Date(group.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <button
                  onClick={() => handleDeleteGroup(group.id, group.name)}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
