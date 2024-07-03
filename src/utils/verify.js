import jwt  from "jsonwebtoken";

 const jwtMiddleware = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[2];

	// console.log( '#####token inside the jwt Middleware --->  ', token)
  
	if (token) {
	  try {
		const emp = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

		req.emp = emp;
		// console.log("%%%%%%%%%%%%%%%%%%%")
		// console.log("req.emp inside the jwt middleware--->", req.emp)
		// console.log("%%%%%%%%%%%%%%%%%%%")
	  } catch (err) {
		console.log('Invalid access token');
	  }
	}
  
	next();
  };


  export { jwtMiddleware }