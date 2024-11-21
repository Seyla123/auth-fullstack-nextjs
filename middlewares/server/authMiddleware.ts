import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"; // Install with `npm install jsonwebtoken`
import { db } from "@/lib/initDb";
import { User } from "@/app/api/auth/sign-in/route";

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
  if (!token) throw new Error("Not authorized to access this route")


  // 3. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  if (!decoded) throw new Error("Invalid or expired token")

  // If token is valid, attach user info to the request
  const stmt = db.prepare('SELECT id, username ,email, role, active, emailVerified FROM users WHERE id = ?');
  const currentUser = stmt.get(decoded.id)

  if (!currentUser) throw new Error('The user belonging to this token no longer exists.')

  req.headers.set("user", JSON.stringify(currentUser));
};

export const restrict = (req: NextRequest, roles: 'admin' | 'user') => {
  const user = JSON.parse(req.headers.get('user')!);
  console.log('this restricted role : ', user.role);
  if (!roles.includes(user.role)) {
    throw new Error('You do not have permission to access this route');
  }
}