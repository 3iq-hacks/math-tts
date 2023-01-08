# python fastapi server
FROM python:3.9-bullseye

COPY server/requirements.txt .
RUN pip install -r requirements.txt

COPY server/ .

ARG PORT=8000
CMD ["uvicorn", "main:app", "--host" ]
