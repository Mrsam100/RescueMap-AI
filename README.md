# RescueMap AI

> A frontend-only mission control dashboard for simulated disaster-response mapping, incident monitoring, and route intelligence.

## Overview

RescueMap AI is a browser-based concept for rescue teams operating in areas where normal navigation infrastructure may be unavailable or unreliable. The interface presents a single mission workspace for reviewing simulated incidents, terrain hazards, survivor signals, response teams, and recommended routes.

This repository contains the complete frontend prototype. It does **not** connect to drones, rovers, cameras, GPS devices, cloud services, computer-vision models, or a production database. All map markers, metrics, incidents, routes, and telemetry shown in the UI are local mock data.

## Product Goals

- Give field commanders a fast overview of active rescue operations.
- Visualize hazards, survivor signals, responder units, and recommended routes in one place.
- Make time-based mission summaries easy to compare.
- Provide a clear path from a frontend demonstration to a future edge-deployable platform.

## Features

### Mission overview

- Active incident queue with selectable incidents.
- People-at-risk, route, device, and confidence metrics.
- Terrain detection summary for flood water, debris, unstable terrain, and survivor signals.
- Response readiness ring for simulated team and device health.
- Dismissible route-recalculation notification.

### Live map

- Detailed simulated terrain map with roads, river, contour lines, sectors, and grid resolution.
- Hazard and survivor markers with selectable intelligence panels.
- Layer controls for hazards, survivor signals, and recommended routes.
- Zoom in, zoom out, and recenter controls.
- Toggle between safest-route and fastest-route views.
- Simulated ETA, distance, exposure, coverage, and route completion details.

### Mission workspace pages

The sidebar includes functional simulated views for:

- Live map
- Incident manager
- Response analytics
- Video feed monitor
- Mission reports
- Response team
- Workspace settings

### Time-range snapshots

The time selector updates the simulated overview data for:

- Last 6 hours
- Last 24 hours
- Last 7 days
- All time

## Technology

- React 19
- Vite
- Lucide React icons
- CSS with responsive desktop and mobile layouts
- Local component state for interactions
- No backend or external data source required

## Project Structure

```text
RescueMap/
├── index.html
├── package.json
├── package-lock.json
├── src/
│   ├── main.jsx          # React application and simulated UI state
│   ├── styles.css        # Core visual system and responsive layout
│   ├── controls.css      # Dropdown, scanning, and map-control states
│   ├── layout-fixes.css  # Sticky navigation behavior
│   └── live-map.css      # Dedicated live-map command view
└── .gitignore
```

## Requirements

- Node.js 18 or newer
- npm 9 or newer

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/Mrsam100/RescueMap-AI.git
cd RescueMap-AI
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173/
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Demo Workflow

1. Open the Overview page.
2. Select an incident from the priority queue.
3. Change the time range to compare simulated metrics.
4. Use **Run new scan** to see scanning and completion states.
5. Open **Live map** from the sidebar.
6. Toggle map layers and select hazard or survivor markers.
7. Zoom or recenter the map and switch the route mode.
8. Explore Incidents and Analytics from the mission navigation.

## Future Production Architecture

The current UI is intentionally decoupled from hardware and live services. A production implementation could add the following adapters behind the existing screens:

```text
Video source / file upload
	↓
Frame extraction service
	↓
Terrain segmentation + object detection
	↓
Traversability grid
	↓
A* route planner
	↓
Mission API / local edge store
	↓
RescueMap dashboard
```

Potential production modules include:

- A local video-ingestion service for standard drone or rover feeds.
- DINOv2 or another segmentation model for terrain understanding.
- YOLOv8 or another detector for debris, water, and survivor detection.
- A grid-generation service that converts detections into traversability costs.
- A route-planning service using A* or a comparable pathfinding algorithm.
- A local WebSocket or HTTP API for streaming updates to the dashboard.
- Offline-first storage for mission snapshots and incident reports.

## Data and Safety Note

This project is a visual and interaction prototype. It must not be used to make real-world evacuation, navigation, rescue, or safety decisions. The displayed coordinates, people counts, confidence values, routes, and statuses are fictional demonstration data.

## License

No license has been specified for this repository yet.