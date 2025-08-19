# main.py
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import io

app = FastAPI()

# DEV: allow Vite dev server origin. Use explicit origin instead of '*' for security.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/remove")
async def remove_bg(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        # Open and ensure RGBA — more robust
        input_image = Image.open(io.BytesIO(contents)).convert("RGBA")
        output_image = remove(input_image)  # returns PIL Image when passing PIL.Image
        buf = io.BytesIO()
        output_image.save(buf, format="PNG")
        buf.seek(0)
        return StreamingResponse(buf, media_type="image/png")
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/")
async def root():
    return {"message": "Background Remover API is running!"}
