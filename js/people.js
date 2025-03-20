document.addEventListener('DOMContentLoaded', function() {
    // Function to load people data from JSON file
    const loadPeople = async () => {
        try {
            // Try multiple possible paths to find the people.json file
            let response;
            const possiblePaths = [
                'data/people/people.json',
                '/data/people/people.json',
                './data/people/people.json',
                '../data/people/people.json'
            ];
            
            // Try each path until we find a working one
            for (const path of possiblePaths) {
                try {
                    console.log(`Trying to load people data from: ${path}`);
                    const tempResponse = await fetch(path);
                    if (tempResponse.ok) {
                        response = tempResponse;
                        console.log(`Successfully loaded people data from: ${path}`);
                        break;
                    }
                } catch (e) {
                    console.log(`Failed to load from ${path}: ${e.message}`);
                }
            }
            
            if (!response || !response.ok) {
                throw new Error('Failed to load people data from any path');
            }
            
            const peopleData = await response.json();
            
            // Render each category of people
            renderPeopleCategory('faculty', peopleData.faculty || []);
            renderPeopleCategory('graduateStudents', peopleData.graduateStudents || []);
            renderPeopleCategory('researchers', peopleData.researchers || []);
            renderPeopleCategory('undergraduates', peopleData.undergraduates || []);
            
        } catch (error) {
            console.error('Error loading people data:', error);
            document.querySelectorAll('.loading-people').forEach(el => {
                el.innerHTML = '<p>Unable to load people data. Please check that the people.json file exists and is properly formatted.</p>';
            });
        }
    };
    
    // Function to render a category of people
    const renderPeopleCategory = (categoryId, peopleList) => {
        // Find the container for this category
        const container = document.getElementById(`${categoryId}-container`);
        if (!container) return;
        
        // Clear loading message
        container.innerHTML = '';
        
        // Create and append person cards
        peopleList.forEach(person => {
            const personElement = createPersonElement(person);
            container.appendChild(personElement);
        });
    };
    
    // Function to create a person element
    const createPersonElement = (person) => {
        // Create the team member container
        const teamMember = document.createElement('div');
        teamMember.className = 'team-member';
        
        // Add photo
        const photoDiv = document.createElement('div');
        photoDiv.className = 'member-photo';
        photoDiv.style.backgroundImage = `url('${person.photo}')`;
        teamMember.appendChild(photoDiv);
        
        // Add minimal info (shown by default)
        const minimalInfo = document.createElement('div');
        minimalInfo.className = 'member-info-minimal';
        
        const name = document.createElement('h3');
        name.textContent = person.name;
        minimalInfo.appendChild(name);
        
        const shortRole = document.createElement('p');
        shortRole.className = 'member-role-minimal';
        shortRole.textContent = person.shortRole || person.role;
        minimalInfo.appendChild(shortRole);
        
        teamMember.appendChild(minimalInfo);
        
        // Add detailed info (shown on hover)
        const details = document.createElement('div');
        details.className = 'member-details';
        
        const detailName = document.createElement('h3');
        detailName.textContent = person.name;
        details.appendChild(detailName);
        
        const role = document.createElement('p');
        role.className = 'member-role-detailed';
        role.textContent = person.role;
        details.appendChild(role);
        
        const bio = document.createElement('p');
        bio.className = 'member-bio';
        bio.textContent = person.bio;
        details.appendChild(bio);
        
        const research = document.createElement('p');
        research.className = 'member-research';
        research.textContent = `Research: ${person.research}`;
        details.appendChild(research);
        
        const email = document.createElement('p');
        email.className = 'member-email';
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${person.email}`;
        emailLink.textContent = person.email;
        email.appendChild(emailLink);
        details.appendChild(email);

        // Add website link if person has a website
        if (person.website) {
            const website = document.createElement('p');
            website.className = 'member-website';
            const websiteLink = document.createElement('a');
            websiteLink.href = person.website;
            websiteLink.target = '_blank';
            websiteLink.textContent = 'Website';
            website.appendChild(websiteLink);
            details.appendChild(website);
        }
        
        teamMember.appendChild(details);
        
        return teamMember;
    };
    
    // Load people when the page loads
    loadPeople();
});