# main.py
import os, io, logging
from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove as rembg_remove  # function
from rembg.session_factory import new_session
from PIL import Image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bg-remover")

app = FastAPI()

# CORS
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "https://toolbox.basiliustengang.com")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Print startup info
logger.info("FRONTEND_ORIGIN=%s", FRONTEND_ORIGIN)
logger.info("U2NET_HOME=%s", os.getenv("U2NET_HOME"))

# Preload rembg session (so model is loaded once)
_session = None
try:
    _session = new_session()  # uses U2NET_HOME env to find model
    logger.info("Rembg session preloaded")
except Exception as e:
    logger.exception("Failed to preload rembg session: %s", e)
    _session = None

# optional: small request size guard
@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    max_bytes = 8 * 1024 * 1024  # 8 MB
    content_length = int(request.headers.get("content-length", 0))
    if content_length and content_length > max_bytes:
        return JSONResponse({"error": "File is too large"}, status_code=413)
    return await call_next(request)

@app.get("/")
def root():
    return {"message": "Background Remover API is running!"}

@app.post("/remove")
async def remove_bg(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        input_image = Image.open(io.BytesIO(contents)).convert("RGBA")

        if _session is not None:
            output_image = rembg_remove(input_image, session=_session)
        else:
            output_image = rembg_remove(input_image)

        buf = io.BytesIO()
        output_image.save(buf, format="PNG")
        buf.seek(0)
        return StreamingResponse(buf, media_type="image/png")
    except MemoryError:
        logger.exception("MemoryError while processing image")
        return JSONResponse({"error": "Server out of memory"}, status_code=503)
    except Exception as e:
        logger.exception("Unhandled exception in /remove: %s", e)
        return JSONResponse({"error": str(e)}, status_code=500)
