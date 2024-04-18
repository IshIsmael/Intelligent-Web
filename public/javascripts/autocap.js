// public/javascripts/autocap.js
function autocap(input) {
    let words = input.value.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    input.value = words.join(' ');
}