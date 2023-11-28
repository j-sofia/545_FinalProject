// Function to update the URL
function updateURL() {
    const numberOfPages = document.getElementById('numberOfPages').value;
    const styleType = document.getElementById('styleType').checked ? 'Casual' : 'Professional';
    const guid = uuidv4();
    const url = `form?pages=${numberOfPages}&style=${styleType}&guid=${guid}`;
    document.getElementById('generatedUrl').value = window.location.href + url;
}

// Event listeners for form inputs
document.getElementById('numberOfPages').addEventListener('input', updateURL);
document.getElementById('styleType').addEventListener('change', updateURL);

// Initially update the URL
updateURL();

// Function to copy URL to clipboard and change button text
document.getElementById('copyButton').addEventListener('click', function() {
    const urlBox = document.getElementById('generatedUrl');
    urlBox.select();
    document.execCommand('copy');
    this.textContent = 'Copied!';
    setTimeout(() => this.textContent = 'Copy to Clipboard', 2000);
});

// Function to generate a GUID
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
