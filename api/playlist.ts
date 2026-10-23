// Vercel Serverless Function: /api/playlist
// Handles global playlist state for all visitors

import type { VercelRequest, VercelResponse } from '@vercel/node';

let globalPlaylists = [
  {
    id: 'default-ghoomte-phirte',
    playlistId: 'PLEOiStG7CxDKEx0W4AMsDlEDk2qrlns0I',
    title: 'Ghoomte Phirte — Nostalgic Hindi Classics',
    isActive: true,
    createdAt: Date.now(),
  },
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body && Array.isArray(body.playlists) && body.playlists.length > 0) {
        globalPlaylists = body.playlists;
        return res.status(200).json({ success: true, playlists: globalPlaylists });
      }
      return res.status(400).json({ error: 'Invalid playlist array payload' });
    } catch {
      return res.status(500).json({ error: 'Server parse error' });
    }
  }

  // GET
  return res.status(200).json({
    playlists: globalPlaylists,
    updatedAt: Date.now(),
  });
}
