# python fastapi server
FROM python:3.9-bullseye

COPY server/requirements.txt .
RUN pip install -r requirements.txt

COPY server/ .

CMD ["uvicorn", "main:app", "--host" ]

EXPOSE 8000
