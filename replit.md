# MediVault - Medical Records Management System

## Overview
MediVault is a blockchain-based medical records management system that combines a React frontend with an Ethereum smart contract backend. The application allows doctors and patients to manage medical records securely using IPFS for storage and blockchain for data integrity.

## Recent Changes (September 18, 2025)
- Set up complete Replit environment for the GitHub import
- Configured React frontend to run on port 5000 with proper proxy settings
- Installed and configured Ganache blockchain backend on port 8000
- Updated all Web3 connections from port 8545 to 8000 for Replit compatibility
- Successfully deployed smart contracts to local blockchain
- Configured deployment settings for autoscale production deployment

## Project Architecture

### Frontend (`safe/` directory)
- **Framework**: React 17.0.2 with Create React App
- **Styling**: Tailwind CSS with CRACO configuration
- **UI Components**: Syncfusion EJ2 React components
- **State Management**: React Context (ContextProvider)
- **Routing**: React Router DOM v6
- **Web3 Integration**: Web3.js for blockchain interaction
- **IPFS Integration**: ipfs-http-client for file storage
- **Port**: 5000 (configured for Replit proxy with DANGEROUSLY_DISABLE_HOST_CHECK)

### Backend (`backend/` directory)
- **Framework**: Node.js with Web3.js
- **Blockchain**: Ganache CLI for local Ethereum blockchain
- **Smart Contracts**: Solidity ^0.8.9
- **Contract Features**:
  - Doctor registration and management
  - Patient record management
  - CRUD operations for medical data
- **Port**: 8000 (Ganache blockchain node)

### Smart Contract
- **File**: `backend/contracts/Cruds.sol`
- **Functions**:
  - `addDoctor(string memory doc_cid)`: Add doctor with IPFS CID
  - `getDoctor()`: Retrieve all doctors
  - `addPatient(string memory patient_cid)`: Add patient with IPFS CID
  - `getPatient()`: Retrieve all patients

## Key Configuration Files
- `safe/.env`: Environment variables for React (HOST, PORT, host check bypass)
- `safe/craco.config.js`: CRACO configuration for Tailwind CSS
- `safe/tailwind.config.js`: Tailwind CSS customization
- `backend/package.json`: Backend scripts including Ganache setup

## Workflows
1. **Frontend**: `cd safe && npm start` - Runs on port 5000 with webview output
2. **Backend Blockchain**: `cd backend && npm start` - Deploys contracts and runs Ganache

## Development Guidelines
- Frontend should always use port 5000 (only allowed port for webview)
- Backend blockchain runs on port 8000 (due to Replit port restrictions)
- All blockchain connections updated to use localhost:8000 instead of 8545
- Application designed for local blockchain development with IPFS integration

## User Preferences
- Clean, production-ready design using Tailwind CSS
- Medical-focused UI with proper accessibility considerations
- Blockchain integration for data security and integrity
- IPFS integration for decentralized file storage

## Deployment
- **Target**: Autoscale deployment
- **Build**: `cd safe && npm run build` 
- **Run**: `npx serve -s build -l 5000`
- Note: Deployment runs static build, not development server with blockchain backend