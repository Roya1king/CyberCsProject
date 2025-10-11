# 🔐 Cyber Security Dashboard – Frontend

![npm](https://img.shields.io/badge/npm-v9.0.0-red?logo=npm)  
![React](https://img.shields.io/badge/React-18-blue?logo=react)  
![Vite](https://img.shields.io/badge/Vite-frontend-yellow?logo=vite)  
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?logo=tailwind-css)  
![shadcn/ui](https://img.shields.io/badge/shadcn-ui-black?logo=vercel)  
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)  
![WebSockets](https://img.shields.io/badge/WebSockets-Live-green?logo=socketdotio)

This repository contains the **frontend code** for a real-time **Network Traffic Monitoring and Incident Response Dashboard**.  
The application provides an **intuitive, responsive, and dynamic UI** to visualize network activity, detect anomalies, and monitor network health in real-time.

---

## 🚀 Key Features

- **📊 Real-time Network Visualization**  
  Interactive charts and tables to monitor live traffic and alerts.  

- **💡 "Top Talker" Identification**  
  Detect and analyze the most active hosts on the network using Suricata logs.  

- **🌐 Network Health Monitoring**  
  Measure key metrics like **Round-Trip Time (RTT)** and **Time-To-Live (TTL)** via Ping utility.  

- **⚠️ Policy Violation Alerts**  
  Custom Suricata rule sets to flag unauthorized ports, suspicious protocols, and access violations.  

- **🛡️ Intrusion Detection**  
  Integration with **Suricata IDS/NSM** engine for deep packet inspection and real-time intrusion detection.  

---

## 🛠️ Tech Stack

- **Framework:** [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)  
- **Language:** TypeScript  
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)  
- **Data Fetching:** Fetch API  
- **Real-time Communication:** WebSockets  

---

## ⚡ Getting Started

Follow these steps to run the project locally:

### ✅ Prerequisites
- [Node.js (LTS)](https://nodejs.org/en/)  
- npm or yarn package manager  

### 📥 Installation
Clone the repository:
```bash
git clone https://github.com/Kuldeepagrahari/CyberSecurityClient.git
cd CyberSecurityClient

Install dependencies:
npm install
# or
yarn install

▶️ Running the Application

Start the dev server:
npm run dev
# or
yarn dev


Open your browser at:
👉 http://localhost:5173
 (default Vite port)
