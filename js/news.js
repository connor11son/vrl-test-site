document.addEventListener('DOMContentLoaded', function() {
    // Function to load news from JSON file
    const loadNews = async () => {
        try {
            const response = await fetch('data/news/news.json');
            
            if (!response.ok) {
                throw new Error('Failed to load news data');
            }
            
            const newsItems = await response.json();
            
            // Sort news by date (descending - newest first)
            newsItems.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            // Take the 3 most recent news items
            const recentNews = newsItems.slice(0, 3);
            
            // Get the news container
            const newsContainer = document.querySelector('.latest-news-container');
            
            // Clear existing content
            if (newsContainer) {
                newsContainer.innerHTML = '';
                
                // Create and append news items
                recentNews.forEach(item => {
                    const newsBox = createNewsBox(item);
                    newsContainer.appendChild(newsBox);
                });
            }
        } catch (error) {
            console.error('Error loading news:', error);
            // Display an error message in the news container
            const newsContainer = document.querySelector('.latest-news-container');
            if (newsContainer) {
                newsContainer.innerHTML = '<div class="feature-box"><div class="feature-content"><h3>Unable to load news</h3><p>Please check that the news.json file exists and is properly formatted.</p></div></div>';
            }
        }
    };
    
    // Function to create a news box HTML element
    const createNewsBox = (newsItem) => {
        // Format the date for display
        const displayDate = formatDate(newsItem.date);
        
        // Create the feature box
        const featureBox = document.createElement('div');
        featureBox.className = 'feature-box';
        
        // Create content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'feature-content';
        
        // Add title
        const title = document.createElement('h3');
        title.textContent = newsItem.title;
        contentDiv.appendChild(title);
        
        // Add content with links
        const content = document.createElement('p');
        
        // Check if the content contains links to replace
        if (newsItem.links && newsItem.links.length > 0) {
            let contentText = newsItem.content;
            
            // Replace link placeholders with actual links
            newsItem.links.forEach((link, index) => {
                const linkPlaceholder = `[link${index + 1}]`;
                const linkHTML = `<a href="${link.url}" target="_blank">${link.text}</a>`;
                contentText = contentText.replace(linkPlaceholder, linkHTML);
            });
            
            content.innerHTML = contentText;
        } else {
            content.textContent = newsItem.content;
        }
        
        contentDiv.appendChild(content);
        
        // Add date
        const dateP = document.createElement('p');
        dateP.style.color = 'var(--text-secondary)';
        dateP.style.fontSize = '0.9rem';
        dateP.style.marginTop = 'auto';
        dateP.textContent = displayDate;
        contentDiv.appendChild(dateP);
        
        // Add content to feature box
        featureBox.appendChild(contentDiv);
        
        return featureBox;
    };
    
    // Helper function to format date
    const formatDate = (dateString) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        const date = new Date(dateString);
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };
    
    // Load news when the page loads
    loadNews();
});