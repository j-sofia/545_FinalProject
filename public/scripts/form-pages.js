document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('.form-container');
    const pagesParam = parseInt(formContainer.getAttribute('data-pages'), 10) || 1;
    const formElement = document.getElementById('multiPageForm');
    let currentPage = 1;
    const formElements = document.querySelectorAll('.form-element');
    const totalElements = formElements.length;
    const backButton = document.getElementById('backButton');
    const nextButton = document.getElementById('nextButton');
    const submitButton = document.getElementById('submitButton');
    let startTime = Date.now();
    let deleteCount = 0;
    let characterCount = 0;

    formElement.addEventListener('keydown', function(event) {
        if (event.key === 'Backspace' || event.key === 'Delete' || event.key === 'EraseEof' || event.key === 'Clear' || event.key === 'Del') {
            deleteCount++;
        }
    });

    formElement.addEventListener('keyup', function() {
        characterCount = [...formElement.querySelectorAll('input[type=text], input[type=email], input[type=tel], textarea')]
                            .reduce((acc, el) => acc + el.value.length, 0);
    });

    function updatePageVisibility() {
        let elementIndex = 0;
        for (let page = 1; page <= pagesParam; page++) {
            let elementsOnPage = Math.ceil((totalElements - elementIndex) / (pagesParam - page + 1));
            for (let i = 0; i < elementsOnPage; i++, elementIndex++) {
                formElements[elementIndex].style.display = page === currentPage ? '' : 'none';
            }
        }

        backButton.style.display = currentPage > 1 ? 'block' : 'none';
        submitButton.style.display = currentPage === pagesParam ? 'block' : 'none';
        nextButton.style.display = currentPage < pagesParam ? 'block' : 'none';
    }

    function validateCurrentPage() {
        let isValid = true;
        let elementIndex = 0;
        for (let page = 1; page <= pagesParam; page++) {
            let elementsOnPage = Math.ceil((totalElements - elementIndex) / (pagesParam - page + 1));
            if (page === currentPage) {
                for (let i = 0; i < elementsOnPage; i++, elementIndex++) {
                    let inputs = formElements[elementIndex].querySelectorAll('input, textarea, select');
                    for (let input of inputs) {
                        let errorMessage = input.parentElement.querySelector('.error-message');
                        if (!input.value.trim()) {
                            errorMessage.textContent = "This field cannot be empty.";
                            errorMessage.style.display = 'block';
                            isValid = false;
                        } else if (!input.checkValidity()) {
                            errorMessage.textContent = input.validationMessage;
                            errorMessage.style.display = 'block';
                            isValid = false;
                        } else {
                            errorMessage.textContent = "";
                            errorMessage.style.display = 'none';
                        }
                    }
                }
            } else {
                elementIndex += elementsOnPage;
            }
        }
        return isValid;
    }

    nextButton.addEventListener('click', function() {
        if (validateCurrentPage() && currentPage < pagesParam) {
            currentPage++;
            updatePageVisibility();
        }
    });

    submitButton.addEventListener('click', function() {
        if (validateCurrentPage()) {
            formElement.submit();
        }
    });

    backButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePageVisibility();
        }
    });

    function downloadCSV(data, filename) {
        let csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    formElement.addEventListener('submit', function(event) {
        event.preventDefault();

        const totalTime = (Date.now() - startTime) / 1000;
        let formData = new FormData(formElement);
        let data = [];
        formData.forEach((value, key) => {
            let inputElement = formElement.querySelector(`[name="${key}"]`);
            if (inputElement && inputElement.id !== 'formTime' && inputElement.id !== 'keystrokes' && inputElement.id !== 'charactersEntered') {
                data.push([key, value]);
            }
        });
        data.push(['Total Time (seconds)', totalTime]);
        data.push(['Total Deletions', deleteCount]);
        data.push(['Total Characters Entered', characterCount]);

        downloadCSV(data, 'form-data.csv');
    });

    updatePageVisibility();
});
