# запустить докер файла локально
```
cd /Users/skripach.cpp/RiderProjects/NewsFeedMonorepo/NewsFeedAuthService
docker build -f Web/Dockerfile -t newsfeed-auth-service .

docker run -d \
  -p 8080:8080 \
  -p 8081:8081 \
  -e ASPNETCORE_URLS="http://+:8080" \
  -e ConnectionStrings__DefaultConnection="Server=host.docker.internal;Port=5432;Database=NewsFeed;Username=postgres;Password=password;" \
  --name newsfeed-auth-service \
  newsfeed-auth-service
```