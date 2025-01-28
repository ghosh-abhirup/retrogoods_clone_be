const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateAccessToken = (userId: string, email: string)=>{
    return jwt.sign(
        {
            id: userId,
            email: email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
const generateRefreshToken = (userId: string)=>{
    return jwt.sign(
        {
            id: userId,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const hashPassword = async (password:string) => {
  const saltRounds = 10; 
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePasswords = async (password:string, hashedPassword:string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export {
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
    comparePasswords
}