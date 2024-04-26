// public/javascripts/forum.js
document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sortSelect');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
  
    // Get the current sort and filter values from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentSort = urlParams.get('sort') || 'default';
    const currentFilters = {
      hasFlowers: urlParams.get('hasFlowers') === 'true',
      hasLeaves: urlParams.get('hasLeaves') === 'true',
      hasFruitsOrSeeds: urlParams.get('hasFruitsOrSeeds') === 'true'
    };
  
    // Set the initial values of the sort select and filter checkboxes
    sortSelect.value = currentSort;
    document.getElementById('hasFlowersFilter').checked = currentFilters.hasFlowers;
    document.getElementById('hasLeavesFilter').checked = currentFilters.hasLeaves;
    document.getElementById('hasFruitsOrSeedsFilter').checked = currentFilters.hasFruitsOrSeeds;
  
    sortSelect.addEventListener('change', function() {
      const selectedSort = this.value;
      const filters = getSelectedFilters();
      const url = `/forum?sort=${selectedSort}&${filters}`;
  
      window.location.href = url;
    });
  
    applyFiltersBtn.addEventListener('click', function() {
      const selectedSort = sortSelect.value;
      const filters = getSelectedFilters();
      const url = `/forum?sort=${selectedSort}&${filters}`;
  
      window.location.href = url;
    });
  
    function getSelectedFilters() {
      const hasFlowersFilter = document.getElementById('hasFlowersFilter').checked;
      const hasLeavesFilter = document.getElementById('hasLeavesFilter').checked;
      const hasFruitsOrSeedsFilter = document.getElementById('hasFruitsOrSeedsFilter').checked;
  
      let filters = '';
      if (hasFlowersFilter) {
        filters += 'hasFlowers=true&';
      }
      if (hasLeavesFilter) {
        filters += 'hasLeaves=true&';
      }
      if (hasFruitsOrSeedsFilter) {
        filters += 'hasFruitsOrSeeds=true&';
      }
  
      return filters.slice(0, -1);
    }
  });