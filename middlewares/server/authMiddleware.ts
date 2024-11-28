import { NextRequest } from "next/server";
import { JwtPayload } from "jsonwebtoken"; // Install with `npm install jsonwebtoken`
import { db } from "@/lib/initDb";
import AppError from "@/lib/server/utils/appError";
import { uncodedJwtToken } from "@/lib/server/utils/authUtils";

export const protect = (req: NextRequest) => {
  let token;

  // 1.Extract token from Authorization header or cookies
  if (
    req.headers.get("authorization") &&
    req.headers.get("authorization")!.startsWith("Bearer")
  ) {
    token = req.headers.get("authorization")!.split(" ")[1];
  } else if (req.cookies.get("jwt")) {
    token = req.cookies.get("jwt")?.value;
  }
  console.log('this is token', token);

  // 2. If token is found
  if (!token) throw new AppError("You are not logged in! Please log in to get access.", 401)


  // 3. Verify token
  const decoded = uncodedJwtToken(token) as JwtPayload;
  if (!decoded) throw new AppError("Invalid or expired token", 401)

  // If token is valid, attach user info to the request
  const stmt = db.prepare('SELECT id, username ,email, role, active, emailVerified FROM users WHERE id = ?');
  const currentUser = stmt.get(decoded.id)
  if (!currentUser) throw new AppError('The user belonging to this token no longer exists.', 401)

  req.headers.set("user", JSON.stringify(currentUser));

};

export const restrict = (req: NextRequest, roles: 'admin' | 'user' | ['admin', 'user']) => {
  const user = JSON.parse(req.headers.get('user')!);
  console.log('this restricted role : ', user.role);
  // Check if the user has the required role to access the route
  const rolesArray = Array.isArray(roles) ? roles : [roles];
  if (!rolesArray.includes(user.role)) {
    throw new Error('You do not have permission to access this route');
  }
  req.headers.set('userId', user.id);
}
