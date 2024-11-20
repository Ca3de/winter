// Toggle Navigation Menu on Hamburger Click
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    const circle = document.createElement('span');
    circle.classList.add('theme-transition-circle');
    body.appendChild(circle);

    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');

    localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');

    circle.addEventListener('animationend', () => {
        circle.remove();
    });
});

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    body.classList.add(savedTheme === 'light' ? 'light-mode' : 'dark-mode');

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
        });
    }
});

// Fetch and display projects
fetch('projects.json')
    .then((response) => response.json())
    .then((data) => {
        const projectsContainer = document.getElementById('projects-container');
        data.projects.forEach((project) => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card', 'ide-style');
            projectCard.setAttribute('data-aos', 'fade-up');

            const ideHeader = `
                <div class="ide-header">
                    <span class="file-name">${project.title}</span>
                </div>
            `;

            fetch(project.code_url)
                .then((response) => response.text())
                .then((code) => {
                    const codeElement = `<pre><code class="language-${project.language} typing-code">${escapeHtml(
                        code
                    )}</code></pre>`;

                    const projectDescription = `
                        <div class="project-description">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <a href="${project.link}" class="btn" target="_blank">View Project</a>
                        </div>
                    `;

                    projectCard.innerHTML = ideHeader + codeElement + projectDescription;
                    projectsContainer.appendChild(projectCard);

                    Prism.highlightAll(); // Syntax highlighting
                })
                .catch((err) => console.error(`Error loading code for ${project.title}:`, err));
        });
    })
    .catch((err) => console.error('Error loading projects:', err));

// Utility function to escape HTML
function escapeHtml(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return string.replace(/[&<>"']/g, (m) => map[m]);
}
