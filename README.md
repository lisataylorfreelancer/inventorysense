# AI Chat Application with Cloudflare and Convex

This is a production-ready, full-stack AI Chat application built on a modern, serverless technology stack. It provides a clean, responsive user interface for interacting with AI models, complete with secure user authentication and chat history management.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/lisataylorfreelancer/inventorysense)

## Key Features

- **Real-time AI Chat**: Engage in conversations with an AI assistant, powered by OpenRouter.
- **Secure Authentication**: Robust user authentication system supporting email/password (with OTP verification) and anonymous sign-in.
- **Chat History**: Automatically saves and organizes conversations into threads. Users can create, switch between, and delete chat threads.
- **Serverless Backend**: Built with Cloudflare Workers for the edge and Convex for the database, file storage, and serverless functions, ensuring high performance and scalability.
- **Type-Safe**: End-to-end type safety with TypeScript, from the database schema to the frontend components.
- **Modern Frontend**: A responsive and well-designed UI built with React, Vite, and shadcn/ui.

## Technology Stack

- **Backend**: Cloudflare Workers, Hono
- **Database & Functions**: Convex
- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI, Lucide React
- **Authentication**: `@convex-dev/auth`
- **Package Manager**: Bun

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or later)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- A [Convex account](https://dashboard.convex.dev/)
- An [OpenRouter API Key](https://openrouter.ai/keys)

### 1. Clone the Repository

Clone the project to your local machine:

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

Install all project dependencies using Bun:

```bash
bun install
```

### 3. Set Up Convex

Initialize a new Convex project and link it to your account:

```bash
npx convex dev
```

Follow the CLI prompts to create a new project. Once done, stop the process (`Ctrl+C`).

### 4. Configure Environment Variables

Convex and the AI service require several environment variables. You can set these in the Convex dashboard under **Settings -> Environment Variables**.

1.  Navigate to your project on the [Convex Dashboard](https://dashboard.convex.dev/).
2.  Go to the **Settings** tab.
3.  Add the following environment variables:

| Variable Name              | Value                                                              | Description                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `CONVEX_SITE_URL`          | Your frontend URL (e.g., `http://localhost:3000` for dev)          | Required for password authentication to construct callback URLs. Set this to your production URL after deployment.                       |
| `ANDROMO_AI_API_KEY`       | Your OpenRouter API key                                            | Used by the `sendMessage` action to communicate with the AI model.                                                                       |
| `ANDROMO_SMTP_URL`         | (Optional) Your SMTP service URL                                   | Required for sending email verification and password reset OTPs.                                                                         |
| `ANDROMO_SMTP_API_KEY`     | (Optional) Your SMTP service API key                               | Required for sending email verification and password reset OTPs.                                                                         |

### 5. Push Environment Variables and Deploy Backend

Push the environment variables to your Convex project and deploy the backend schema and functions:

```bash
npx convex env push
bun run backend:deploy
```

This command will push your local environment variables to Convex and deploy your database schema, functions, and indexes.

### 6. Set Up Frontend Environment

Your frontend needs to know the URL of your Convex deployment.

1.  In the Convex Dashboard, copy the **Deployment URL** from the project settings.
2.  Create a `.env.local` file in the root of your project.
3.  Add the URL to your `.env.local` file:

```env
VITE_CONVEX_URL="<your-convex-deployment-url>"
```

## Running Locally

To start the development server for both the frontend and the Convex backend, run:

```bash
bun run dev
```

This command will:
- Start the Vite development server for the React application, typically on `http://localhost:3000`.
- Run `convex dev` to sync your local backend changes to the Convex cloud.

## Deployment

This project is configured for seamless deployment to Cloudflare Pages.

### One-Click Deploy

You can deploy this application to Cloudflare with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/lisataylorfreelancer/inventorysense)

### Manual Deployment via Wrangler

1.  **Build the Project**:
    This command type-checks, builds the frontend application, and deploys your latest Convex functions.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare**:
    This command deploys your application to Cloudflare Pages using Wrangler.
    ```bash
    bun run deploy
    ```
    Follow the prompts from the Wrangler CLI to log in and authorize the deployment.

3.  **Configure Production Environment Variables**:
    After deployment, you must set the `VITE_CONVEX_URL` and `CONVEX_SITE_URL` environment variables in your Cloudflare Pages project settings to point to your production URLs.

## Project Structure

- `worker/`: Contains the Cloudflare Worker code, using Hono for routing.
- `src/`: The React frontend application, including pages, components, and hooks.
- `convex/`: All Convex backend code, including database schema, queries, mutations, actions, and authentication configuration.
- `shared/`: TypeScript code shared between the frontend (`src`) and the Convex backend (`convex`).

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.