/home/steel-series/nvr/
├─ docker-compose.yml        # one compose for both services
├─ .env                      # compose variables for BOTH services (ports, paths, TZ, image names)
├─ config/                   # viseron config
├─ storage/                  # recordings
└─ frontend/
   ├─ Dockerfile             # ONLY for the frontend (nginx static server)
   ├─ nginx.conf             # ONLY for the frontend image
   ├─ src/ public/ dist/ …   # your app
   └─ (optional) .env.production  # app build-time vars (Vite), explained below