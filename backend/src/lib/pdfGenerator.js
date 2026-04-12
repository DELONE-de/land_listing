const puppeteer = require('puppeteer');

/**
 * Generate HTML template for listing PDF
 */
const generateListingHTML = (listing) => {
  const { title, price, location, description, images = [] } = listing;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .header {
          border-bottom: 3px solid #007bff;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        h1 {
          color: #007bff;
          font-size: 32px;
          margin-bottom: 15px;
        }
        
        .price {
          font-size: 28px;
          color: #28a745;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .location {
          font-size: 18px;
          color: #666;
          display: flex;
          align-items: center;
        }
        
        .location::before {
          content: "📍";
          margin-right: 8px;
        }
        
        .images-section {
          margin: 30px 0;
        }
        
        .images-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin-top: 15px;
        }
        
        .image-container {
          width: 100%;
          height: 250px;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .image-container.featured {
          grid-column: 1 / -1;
          height: 400px;
        }
        
        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .section-title {
          font-size: 22px;
          color: #333;
          margin-bottom: 15px;
          font-weight: bold;
        }
        
        .description {
          margin: 30px 0;
        }
        
        .description-text {
          font-size: 16px;
          line-height: 1.8;
          color: #555;
          white-space: pre-wrap;
        }
        
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 2px solid #eee;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
        
        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <div class="price">$${Number(price).toLocaleString()}</div>
        <div class="location">${location || 'Location not specified'}</div>
      </div>
      
      ${images.length > 0 ? `
        <div class="images-section">
          <h2 class="section-title">Images</h2>
          <div class="images-grid">
            ${images.map((img, index) => `
              <div class="image-container ${index === 0 ? 'featured' : ''}">
                <img src="${img}" alt="${title} - Image ${index + 1}" />
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      <div class="description">
        <h2 class="section-title">Description</h2>
        <div class="description-text">${description || 'No description provided.'}</div>
      </div>
      
      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate PDF from listing data
 */
const generateListingPDF = async (listing) => {
  let browser;
  
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Generate HTML content
    const htmlContent = generateListingHTML(listing);
    
    // Set content
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });
    
    return pdf;
    
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error('Failed to generate PDF');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = {
  generateListingPDF,
  generateListingHTML
};