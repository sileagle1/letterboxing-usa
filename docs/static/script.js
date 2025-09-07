
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        let searchData = [];
        
        // Load search index
        fetch('search/search_index.json')
            .then(response => response.json())
            .then(data => {
                searchData = data;
                searchInput.disabled = false;
                searchInput.placeholder = 'Search threads by title or author...';
            })
            .catch(error => {
                console.error('Error loading search index:', error);
                searchInput.placeholder = 'Search not available';
            });
        
            function performSearch() {
            const query = searchInput.value.trim().toLowerCase();
            if (query.length < 2) {
                searchResults.innerHTML = '<p>Please enter at least 2 characters to search.</p>';
                searchResults.style.display = 'block';
                return;
            }
            
            // Search in threads
            const threadResults = searchData.filter(thread => {
                // Check if query matches title
                if (thread.title && thread.title.toLowerCase().includes(query)) {
                    return true;
                }
                
                // Check if query matches any author
                if (thread.authors && thread.authors.some(author => 
                    author && author.toLowerCase().includes(query)
                )) {
                    return true;
                }
                
                return false;
            });
            
            displayResults(threadResults);
        }
        
        // Add event listeners
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Add click event listener to the search button
        const searchButton = document.getElementById('search-button');
        if (searchButton) {
            searchButton.addEventListener('click', performSearch);
        }
    }
    
    function displayResults(threads) {
        const searchResults = document.getElementById('search-results');
        
        if (threads.length === 0) {
            searchResults.innerHTML = '<p>No matching threads found.</p>';
            searchResults.style.display = 'block';
            return;
        }
        
        let html = '<div class="search-results">';
        html += `<p>Found ${threads.length} matching thread${threads.length === 1 ? '' : 's'}:</p>`;
        
        threads.forEach(thread => {
            const authors = thread.authors && thread.authors.length > 0 
                ? `by ${thread.authors.join(', ')}` 
                : 'No authors';
            
            html += `
            <div class="search-result">
                <h3><a href="${thread.url}">${escapeHtml(thread.title)}</a></h3>
                <div class="search-meta">
                    ${authors}
                </div>
            </div>
            `;
        });
        
        html += '</div>';
        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }
    
    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe
            .toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
