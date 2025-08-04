document.addEventListener('DOMContentLoaded', function() {
    // Get the container where research projects will be displayed
    const researchContainer = document.getElementById('research-projects-container');
    
    if (!researchContainer) {
        console.error('Research projects container not found');
        return;
    }
    
    // Fetch the research data from JSON file
    fetch('data/research/research.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            // Process and display the research data
            displayResearchProjects(data.projects, researchContainer);
        })
        .catch(error => {
            console.error('Error loading research data:', error);
            displayErrorMessage(researchContainer);
        });
});

/**
 * Display research projects from JSON data
 * @param {Array} projects - Array of research project objects
 * @param {HTMLElement} container - Container element for the projects
 */
function displayResearchProjects(projects, container) {
    if (!projects || !projects.length) {
        container.innerHTML = '<p>No research projects found.</p>';
        return;
    }
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Iterate through projects and create HTML for each
    projects.forEach((project, index) => {
        const projectElement = document.createElement('div');
        projectElement.id = project.id;
        projectElement.className = 'research-project fade-in';
        
        // Determine if this is an even-indexed project for alternating layout
        const isEven = index % 2 !== 0;
        
        // Map project IDs to publication tags
        const tagMapping = {
            'complex-activity': 'complex-activity',
            'biomedical': 'biomedical',
            'materials': 'materials',
            'wildlife': 'wildlife',
            'geospatial': 'geospatial'
        };
        
        const publicationTag = tagMapping[project.id] || project.id;
        
        // Create HTML for the project
        projectElement.innerHTML = `
            <div class="research-image">
                <div class="research-image-before" style="background-image: url('${project.imageBefore}')"></div>
                <div class="research-image-after" style="background-image: url('${project.imageAfter}')"></div>
            </div>
            <div class="research-content">
                <h3>${project.title}</h3>
                ${project.description.map(paragraph => `<p>${paragraph}</p>`).join('')}
                <a href="publications.html?tag=${publicationTag}" class="btn" style="margin-top: 15px;">Publications</a>
            </div>
        `;
        
        // Add to container
        container.appendChild(projectElement);
    });
    
    // Trigger fade-in animation for newly added elements
    setTimeout(() => {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            element.classList.add('active');
        });
    }, 100);
}

/**
 * Display error message when research data can't be loaded
 * @param {HTMLElement} container - Container element for the error message
 */
function displayErrorMessage(container) {
    container.innerHTML = `
        <div class="error-message">
            <h3>Unable to load research projects</h3>
            <p>Sorry, we couldn't load the research projects at this time. Please try again later.</p>
        </div>
    `;
}