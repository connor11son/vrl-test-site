document.addEventListener('DOMContentLoaded', function() {
    // Function to load alumni data from JSON file
    const loadAlumni = async () => {
        try {
            // Try multiple possible paths to find the alumni.json file
            let response;
            const possiblePaths = [
                'data/people/alumni.json',
                '/data/people/alumni.json',
                './data/people/alumni.json',
                '../data/people/alumni.json'
            ];
            
            // Try each path until we find a working one
            for (const path of possiblePaths) {
                try {
                    console.log(`Trying to load alumni data from: ${path}`);
                    const tempResponse = await fetch(path);
                    if (tempResponse.ok) {
                        response = tempResponse;
                        console.log(`Successfully loaded alumni data from: ${path}`);
                        break;
                    }
                } catch (e) {
                    console.log(`Failed to load from ${path}: ${e.message}`);
                }
            }
            
            if (!response || !response.ok) {
                throw new Error('Failed to load alumni data from any path');
            }
            
            const alumniData = await response.json();
            
            // Render alumni table
            renderAlumniTable(alumniData.alumni || []);
            
        } catch (error) {
            console.error('Error loading alumni data:', error);
            const alumniContainer = document.getElementById('alumni-container');
            if (alumniContainer) {
                alumniContainer.innerHTML = '<p>Unable to load alumni data. Please check that the alumni.json file exists and is properly formatted.</p>';
            }
        }
    };
    
    // Function to render alumni table
    const renderAlumniTable = (alumniList) => {
        // Find the container for alumni table
        const container = document.getElementById('alumni-container');
        if (!container) return;
        
        // Create the table elements
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'alumni-table-wrapper fade-in';
        
        const table = document.createElement('table');
        table.className = 'alumni-table';
        
        // Create the table header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th style="text-align: center;">Name</th>
                <th style="text-align: center;">Year</th>
                <th style="text-align: center;">Degree</th>
                <th style="text-align: center;">Thesis</th>
                <th style="text-align: center;">Current Position</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Create the table body
        const tbody = document.createElement('tbody');
        
        // Group alumni by year
        const alumniByYear = groupAlumniByYear(alumniList);
        
        // Sort years in descending order
        const years = Object.keys(alumniByYear).sort((a, b) => b - a);
        
        // Create rows for each year and its alumni
        years.forEach(year => {
            // Add year marker row
            const yearMarkerRow = document.createElement('tr');
            yearMarkerRow.className = 'year-marker';
            yearMarkerRow.innerHTML = `<td colspan="5"><span>${year}</span></td>`;
            tbody.appendChild(yearMarkerRow);
            
            // Add alumni rows for this year
            alumniByYear[year].forEach(alumnus => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${alumnus.name}</td>
                    <td>${alumnus.year}</td>
                    <td>${alumnus.degree}</td>
                    <td>${alumnus.thesis || 'N/A'}</td>
                    <td>${alumnus.position || '—'}</td>
                `;
                tbody.appendChild(row);
            });
        });
        
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        
        // Clear the container and add the table
        container.innerHTML = '';
        container.appendChild(tableWrapper);
        
        // Activate the fade-in effect
        setTimeout(() => {
            tableWrapper.classList.add('active');
        }, 100);
    };
    
    // Helper function to group alumni by year
    const groupAlumniByYear = (alumniList) => {
        const groupedAlumni = {};
        
        alumniList.forEach(alumnus => {
            if (!groupedAlumni[alumnus.year]) {
                groupedAlumni[alumnus.year] = [];
            }
            groupedAlumni[alumnus.year].push(alumnus);
        });
        
        return groupedAlumni;
    };
    
    // Load alumni when the page loads
    loadAlumni();
});