# AI Resume Analyser

An AI-powered Resume Analyser built with React (Vite), React Router DOM, and Puter APIs.
This app allows users to upload resumes, store them securely, and get AI-driven insights to improve their CVs.

----

# Features

-Authentication – Secure login with Puter Auth
-File Upload – Upload resumes (PDF, DOCX) using Puter FS
-Cloud Storage – Manage uploaded resumes in Puter’s virtual filesystem
-AI Insights – Analyse resume content for skills, job-fit, and improvements
-Routing – Smooth navigation with React Router DOM
-Fast Build – Powered by Vite for blazing-fast development





### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
