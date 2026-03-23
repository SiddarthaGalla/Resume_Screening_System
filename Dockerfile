# Use Python 3.10 (spaCy compatible)
FROM python:3.10

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r backend/requirements.txt

# Install spaCy model
RUN python -m spacy download en_core_web_sm

# Expose port
EXPOSE 10000

# Run app
CMD ["python", "backend/app.py"]
