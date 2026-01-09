Teger AI: Advanced Social Engineering Detection

Teger AI (derived from the Latin detegere — to uncover) is a cognitive security intelligence engine built to unmask psychological manipulation in enterprise communications.

Developed for the Gemini 3 Hackathon, Teger AI moves beyond static keyword filtering by utilizing Gemini 3's High-Reasoning (Thinking) capabilities to analyze the "Dissonance" between a sender's claimed identity and their actual intent.

🛡️ The Inspiration

In September 2023, the MGM Resorts hack proved that even the most secure companies can be brought down by a 10-minute conversation. Attackers don't "hack in" anymore; they "log in" by exploiting human empathy, urgency, and fear.

Teger AI was built to stop Linguistic Dissonance—the subtle gap between an attacker's tone and their claimed identity. When a "CEO" sends a panicked message asking for gift cards, Teger AI's reasoning engine catches the mismatch that traditional security filters miss.

🚀 Key Features

Linguistic Dissonance Engine: Detects tonal shifts and "Authority Drift" using Gemini 3's deep reasoning.

Contextual Intent Analysis: Evaluates high-risk requests (financial transfers, credential resets) against platform norms.

In-Browser Sensor Layer: A Chrome Extension that injects scanning capabilities directly into Gmail and Slack.

SOC Forensic Lab: A standalone React dashboard for detailed threat auditing and reasoning visualization.

🛠️ Technical Stack

AI Engine: Gemini 3 Pro / Gemini 2.5 Flash

Extension: Chrome Extension API (Manifest V3)

Frontend: React + Tailwind CSS

Reasoning Architecture: Forensic Linguistic Prompting + High Thinking Levels

📂 Repository Structure

teger-ai/
├── extension/       # Chrome Extension (The "Sensor")
├── dashboard/       # SOC Analysis Lab (The "Brain")
├── docs/            # Architecture diagrams & research notes
├── LICENSE          # MIT License
└── README.md        # Project Documentation


🔧 Setup & Installation

Chrome Extension

Clone this repository.

Open Chrome and navigate to chrome://extensions/.

Enable Developer Mode (top right).

Click Load Unpacked and select the /extension folder from this repo.

SOC Dashboard (Local Development)

Navigate to the /dashboard directory.

Install dependencies: npm install

Start the lab: npm start

🧠 Why Gemini 3?

Social engineering is a human-centric attack. Teger AI utilizes Gemini 3’s High Thinking Levels to simulate the logical flow of a human forensic linguist. By analyzing "Dark Patterns" like artificial urgency, power dynamics, and emotional anchoring, Teger AI provides a defense layer that evolves alongside modern attack vectors.

⚖️ License

Distributed under the MIT License. See LICENSE for more information.

Built with 💙 for the Gemini 3 Hackathon.
