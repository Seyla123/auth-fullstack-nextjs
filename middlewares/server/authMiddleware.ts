import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // Install with `npm install jsonwebtoken`
import { db } from "@/lib/initDb";

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
  if (!token) {
    return NextResponse.json(
      {
        status: "fail",
        message: "Not authorized to access this route",
      },
      { status: 401 }
    );
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    // If token is valid, attach user info to the request
    const stmt = db.prepare('SELECT id, name, email FROM users WHERE id = ?');
    const currentUser = stmt.get(decoded.id)
console.log('current user', currentUser);


    if(!currentUser){
        return NextResponse.json(
          {
            status: "fail",
            message: "The user belonging to this token no longer exists.",
          },
          { status: 401 }
        );
    }

    req.headers.set("user", JSON.stringify(currentUser));

  } catch (error) {
    return NextResponse.json(
      {
        status: "fail",
        message: "Invalid or expired token",
      },
      { status: 401 }
    );
  }
};
