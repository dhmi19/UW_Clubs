import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth = true) => {
    // request will contain a vaildation token
    const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization

    if (header) {
        //extract token
        const token = header.replace('Bearer ', '')
        //verify if the token was made using this secrer
        const decoded = jwt.verify(token, 'uw_clubs')
        // decoded has a JSON object {userId: xxx}
        return decoded.userId
    }

    if (requireAuth) {
        throw new Error('Authentication required')
    } 
    
    return null
}

export { getUserId as default }