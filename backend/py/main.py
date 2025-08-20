import os
import io
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image

app = FastAPI()

FRONTEND_ORIGINS = [
    os.getenv("FRONTEND_ORIGIN", "https://toolbox.basiliustengang.com")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Background Remover API is running!"}

@app.post("/remove")
async def remove_bg(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents)).convert("RGBA")
        output_image = remove(input_image)
        buf = io.BytesIO()
        output_image.save(buf, format="PNG")
        buf.seek(0)
        return StreamingResponse(buf, media_type="image/png")
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
