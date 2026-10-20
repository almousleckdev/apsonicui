# syntax=docker/dockerfile:1.7
# Production image for the Apsonic website (Next.js standalone server).
#
# Build-time settings (they are compiled into the bundle, so changing them needs a rebuild):
#   INTERNAL_API_URL          where the Next server proxies /api and /uploads (the backend's private address)
#   NEXT_PUBLIC_MAPBOX_TOKEN  public Mapbox token (restrict it by URL in the Mapbox dashboard)

ARG NODE_IMAGE=node:22-alpine

# ---- dependencies ----------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- build -----------------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG INTERNAL_API_URL=http://backend:8080
ARG NEXT_PUBLIC_MAPBOX_TOKEN=
ENV INTERNAL_API_URL=${INTERNAL_API_URL} \
    NEXT_PUBLIC_MAPBOX_TOKEN=${NEXT_PUBLIC_MAPBOX_TOKEN}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Pages that fetch from the backend log "fetch failed" here: it is not running during the image build.
RUN npm run build

# ---- runtime ---------------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S -g 10001 app && adduser -S -u 10001 -G app -h /app -s /sbin/nologin app
# The runtime only executes `node server.js`. The package manager that ships in the base image is not needed here,
# and its own bundled dependencies are a recurring source of scanner findings, so remove it.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Large, rarely-changing media first so its layer is cached and not re-pushed on code-only releases.
COPY --from=build --chown=app:app /app/public ./public
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
# The image optimiser caches here; mount a volume on it so it survives container restarts.
RUN mkdir -p /app/.next/cache && chown -R app:app /app/.next

USER app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "require('net').connect(3000,'127.0.0.1').on('connect',()=>process.exit(0)).on('error',()=>process.exit(1))"
CMD ["node", "server.js"]
