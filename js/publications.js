document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const yearFilter = document.getElementById('year-filter');
    const categoryFilter = document.getElementById('category-filter');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const publicationsContainer = document.getElementById('publications-container');
    
    // State
    let publications = [];
    let allPublications = [];
    let availableYears = [];
    
    // Create BibTeX modal
    const modal = document.createElement('div');
    modal.className = 'bibtex-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>BibTeX Citation</h3>
            <div class="bibtex-code"></div>
            <button class="modal-close">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
    
    const bibtexCode = modal.querySelector('.bibtex-code');
    const closeModalBtn = modal.querySelector('.modal-close');
    
    closeModalBtn.addEventListener('click', function() {
        modal.classList.remove('show');
    });
    
    // Close modal when clicking outside content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    // Fetch publications from JSON file
    async function fetchPublications(filters = {}) {
        publicationsContainer.innerHTML = '<div class="loading-spinner">Loading publications...</div>';
        
        try {
            // Only fetch if we don't have data yet
            if (allPublications.length === 0) {
                const response = await fetch('js/publications.json');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch publications');
                }
                
                allPublications = await response.json();
            }
            
            // Apply filters
            publications = allPublications.filter(pub => {
                // Apply year filter
                if (filters.year && pub.year != filters.year) {
                    return false;
                }
                
                // Apply category filter
                if (filters.category && pub.category !== filters.category) {
                    return false;
                }
                
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
                </div>
            `;
        }
    }
    
    // Populate year filter with available years
    function populateYearFilter() {
        // Extract unique years from publications
        availableYears = [...new Set(allPublications.map(pub => pub.year))].sort((a, b) => b - a);
        
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
        
        // Group publications by category
        const categoryLabels = {
            'recent': 'Recent Publications',
            'book': 'Books and Book Chapters',
            'patent': 'Patents'
        };
        
        const categories = {};
        
        // Initialize categories
        Object.keys(categoryLabels).forEach(key => {
            categories[key] = { title: categoryLabels[key], items: [] };
        });
        
        // Populate categories
        publications.forEach(pub => {
            if (categories[pub.category]) {
                categories[pub.category].items.push(pub);
            } else {
                // Handle unknown category
                if (!categories['other']) {
                    categories['other'] = { title: 'Other Publications', items: [] };
                }
                categories['other'].items.push(pub);
            }
        });
        
        // Generate HTML
        let html = '';
        
        Object.keys(categories).forEach(key => {
            const category = categories[key];
            
            if (category.items.length > 0) {
                html += `
                    <div class="publication-category fade-in active">
                        <h2 class="section-title">${category.title}</h2>
                        
                        ${category.items.map(pub => `
                            <div class="publication">
                                <h3>${pub.title}</h3>
                                <p class="publication-meta">${pub.authors} (${pub.year}) | ${pub.publication_venue}</p>
                                <p>${pub.abstract || ''}</p>
                                <div class="publication-links">
                                    ${pub.pdf_link ? `<a href="${pub.pdf_link}">PDF</a>` : ''}
                                    ${pub.doi_link ? `<a href="${pub.doi_link}">DOI</a>` : ''}
                                    ${pub.bibtex ? `<a href="#" class="bibtex-link" data-id="${pub.id}">BibTeX</a>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        });
        
        publicationsContainer.innerHTML = html;
        
        // Add event listeners for BibTeX links
        document.querySelectorAll('.bibtex-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const id = this.getAttribute('data-id');
                const pub = publications.find(p => p.id == id);
                if (pub && pub.bibtex) {
                    bibtexCode.textContent = pub.bibtex;
                    modal.classList.add('show');
                }
            });
        });
    }
    
    // Event listeners
    applyFiltersBtn.addEventListener('click', function() {
        const filters = {
            year: yearFilter.value,
            category: categoryFilter.value
        };
        
        fetchPublications(filters);
    });
    
    resetFiltersBtn.addEventListener('click', function() {
        yearFilter.value = '';
        categoryFilter.value = '';
        fetchPublications();
    });
    
    // Initial load
    fetchPublications();
});