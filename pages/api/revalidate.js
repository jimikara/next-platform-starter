export default async function handler(req, res) {
    // Check for secret to confirm this is a valid request
    if (req.query.secret !== process.env.REVALIDATION_SECRET) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    try {
        // Revalidate the root page
        await res.revalidate('/'); // The root page to revalidate
        return res.json({ revalidated: true });
    } catch (err) {
        return res.status(500).json({ message: 'Error revalidating' });
    }
}
