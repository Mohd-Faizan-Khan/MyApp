const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');

    hamburgerMenu.addEventListener('click', () => {
      sidebar.classList.toggle('show-sidebar');
    });

    async function fetchDashboardData() {
      try {
        const response = await fetch('./data.json'); // Path to your JSON
        if (!response.ok) throw new Error('Failed to fetch JSON');
        const data = await response.json();
        updateDashboard(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    }

    // Call this when the page loads
    document.addEventListener("DOMContentLoaded", fetchDashboardData);

    function updateDashboard(data) {
      // Update metrics cards
      document.querySelector(".card:nth-child(1) p").textContent = `${data.metrics.active_users.current}/${data.metrics.active_users.total}`;
      document.querySelector(".card:nth-child(2) p").textContent = data.metrics.questions_answered;
      document.querySelector(".card:nth-child(3) p").textContent = `${Math.floor(data.metrics.average_session_length_seconds / 60)}m ${data.metrics.average_session_length_seconds % 60}s`;
      document.querySelector(".card:nth-child(4) p").textContent = `${data.metrics.current_knowledge_percentage - data.metrics.starting_knowledge_percentage}%`;

      // Update other sections
      updateActivityChart(data.activity);
      updateTopics(data.topics);
      updateLeaderboards(data.user_leaderboard, data.groups_leaderboard);
    }

    function updateActivityChart(activityData) {
      const ctx = document.getElementById('activityChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: activityData.monthly.map((month) => month.month),
          datasets: [{
            label: 'Monthly Activity',
            data: activityData.monthly.map((month) => month.value),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }

    function updateTopics(topics) {
      const weakestContainer = document.querySelector("#weakest-topics");
      const strongestContainer = document.querySelector("#strongest-topics");

      weakestContainer.innerHTML = topics.weakest.map(topic => `
        <div class="topic-card">
          <img src="${topic.image}" alt="${topic.name}">
          <p>${topic.name} (${topic.correct_percentage}%)</p>
        </div>
      `).join('');

      strongestContainer.innerHTML = topics.strongest.map(topic => `
        <div class="topic-card">
          <img src="${topic.image}" alt="${topic.name}">
          <p>${topic.name} (${topic.correct_percentage}%)</p>
        </div>
      `).join('');
    }

    function updateLeaderboards(userLeaderboard, groupLeaderboard) {
      const userContainer = document.querySelector("#user-leaderboard");
      const groupContainer = document.querySelector("#group-leaderboard");

      userContainer.innerHTML = userLeaderboard.map(user => `
        <div class="leaderboard-item">
          <img src="${user.image}" alt="${user.name}">
          <p>${user.name} - ${user.points} points (${user.accuracy_percentage}%)</p>
        </div>
      `).join('');

      groupContainer.innerHTML = groupLeaderboard.map(group => `
        <div class="leaderboard-item">
          <p>${group.group_name} - ${group.points_per_user} points (${group.accuracy_percentage}%)</p>
        </div>
      `).join('');
    }

    const apiSecret = "123abc"; // The api_secret value from the JSON

// The URL of the API endpoint
const apiUrl = 'https://testd5-img.azurewebsites.net/api/imgdownload';

// Define the payload to send in the request body
const payload = {
  api: apiSecret
};

// Send the POST request
fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payload)
})
  .then(response => data.json()) // Parse the JSON response
  .then(data => {
    // Assuming the response contains the base64 image string
    const base64Image = data.image; // Replace with the actual response field name

    // Create an <a> element to trigger the download
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Image}`; // Assuming the image is PNG
    link.download = 'downloaded_image.png'; // Name of the downloaded file
    link.click(); // Trigger the download
  })
  .catch(error => console.error('Error:', error));
