import jwt, { decode } from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {        

        const token = req.headers.authorization.split(" ")[1];
        
        var SECRET = process.env.JWT_KEY;

        //check if token is googleAuth  
        const isCustomAuth = token.length < 500;

        let decodedData;

        if(token && isCustomAuth){
            decodedData = jwt.verify(token, SECRET);

            req.UserId = decodedData?.id;
        }else {
            decodedData = jwt.decode(token);

            req.UserId = decodedData?.sub;
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized" })
    }
}

export default auth;