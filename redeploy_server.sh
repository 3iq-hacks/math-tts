git fetch && git reset origin/main --hard

docker compose down
docker compose up -d --build
