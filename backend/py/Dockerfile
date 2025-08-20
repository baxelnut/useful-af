# Use slim Python
FROM python:3.11-slim

# System deps for Pillow/OpenCV/ONNXRuntime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-cache the u2net model so we don't download 176MB on first request
# Default rembg model is u2net.onnx from this release path:
# https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx
ENV U2NET_HOME=/root/.u2net
RUN mkdir -p ${U2NET_HOME} \
 && curl -L "https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx" \
    -o "${U2NET_HOME}/u2net.onnx"

# Copy app
COPY . .

# Railway sets PORT; default to 8000 for local docker run
ENV PORT=8000

# Expose port (optional for Railway but useful locally)
EXPOSE 8000

# Start server
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]
