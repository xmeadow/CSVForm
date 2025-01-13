var fields = Array.from(document.getElementsByTagName("input"));
var articles = []; 
var articlesArray = []; 
var index = 0;
var inputCSV = document.getElementById("import"); 
var currentDate = new Date(); /

function importCSV(filepath, callback) { 
    var request = new XMLHttpRequest();
    request.timeout = 10000;
    request.open("GET", filepath, true);
    request.onload = function() {
        if (request.status === 200) { 
            var d = request.response.split('\n'); 
            var i = d.length;
            while (i--) {
                if (d[i] !== "") {
                    d[i] = d[i].split(';');
                } else {
                    d.splice(i, 1);
                }
            }
            if (typeof callback === "function") {
                callback(d); 
            }
        } else {
            console.error("Failed to load CSV file. Status:", request.status);
        }
    };
    request.onerror = function() {
        console.error("Error occurred while loading CSV file.");
    };
    request.send();
}

function exportCSV() {
    if (articles.length < 1) {
        nextItem();
    }
    let out = articles[0];

    for (let i = 1; i < articles.length; i++) {
        out += "\r\n" + articles[i];
    }

    let blob = new Blob([out], { type: 'text/csv;charset=utf-8;' });
    let filename = `PRICAT_${articlesArray[0][1].value}_${currentDate.getFullYear()}${currentDate.getMonth() + 1}${currentDate.getDate()}.txt`; // Fixed month (+1) and filename format

    if (navigator.msSaveBlob) { // For IE
        navigator.msSaveBlob(blob, filename);
    } else {
        let link = document.createElement("a");
        if (link.download !== undefined) { // Feature detection
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

function nextItem() {
    let data = $("#PRICAT input").serializeArray();
    index++;
    articlesArray.push(data);
    console.log(articlesArray[0][1]);

    let out = '"' + data[0].value + '"';
    for (let i = 1; i < data.length; i++) {
        out += ";" + '"' + data[i].value + '"';
    }
    console.log(out);
    articles.push(out);
    clearFields();
}

function prevItem() {
    if (index > 0) { // Ensure index doesn't go below 0
        index--;
        let tmp = articlesArray[index];
        let inputs = $("#PRICAT input");
        for (let i = 0; i < inputs.length; i++) {
            if (tmp[i].checked !== undefined) { // Handle checkboxes
                inputs[i].checked = tmp[i].checked;
            } else {
                inputs[i].value = tmp[i].value;
            }
        }
    }
}

function clearFields() {
    $("#PRICAT input").each(function() {
        if (this.type === "checkbox" || this.type === "radio") {
            this.checked = false;
        } else {
            this.value = "";
        }
    });
}
