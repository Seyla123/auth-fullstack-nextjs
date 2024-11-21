import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken"; // Install with `npm install jsonwebtoken`
import { db } from "@/lib/initDb";

export const protect = (req: NextRequest) => {
  try {
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

    // If token is valid, attach user info to the request
    const stmt = db.prepare('SELECT id, username email FROM users WHERE id = ?');
    const currentUser = stmt.get(decoded.id)
    console.log('current user', currentUser);


    if (!currentUser) throw new Error('The user belonging to this token no longer exists.')

    req.headers.set("user", JSON.stringify(currentUser));

    console.log('this is now user head : ', req.headers.get('user'));

  } catch (error: any) {
    return NextResponse.json(
      {
        status: "fail",
        message: error.message || "Invalid or expired token",
      },
      { status: 401 }
    );
  }

};
