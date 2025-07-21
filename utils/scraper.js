const axios = require('axios');
const cheerio = require('cheerio');

const scrapeMetadata = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Extract title
    let title = $('meta[property="og:title"]').attr('content') ||
                $('meta[name="twitter:title"]').attr('content') ||
                $('title').text() ||
                'Untitled';

    // Extract favicon
    let favicon = $('link[rel="icon"]').attr('href') ||
                  $('link[rel="shortcut icon"]').attr('href') ||
                  '/favicon.ico';

    // Make favicon URL absolute
    if (favicon && !favicon.startsWith('http')) {
      const urlObj = new URL(url);
      favicon = favicon.startsWith('/') ? 
        `${urlObj.protocol}//${urlObj.host}${favicon}` :
        `${urlObj.protocol}//${urlObj.host}/${favicon}`;
    }

    return { title: title.trim(), favicon };
  } catch (error) {
    console.error('Error scraping metadata:', error);
    return { 
      title: new URL(url).hostname,
      favicon: null 
    };
  }
};

const generateSummary = async (url) => {
  try {
    const encodedURL = encodeURIComponent(url);
    const response = await axios.get(`https://r.jina.ai/${encodedURL}`, {
      headers: {
        'x-use-summary': 'true',
        'Accept': 'application/json'
      },
      timeout: 15000
    });

    const responseData = response.data?.data;
    
    const summary = responseData?.description || 
                    responseData?.content?.split('\n').slice(0, 3).join(' ') || 
                    'Summary not available';

    return summary.trim();
  } catch (error) {
    console.error('Error generating summary:', error.message);
    return 'Summary not available';
  }
};



module.exports = { scrapeMetadata, generateSummary };