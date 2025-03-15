document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const scrapeForm = document.getElementById('scrape-form');
  const urlInput = document.getElementById('url-input');
  const scrapeButton = document.getElementById('scrape-button');
  const buttonText = scrapeButton.querySelector('.button-text');
  const spinner = scrapeButton.querySelector('.spinner');
  const errorMessage = document.getElementById('error-message');
  const resultsSection = document.getElementById('results-section');
  const progressBarContainer = document.getElementById('progress-bar-container');
  const progressBar = document.getElementById('progress-bar');

  // Cards and content areas
  const titleCard = document.getElementById('title-card');
  const titleContent = document.getElementById('title-content');
  const headingsCard = document.getElementById('headings-card');
  const headingsContent = document.getElementById('headings-content');
  const imagesCard = document.getElementById('images-card');
  const imagesContent = document.getElementById('images-content');
  const imagesCount = document.getElementById('images-count');
  const linksCard = document.getElementById('links-card');
  const linksContent = document.getElementById('links-content');
  const linksCount = document.getElementById('links-count');

  // Form submission handler
  scrapeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const url = urlInput.value.trim();

    if (!url) {
      showError('Please enter a valid URL');
      return;
    }

    // Show loading state
    setLoading(true);
    hideError();
    hideResults();
    showProgressBar();

    try {
      // Make request to our Render backend server
      const response = await fetch('https://webscraping-backend-xpb5.onrender.com/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape website');
      }

      // Display the results
      displayResults(data.data);

    } catch (error) {
      showError(error.message || 'An error occurred while scraping the website');
    } finally {
      setLoading(false);
      hideProgressBar();
    }
  });

  // Helper functions
  function setLoading(isLoading) {
    if (isLoading) {
      buttonText.textContent = 'Scraping...';
      spinner.classList.remove('hidden');
      scrapeButton.disabled = true;
    } else {
      buttonText.textContent = 'Scrape Website';
      spinner.classList.add('hidden');
      scrapeButton.disabled = false;
    }
  }

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }

  function hideError() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
  }

  function hideResults() {
    resultsSection.classList.add('hidden');
  }

  function showProgressBar() {
    progressBarContainer.classList.remove('hidden');
    progressBar.value = 0;
  }

  function hideProgressBar() {
    progressBarContainer.classList.add('hidden');
  }

  function updateProgressBar(value) {
    progressBar.value = value;
  }

  function displayResults(data) {
    // Clear previous content
    titleContent.innerHTML = '';
    headingsContent.innerHTML = '';
    imagesContent.innerHTML = '';
    linksContent.innerHTML = '';

    // Show results section
    resultsSection.classList.remove('hidden');

    // Process and display titles
    if (data.titles && data.titles.length > 0) {
      titleContent.textContent = data.titles[0];
      titleCard.classList.remove('hidden');
    } else {
      titleCard.classList.add('hidden');
    }

    // Process and display headings
    if (data.headings && data.headings.length > 0) {
      const headingsList = document.createElement('ul');

      data.headings.forEach(heading => {
        const li = document.createElement('li');
        li.textContent = heading;
        headingsList.appendChild(li);
      });

      headingsContent.appendChild(headingsList);
      headingsCard.classList.remove('hidden');
    } else {
      headingsCard.classList.add('hidden');
    }

    // Process and display images
    if (data.images && data.images.length > 0) {
      const imagesList = document.createElement('ul');

      // Display only first 10 images
      const displayImages = data.images.slice(0, 10);

      displayImages.forEach(src => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = src;
        link.textContent = src;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        li.appendChild(link);
        imagesList.appendChild(li);
      });

      imagesContent.appendChild(imagesList);

      // Show count and more info if needed
      imagesCount.textContent = data.images.length;

      if (data.images.length > 10) {
        const moreInfo = document.createElement('p');
        moreInfo.className = 'more-info';
        moreInfo.textContent = `And ${data.images.length - 10} more images...`;
        imagesContent.appendChild(moreInfo);
      }

      imagesCard.classList.remove('hidden');
    } else {
      imagesCard.classList.add('hidden');
    }

    // Process and display links
    if (data.links && data.links.length > 0) {
      const linksList = document.createElement('ul');

      // Display only first 10 links
      const displayLinks = data.links.slice(0, 10);

      displayLinks.forEach(href => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = href;
        link.textContent = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        li.appendChild(link);
        linksList.appendChild(li);
      });

      linksContent.appendChild(linksList);

      // Show count and more info if needed
      linksCount.textContent = data.links.length;

      if (data.links.length > 10) {
        const moreInfo = document.createElement('p');
        moreInfo.className = 'more-info';
        moreInfo.textContent = `And ${data.links.length - 10} more links...`;
        linksContent.appendChild(moreInfo);
      }

      linksCard.classList.remove('hidden');
    } else {
      linksCard.classList.add('hidden');
    }
  }
});