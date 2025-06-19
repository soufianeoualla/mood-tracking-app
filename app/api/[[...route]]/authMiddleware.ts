import { UserRepository } from "@/prisma/repositories/user.repository";
import { Context, Next } from "hono";
import { verify, JwtPayload } from "jsonwebtoken";

// Define the JWT payload interface
interface AuthJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

// Define custom context to add user property
declare module "hono" {
  interface ContextVariableMap {
    user: {
      id: number;
      email: string;
    };
  }
}

const JWT_SECRET = process.env.JWT_SECRET as string;

const userRepository = new UserRepository();

const authMiddleware = async (
  c: Context,
  next: Next
): Promise<Response | void> => {
  try {
    // Get the authorization header
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Authentication required" }, 401);
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify and decode token
    const decoded = verify(token, JWT_SECRET) as AuthJwtPayload;

    if (!decoded.id) {
      return c.json({ error: "Invalid token format" }, 401);
    }

    // Check if user exists in database
    const user = await userRepository.getUserById(decoded.id);

    if (!user) {
      return c.json({ error: "User not found or invalid token" }, 401);
    }

    // Attach user to the context for route handlers
    c.set("user", user);

    // Continue to next middleware or route handler
    await next();
  } catch (error: unknown) {
    console.error("Token validation error:", error);

    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        return c.json({ error: "Token expired", code: "TOKEN_EXPIRED" }, 401);
      }

      if (error.name === "JsonWebTokenError") {
        return c.json({ error: "Invalid token", code: "INVALID_TOKEN" }, 401);
      }
    }

    return c.json({ error: "Authentication failed" }, 401);
  }
};

export default authMiddleware;
