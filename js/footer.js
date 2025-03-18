document.addEventListener('DOMContentLoaded', function() {
    // Load footer
    if (document.getElementById('footer-placeholder')) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('footer-placeholder').innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading footer:', error);
            });
    }
});