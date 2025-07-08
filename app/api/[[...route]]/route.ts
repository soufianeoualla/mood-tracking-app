import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "@/app/api/[[...route]]/auth.route";
import mood from "@/app/api/[[...route]]/mood.route";
import onbording from "@/app/api/[[...route]]/onboarding.route";
import profile from "@/app/api/[[...route]]/profile.route";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/auth", auth)
  .route("/mood", mood)
  .route("/onboarding", onbording)
  .route("/profile", profile);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
