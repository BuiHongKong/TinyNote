FROM node:18-alpine
WORKDIR /app

# backend deps
COPY backend/package*.json backend/
RUN cd backend && npm install

# frontend deps
COPY frontend/package*.json frontend/
RUN cd frontend && npm install

COPY . .

# build frontend
RUN cd frontend && npm run build

EXPOSE 3000
CMD ["node", "backend/index.js"]
