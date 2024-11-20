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

// Scroll to Projects Section
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        window.scrollTo({
            top: document.getElementById('projects-page').offsetTop - 70,
            behavior: 'smooth',
        });
    });
}

// Fetch and display projects from projects.json
fetch('projects.json')
    .then((response) => response.json())
    .then((data) => {
        const projectsContainer = document.getElementById('projects-container');
        data.projects.forEach((project) => {
            const projectCard = document.createElement('div');
            projectCard.classList.add('project-card');
            projectCard.setAttribute('data-aos', 'fade-up');

            fetch(project.code_url)
                .then((response) => response.text())
                .then((code) => {
                    projectCard.innerHTML = `
                        <div class="project-code">
                            <pre><code class="language-${project.language}">${escapeHtml(code)}</code></pre>
                        </div>
                        <div class="project-description">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <a href="${project.link}" class="btn" target="_blank">View Project</a>
                        </div>
                    `;
                    projectsContainer.appendChild(projectCard);
                    Prism.highlightAll();
                })
                .catch((err) => console.error(`Error loading code for ${project.title}:`, err));
        });
    })
    .catch((err) => console.error('Error loading projects:', err));

// Utility function to escape HTML
function escapeHtml(str) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return str.replace(/[&<>"']/g, (m) => map[m]);
}
