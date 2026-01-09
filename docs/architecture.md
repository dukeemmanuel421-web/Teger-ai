Teger AI: Technical Architecture & Intelligence Flow

This document details the multi-layered architecture of Teger AI, an advanced security engine that utilizes Gemini 3's reasoning capabilities to detect psychological manipulation in digital communications.

1. High-Level Logic Flow

Teger AI operates on a "Capture-Reason-Alert" cycle. Unlike traditional filters that rely on static regex or keyword blacklists, Teger AI analyzes the cognitive dissonance between a sender's claimed identity and their actual intent.

graph TD
    subgraph "Sensor Layer (Chrome Extension)"
        A[Communication Platform: Gmail/Slack] -->|DOM MutationObserver| B(Scan Intent Trigger)
        B -->|Context Capture| C{Content Script}
        C -->|Metadata + Body| D[Chrome Local Storage]
    end

    subgraph "Reasoning Layer (Gemini 3 Engine)"
        D -->|Popup Analysis Request| E[Orchestrator]
        E -->|System Instructions: Forensic Linguist| F[Gemini 3 API]
        F -->|Thinking Level: High| G[Linguistic Dissonance Analysis]
        F -->|Thinking Level: High| H[Psychological Trigger Mapping]
        G & H -->|Structured Logic| I[JSON Assessment]
    end

    subgraph "Interface Layer"
        I -->|Dynamic UI Rendering| J[User Alert / Forensic Report]
        J -->|Risk Score & Tactics| A
    end


2. Component Deep Dive

A. The Sensor Layer (Chrome Extension)

Injection: Injected via Manifest V3 content_scripts, Teger AI monitors the DOM for message containers.

Contextual Awareness: The sensor doesn't just scrape text; it extracts the Claimed Sender and the Platform Environment. This is crucial for the AI to determine if the tone of the message aligns with the professional context of the platform.

B. The Brain (Gemini 3 High-Reasoning)

The core differentiator of Teger AI is its use of Gemini 3’s reasoning capabilities.

Linguistic Dissonance: The model evaluates the "Authorized Persona." If a CEO suddenly uses informal, panicked, or uncharacteristically urgent language, Teger AI flags the dissonance.

Thinking Configuration: By utilizing thinking_level: high, the model performs a multi-step "Chain of Thought" before responding. It asks itself: "Is this request typical for this sender? Are there psychological anchors being used to bypass the user's critical thinking?"

C. The Forensic SOC Dashboard

The dashboard provides a high-fidelity environment for security professionals to perform manual audits. It visualizes the same reasoning process used by the extension, allowing for detailed threat hunting across enterprise communications.

3. Threat Detection Taxonomy

Teger AI is trained to recognize specific "Dark Patterns" including:

Authority Bias: Leveraging fake titles to bypass standard security protocols.

Artificial Scarcity: Creating a false sense of a "limited window" to force a quick, unverified decision.

Implicit Threats: Using subtle linguistic cues to imply negative consequences for non-compliance.

4. Technical Specifications

Model: gemini-2.5-flash-preview-09-2025 (configured for high-reasoning)

Response Format: Strictly Typed JSON for UI stability.

Communication: Secure HTTPS via fetch with exponential backoff handling to ensure resilience in high-latency environments.

Teger AI: Uncovering the human element in cyber-attacks through advanced AI reasoning.
