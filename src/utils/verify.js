import jwt  from "jsonwebtoken";

 const jwtMiddleware = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[2];  
	if (token) {
	  try {
		const emp = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
		req.emp = emp;
	  } catch (err) {
		console.log('Invalid access token');
	  }
	}
  
	next();
  };




  export { jwtMiddleware }