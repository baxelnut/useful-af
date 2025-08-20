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


# read FRONTEND_ORIGIN env and support comma-separated list
_raw_origins = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173,https://toolbox.basiliustengang.com")
# split and strip spaces and ignore empty
FRONTEND_ORIGINS = [o.strip() for o in _raw_origins.split(",") if o.strip()]
# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,   # exact origins allowed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Print startup info 
logger.info("Allowed CORS origins: %s", FRONTEND_ORIGINS)
logger.info("U2NET_HOME=%s", os.getenv("U2NET_HOME"))

# Preload rembg session (so model is loaded once)
_session = None
try:
    _session = new_session()  # uses U2NET_HOME env to find model
    logger.info("Rembg session preloaded")
except Exception as e:
    logger.exception("Failed to preload rembg session: %s", e)
    _session = None

# small request size guard
@app.middleware("http")
async def log_requests(request: Request, call_next):
    try:
        client = request.client.host if request.client else "unknown"
    except Exception:
        client = "unknown"
    logger.info("REQ → %s %s from %s", request.method, request.url.path, client)
    resp = await call_next(request)
    logger.info("RESP ← %s %s", request.method, resp.status_code)
    return resp

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
