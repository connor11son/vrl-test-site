document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const yearFilter = document.getElementById('year-filter');
    const tagFilter = document.getElementById('tag-filter');
    // Temporarily disabled categoryFilter
    // const categoryFilter = document.getElementById('category-filter');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const publicationsContainer = document.getElementById('publications-container');
    
    
    // State
    let publications = [];
    let allPublications = [];
    let availableYears = [];
    
    // Fetch publications from JSON file
    async function fetchPublications(filters = {}) {
        publicationsContainer.innerHTML = '<div class="loading-spinner">Loading publications...</div>';
        
        try {
            // Only fetch if we don't have data yet
            if (allPublications.length === 0) {
                // Try different paths to find the publications.json file
                let response = null;
                const possiblePaths = [
                    'publications.json',
                    '/publications.json',
                    'js/publications.json',
                    '/js/publications.json',
                    'data/publications/publications.json',
                    '/data/publications/publications.json'
                ];
                
                for (const path of possiblePaths) {
                    try {
                        console.log(`Trying to load publications from: ${path}`);
                        const tempResponse = await fetch(path);
                        if (tempResponse.ok) {
                            response = tempResponse;
                            console.log(`Successfully loaded publications from: ${path}`);
                            break;
                        }
                    } catch (e) {
                        console.log(`Failed to load from ${path}: ${e.message}`);
                    }
                }
                
                if (!response || !response.ok) {
                    throw new Error('Failed to load publications from any path');
                }
                
                allPublications = await response.json();
            }
            
            // Apply filters
            publications = allPublications.filter(pub => {
                // Apply year filter
                if (filters.year && pub.year != filters.year) {
                    return false;
                }
                
                // Apply tag filter (for research area filtering)
                if (filters.tag) {
                    // If a specific tag is selected, only show publications with that tag
                    if (!pub.tags || !pub.tags.includes(filters.tag)) {
                        return false;
                    }
                }
                // If "All Research Areas" is selected, show all publications (no filtering by tags)
                
                // Category filtering temporarily disabled
                // Apply category filter
                // if (filters.category && pub.category !== filters.category) {
                //     return false;
                // }
                
                return true;
            });
            
            // If this is the initial load, populate the year filter
            if (Object.keys(filters).length === 0) {
                populateYearFilter();
            }
            
            // Render publications
            renderPublications();
        } catch (error) {
            console.error('Error:', error);
            publicationsContainer.innerHTML = `
                <div class="no-publications">
                    <p>Sorry, there was an error loading the publications. Please try again later.</p>
                    <p>Error details: ${error.message}</p>
                </div>
            `;
        }
    }
    
    // Populate tag filter with available tags from JSON
    async function populateTagFilter() {
        try {
            const response = await fetch('data/publications/tags.json');
            if (!response.ok) {
                throw new Error('Failed to load tags');
            }
            
            const data = await response.json();
            const tags = data.tags || [];
            
            // Clear existing options except the first one
            while (tagFilter.options.length > 1) {
                tagFilter.remove(1);
            }
            
            // Add options for each tag
            tags.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag.id;
                option.textContent = tag.name;
                tagFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading tags:', error);
        }
    }
    
    // Populate year filter with available years
    function populateYearFilter() {
        // Extract unique years from publications, filtering out null or undefined years
        const years = allPublications
            .map(pub => pub.year)
            .filter(year => year != null);
            
        availableYears = [...new Set(years)].sort((a, b) => b - a);
        
        // Clear existing options except the first one
        while (yearFilter.options.length > 1) {
            yearFilter.remove(1);
        }
        
        // Add options for each year
        availableYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }
    
    // Render publications to the container
    function renderPublications() {
        if (publications.length === 0) {
            publicationsContainer.innerHTML = `
                <div class="no-publications">
                    <p>No publications found matching your criteria.</p>
                </div>
            `;
            return;
        }
        
        // Sort publications by year (newest first)
        const sortedPublications = [...publications].sort((a, b) => {
            // Handle null/undefined years
            if (a.year == null) return 1;
            if (b.year == null) return -1;
            
            // Sort by year descending
            return b.year - a.year;
        });
        
        // Generate HTML
        let html = '';
        
        // Group publications by year
        const yearGroups = {};
        
        sortedPublications.forEach(pub => {
            const year = pub.year || 'Undated';
            if (!yearGroups[year]) {
                yearGroups[year] = [];
            }
            yearGroups[year].push(pub);
        });
        
        // Render publications by year groups
        Object.keys(yearGroups)
            .sort((a, b) => {
                if (a === 'Undated') return 1;
                if (b === 'Undated') return -1;
                return b - a;
            })
            .forEach(year => {
                const yearPublications = yearGroups[year];
                
                html += `
                    <div class="publication-year-group fade-in active">
                        <h2 class="section-title">${year}</h2>
                        
                        ${yearPublications.map(pub => `
                            <div class="publication">
                                <h3>${pub.title}</h3>
                                <p class="publication-meta">${pub.authors} ${pub.month ? `| ${pub.month}` : ''} ${pub.publication_venue ? `| <strong>${pub.publication_venue}</strong>` : ''}</p>
                                ${pub.abstract ? `
                                    <div class="abstract-section">
                                        <button class="abstract-toggle" onclick="toggleAbstract(this)">Show Abstract</button>
                                        <p class="abstract-text" style="display: none;">${pub.abstract}</p>
                                    </div>
                                ` : ''}
                                <div class="publication-links">
                                    ${pub.doi_link && pub.doi_link !== '#' ? `<a href="${pub.doi_link}">DOI</a>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            });
        
        publicationsContainer.innerHTML = html;
    }
    
    // Event listeners
    applyFiltersBtn.addEventListener('click', function() {
        const filters = {
            year: yearFilter.value,
            tag: tagFilter.value,
            // Category filtering temporarily disabled
            // category: categoryFilter.value
        };
        
        fetchPublications(filters);
    });
    
    resetFiltersBtn.addEventListener('click', function() {
        yearFilter.value = '';
        tagFilter.value = '';
        // Category filtering temporarily disabled
        // categoryFilter.value = '';
        
        fetchPublications();
    });
    
    // Check for URL parameters
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    
    // Initial load - populate tag filter and check for tag parameter
    async function initializePage() {
        await populateTagFilter();
        
        const tagFromUrl = getUrlParameter('tag');
        if (tagFromUrl && tagFilter) {
            // Set the tag filter dropdown to match URL parameter
            tagFilter.value = tagFromUrl;
            // If there's a tag parameter, we'll filter by that tag
            const initialFilters = { tag: tagFromUrl };
            fetchPublications(initialFilters);
        } else {
            fetchPublications();
        }
    }
    
    initializePage();
});

function toggleAbstract(button) {
    const abstractText = button.nextElementSibling;
    const isHidden = abstractText.style.display === 'none';
    
    if (isHidden) {
        abstractText.style.display = 'block';
        button.textContent = 'Hide Abstract';
    } else {
        abstractText.style.display = 'none';
        button.textContent = 'Show Abstract';
    }
}