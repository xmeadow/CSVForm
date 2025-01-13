var fields = Array.from(document.getElementsByTagName("input"));
var articles = []; // Array to store CSV rows
var articlesArray = []; // Array to store form data
var index = 0;
var inputCSV = document.getElementById("file-upload"); // File input element
var currentDate = new Date(); // Current date for filename

// Import CSV function
function importCSV() {
    const file = inputCSV.files[0]; // Get the selected file
    if (!file) {
        alert("Please select a file to import.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const content = event.target.result;
        const rows = content.split('\n').filter(row => row.trim() !== ""); // Split rows and filter empty lines
        const data = rows.map(row => row.split(';')); // Split each row into columns

        // Process the imported data (e.g., populate the form)
        console.log("Imported Data:", data);
        alert("CSV imported successfully!");
    };
    reader.onerror = function () {
        console.error("Error reading file.");
        alert("Error reading file. Please try again.");
    };
    reader.readAsText(file); // Read the file as text
}

// Export CSV function
function exportCSV() {
    if (articles.length < 1) {
        nextItem(); // Add the current form data to the articles array
    }

    let out = articles.join("\r\n"); // Join all rows with line breaks
    let filename = `PRICAT_${articlesArray[0][1].value}_${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}.csv`;

    let blob = new Blob([out], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // For IE
        navigator.msSaveBlob(blob, filename);
    } else {
        let link = document.createElement("a");
        if (link.download !== undefined) {
            let url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Clean up
        }
    }
}

// Next Item function
function nextItem() {
    let data = $("#PRICAT input").serializeArray();
    articlesArray.push(data); // Store form data

    let out = data.map(field => `"${field.value}"`).join(";"); // Create CSV row
    articles.push(out); // Add row to articles array
    console.log("Added Row:", out);

    clearFields(); // Clear the form for the next entry
}

// Previous Item function
function prevItem() {
    if (index > 0) {
        index--;
        let tmp = articlesArray[index];
        let inputs = $("#PRICAT input");
        inputs.each(function (i) {
            if (tmp[i].checked !== undefined) { // Handle checkboxes and radio buttons
                this.checked = tmp[i].checked;
            } else {
                this.value = tmp[i].value;
            }
        });
    }
}

// Clear Form Fields function
function clearFields() {
    $("#PRICAT input").each(function () {
        if (this.type === "checkbox" || this.type === "radio") {
            this.checked = false;
        } else {
            this.value = "";
        }
    });
}

// Attach event listener to the file input
inputCSV.addEventListener("change", importCSV);
