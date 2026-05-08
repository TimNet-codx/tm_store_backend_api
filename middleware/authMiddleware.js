// import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided!" });
    }

    // Bearer <token>
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Invalid token format!" });
    }

    const decoded = jwt.verify(token, "passwordKey");

    // Attach logged-in user id to request
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid!" });
  }
};

// export default authMiddleware;

import jwt from "jsonwebtoken";

// const authMiddleware = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
    
//     // Debugging log
//     console.log("Received Header:", authHeader);

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ msg: "No token provided or invalid format!" });
//     }

//     const token = authHeader.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(token, "passwordKey");
    
//     // Attach user ID to the request object so the route can use it
//     req.userId = decoded.id;

//     next();
//   } catch (error) {
//     console.error("JWT Auth Error:", error.message);
//     return res.status(401).json({ msg: "Token is not valid!" });
//   }
// };
// const authMiddleware = (req, res, next) => {
//   console.log("===== INCOMING REQUEST =====");
//   console.log("Method:", req.method);
//   console.log("Path:", req.path);
//   console.log("Raw Headers Keys:", Object.keys(req.headers)); 
//   console.log("Authorization Header:", req.headers['authorization']);
//   console.log("============================");

//   if (!req.headers['authorization']) {
//     return res.status(401).json({ 
//         msg: "Server received NO authorization header",
//         receivedKeys: Object.keys(req.headers) 
//     });
//   }
//   next();
// };

export default authMiddleware;