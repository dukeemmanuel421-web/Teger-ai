import os
import json
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

# 1. Setup FastAPI
app = FastAPI(
    title="Teger AI: Forensic Analysis Engine",
    description="Gemini 3-powered psychological analysis for enterprise communications.",
    version="2.0.0"
)

# Enable CORS so your React Dashboard and Chrome Extension can talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini 3 Client
# On your hosting provider (Render/Vercel/Cloud Run), set the GEMINI_API_KEY environment variable.
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

# 2. Data Models
class MessageAnalysisRequest(BaseModel):
    sender: str
    content: str
    platform: str
    metadata: Optional[dict] = {}

class SecurityAssessment(BaseModel):
    risk_score: int
    threat_level: str
    tactics: List[str]
    triggers: List[str]
    dissonance_report: str
    mitigation_steps: str

# 3. The Analysis Endpoint
@app.post("/analyze", response_model=SecurityAssessment)
async def analyze_message(request: MessageAnalysisRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="Server API Key not configured.")

    try:
        system_instruction = f"""
        You are a Senior Forensic Linguist and Cybersecurity Analyst. 
        Your task is to perform deep psychological profiling on {request.platform} communications.
        
        Analyze for 'Social Engineering Dissonance':
        - LINGUISTIC DRIFT: Does a high-level executive use unusually informal or urgent grammar?
        - POWER DYNAMICS: Is the sender leveraging 'Authority' to bypass protocols?
        - PSYCHOLOGICAL ANCHORING: Is the sender using fear or urgency to narrow the user's focus?
        """

        user_prompt = f"SENDER: {request.sender}\nCONTENT: {request.content}"

        # Gemini 3 Call with HIGH thinking level
        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-09-2025",
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                thinking_config=types.ThinkingConfig(
                    thinking_level=types.ThinkingLevel.HIGH,
                    include_thoughts=True 
                ),
                response_mime_type="application/json",
                response_schema=SecurityAssessment
            )
        )

        return response.parsed

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal reasoning engine error.")

@app.get("/health")
def health():
    return {"status": "online", "engine": "Gemini 3 High-Reasoning"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
