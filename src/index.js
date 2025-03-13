const axios = require('axios');

async function scrapeWebsite(url) {
    try {
        // Call the backend API hosted on Render
        const { data } = await axios.post('https://webscraping-backend-xpb5.onrender.com', { url });
        
        // Return the extracted data from the backend response
        return data;
    } catch (error) {
        console.error('Error scraping website:', error);
        return null;
    }
}

// Example usage
document.getElementById('scrapeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = document.getElementById('urlInput').value;
    const data = await scrapeWebsite(url);
    if (data) {
        document.getElementById('title').textContent = data.title;
        document.getElementById('h1').textContent = data.h1;
        const imageUrlsList = document.getElementById('imageUrls');
        imageUrlsList.innerHTML = '';
        data.imageUrls.forEach(src => {
            const li = document.createElement('li');
            li.textContent = src;
            imageUrlsList.appendChild(li);
        });
        document.getElementById('result').style.display = 'block';
    }
});