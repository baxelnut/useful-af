import os, io, logging
import re
from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove as rembg_remove
from rembg.session_factory import new_session
from PIL import Image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bg-remover")

app = FastAPI()

_raw = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173,https://toolbox.basiliustengang.com")

_found = re.findall(r"https?://[^\s,;'\"]+", _raw)
FRONTEND_ORIGINS = [o.strip() for o in _found]

if not FRONTEND_ORIGINS:
    FRONTEND_ORIGINS = ["http://localhost:5173", "https://toolbox.basiliustengang.com"]

if os.getenv("TEST_CORS_ALLOW_ALL", "") == "1":
    logger.info("TEST_CORS_ALLOW_ALL=1 -> allowing all origins temporarily")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=FRONTEND_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

logger.info("Allowed CORS origins: %s", FRONTEND_ORIGINS)
logger.info("U2NET_HOME=%s", os.getenv("U2NET_HOME"))


_session = None
try:
    _session = new_session()
    logger.info("Rembg session preloaded")
except Exception as e:
    logger.exception("Failed to preload rembg session: %s", e)
    _session = None

@app.middleware("http")
async def log_requests(request: Request, call_next):
    origin = request.headers.get("origin", "<no-origin>")
    try:
        client = request.client.host if request.client else "unknown"
    except Exception:
        client = "unknown"
    logger.info("REQ → %s %s from %s Origin=%s", request.method, request.url.path, client, origin)
    resp = await call_next(request)
    logger.info("RESP ← %s %s %s", request.method, resp.status_code, request.url.path)
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
