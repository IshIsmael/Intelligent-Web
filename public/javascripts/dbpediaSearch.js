document.addEventListener('DOMContentLoaded', () => {
    const plantSearchInput = document.getElementById('plantSearch');
    const searchResults = document.getElementById('searchResults');
  
    plantSearchInput.addEventListener('input', async () => {
      const query = plantSearchInput.value.trim();
  
      if (query.length > 2) {
        try {
          const response = await fetch(`/dbpedia-plants?plant=${query}`);
          const results = await response.json();
          displaytheResults(results);
        } catch (error) {
          console.error('Error fetching DBpedia plants:', error);
        }
      } else {
        searchResults.innerHTML = '';
      }
    });
  
    const displaytheResults = (results) => {
      searchResults.innerHTML = '';
      results.forEach(result => {
        const listItem = document.createElement('li');
        listItem.textContent = result.label;
        listItem.addEventListener('click', () => {
          document.getElementById('commonName').value = result.label;
          searchResults.innerHTML = '';
        });
        searchResults.appendChild(listItem);
      });
    };
  });

// Toggles the DBPedia Search, if user knows plant name or not
function toggleDBpediaSearch() {
const knowsPlantName = document.getElementById('knowsPlantName').checked;
const dbpediaSearchContainer = document.getElementById('dbpediaSearchContainer');
const plantSearchInput = document.getElementById('plantSearch');
if (knowsPlantName) {
    dbpediaSearchContainer.style.display = 'block';
    plantSearchInput.disabled = false;
    } 
else {
    dbpediaSearchContainer.style.display = 'none';
    plantSearchInput.disabled = true;
    plantSearchInput.value = '';
    document.getElementById('searchResults').innerHTML = '';
    }
}
