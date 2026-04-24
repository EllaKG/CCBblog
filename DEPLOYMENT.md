# Deployment

This project can be deployed publicly with Render using the included `render.yaml` and `Dockerfile`.

## What the files do

- `Dockerfile` builds the site with Node 24 so `node:sqlite` is available.
- `render.yaml` creates a web service and mounts a persistent disk at `/app/data` so the SQLite database survives restarts.
- `server.js` now listens on the host platform's `PORT` and `HOST` values.

## Render deploy steps

1. Push this project to a GitHub repository.
2. Sign in to Render.
3. Choose **New +** → **Blueprint**.
4. Connect your GitHub repo.
5. Render will detect `render.yaml` automatically.
6. Deploy the service.

After deployment, Render gives you a public URL like:

`https://cis-project-site.onrender.com`

## Notes

- The SQLite file is stored at `/app/data/site.db` in production.
- If you delete the Render disk, saved contact messages will be lost.
- The first load on some Render plans can be slow after inactivity.