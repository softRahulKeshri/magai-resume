/**
 * Simple Group API Functions
 *
 * Basic functions to call the group APIs without complex architecture.
 * Easy to understand and use.
 */

import { Group } from "../types";

const API_BASE = "http://127.0.0.1:5001/api";

// Get all groups
export async function fetchGroups(): Promise<Group[]> {
  try {
    const response = await fetch(`${API_BASE}/groups`);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    return [];
  }
}

// Create a new group
export async function createGroup(name: string): Promise<Group | null> {
  try {
    const response = await fetch(`${API_BASE}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create group:", error);
    return null;
  }
}

// Delete a group
export async function deleteGroup(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/groups/${id}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to delete group:", error);
    return false;
  }
}
