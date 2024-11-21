import jwt from 'jsonwebtoken'
export const protectedRoutesMiddleware = () => {
    return (req, res) => {
        if (req.method === 'GET' && req.url.pathname === '/api/protected') {
            if (!req.headers.get('authorization')) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const token = req.headers.get('authorization')?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET!);
                req.user = decoded;
            } catch (error) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
        }
    }
}