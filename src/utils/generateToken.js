import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({ userId }, 'uw_clubs', { expiresIn: '7 days' });
}

export { generateToken as default }