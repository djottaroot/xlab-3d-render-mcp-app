
export const RECALL_CHEAT_SHEET = `
# 3D Scene Element Format Reference

To render a 3D scene, provide a JSON array of elements. Each element defines a primitive shape or an operation.

## Primitives

### Cube / Cuboid
- type: "cube"
- size: [width, height, depth] (default: [1, 1, 1])
- position: [x, y, z] (default: [0, 0, 0])
- rotation: [x, y, z] (radians, default: [0, 0, 0])
- color: string (hex or name, default: "gray")

### Sphere
- type: "sphere"
- radius: number (default: 1)
- segments: number (complexity, default: 32)
- position: [x, y, z]
- color: string

### Cylinder
- type: "cylinder"
- radius: number (at top and bottom)
- height: number
- segments: number
- position: [x, y, z]
- rotation: [x, y, z]
- color: string

## State Management

### restoreCheckpoint
- type: "restoreCheckpoint"
- id: string (The checkpoint ID to load as a base)

### delete
- type: "delete"
- ids: string (Comma-separated list of element IDs to remove from the restored state)

## Tips
- Always use **meters** as units.
- Y-axis is **UP**.
- Stick to a **4:3 aspect ratio** if updating camera views (not currently supported but good to keep in mind).
- Colors can be hex (#RRGGBB) or CSS names.
`;