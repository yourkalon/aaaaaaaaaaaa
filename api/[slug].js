import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

export default async function handler(req, res) {
  const { slug } = req.query;

  // যদি root URL এ আসে
  if (slug === 'index.html' || !slug) {
    return res.redirect(302, '/');
  }

  try {
    const docRef = doc(db, 'urls', slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const urlData = docSnap.data();
      
      // Click count update করুন
      await updateDoc(docRef, {
        clicks: increment(1),
        lastAccessed: new Date().toISOString()
      });

      // Redirect to original URL
      console.log(`Redirecting ${slug} to ${urlData.originalUrl}`);
      res.redirect(302, urlData.originalUrl);
    } else {
      // URL not found
      console.log(`URL not found for slug: ${slug}`);
      res.status(404).json({ 
        success: false,
        error: 'URL not found',
        message: `No URL found for: ${slug}`
      });
    }
  } catch (error) {
    console.error('Error in redirect:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
}