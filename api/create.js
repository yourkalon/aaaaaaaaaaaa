import { db } from '../../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Random slug generator
function generateSlug() {
  return Math.random().toString(36).substring(2, 8);
}

export default async function handler(req, res) {
  // শুধু POST request allow করুন
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    const { originalUrl, customSlug } = req.body;

    // Validation
    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        error: 'Original URL is required'
      });
    }

    // URL format check
    let validUrl;
    try {
      validUrl = new URL(originalUrl);
    } catch (urlError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format. Please include http:// or https://'
      });
    }

    let slug = customSlug || generateSlug();
    
    // Custom slug validation
    if (customSlug) {
      // শুধু letters, numbers, hyphen, underscore allow করুন
      if (!/^[a-zA-Z0-9_-]+$/.test(customSlug)) {
        return res.status(400).json({
          success: false,
          error: 'Slug can only contain letters, numbers, hyphens, and underscores'
        });
      }
      
      if (customSlug.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Slug must be at least 2 characters long'
        });
      }
      
      // Check if slug already exists
      const existingDoc = await getDoc(doc(db, 'urls', customSlug));
      if (existingDoc.exists()) {
        return res.status(400).json({
          success: false,
          error: 'This slug is already taken. Please choose another one.'
        });
      }
    }

    // Firestore-এ data save করুন
    await setDoc(doc(db, 'urls', slug), {
      originalUrl: originalUrl,
      slug: slug,
      clicks: 0,
      createdAt: new Date().toISOString(),
      createdBy: 'web-user',
      domain: validUrl.hostname
    });

    // Base URL determine করুন
    const baseUrl = process.env.VERCEL_URL ? 
      `https://${process.env.VERCEL_URL}` : 
      'http://localhost:3000';

    // Success response
    res.status(200).json({
      success: true,
      shortUrl: `${baseUrl}/${slug}`,
      slug: slug,
      originalUrl: originalUrl,
      message: 'URL shortened successfully!'
    });

  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again.'
    });
  }
}