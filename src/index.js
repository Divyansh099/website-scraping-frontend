document.getElementById("scrape-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  const urlInput = document.getElementById("url-input").value;
  const outputDiv = document.getElementById("output");
  const progressBar = document.getElementById("progress-bar");
  const progressSection = document.querySelector(".progress-section");

  if (!urlInput) {
      alert("Please enter a valid URL!");
      return;
  }

  // Reset output and show progress bar
  outputDiv.innerHTML = "";
  progressSection.style.display = "block";
  progressBar.style.width = "0%";

  // Fake progress bar animation
  let progress = 0;
  const interval = setInterval(() => {
      progress += Math.random() * 15; // Increase randomly
      if (progress > 90) progress = 90; // Cap at 90% until response
      progressBar.style.width = `${progress}%`;
  }, 500);

  try {
      const response = await fetch("https://webscraping-backend-xpb5.onrender.com/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlInput })
      });

      clearInterval(interval);
      progressBar.style.width = "100%"; // Complete progress bar

      const data = await response.json();
      if (response.ok) {
          outputDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      } else {
          outputDiv.innerHTML = `<p style="color: red;">Error: ${data.error || "Something went wrong"}</p>`;
      }

      // Hide progress bar after a short delay
      setTimeout(() => {
          progressSection.style.display = "none";
      }, 1000);
  } catch (error) {
      clearInterval(interval);
      progressBar.style.width = "100%";
      outputDiv.innerHTML = `<p style="color: red;">Network error. Please try again.</p>`;

      setTimeout(() => {
          progressSection.style.display = "none";
      }, 1000);
  }
});
