var fields = Array.from(document.getElementsByTagName("input"));
var Articles = new Array();
var Articles_Array = new Array();
var index = 0;
var input_CSV = document.getElementById("import");

function importCSV()
{
	this.request = new XMLHttpRequest();
	this.request.timeout = 10000;
	this.request.open("GET", filepath, true);
	this.request.parent = this;
	this.callback = callback;
	this.request.onload = function() 
	{
		var d = this.response.split('\n'); /*1st separator*/
		var i = d.length;
		while(i--)
		{
			if(d[i] !== "")
				d[i] = d[i].split(';'); /*2nd separator*/
			else
				d.splice(i,1);
		}
		this.parent.response = d;
		if(typeof this.parent.callback !== "undefined")
			this.parent.callback(d);
	};
	this.request.send();
}

function exportCSV()
{	

	if(Articles.length < 1){
		nextItem();
	}
	let out = Articles[0];

	for (let i = 1; i < Articles.length; i++) {
		out += "\r\n" + Articles[i];
	}

	let blob = new Blob([out], { type: 'text/csv;charset=utf-8;'});
	if (navigator.msSaveBlob) {
		navigator.msSaveBlob(blob, Articles_Array[0][1].value + "_.txt");
	} else {
		let link = document.createElement("a");
		if (link.download !== undefined) { // feature detection
			let url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", Articles_Array[0][1].value + "_.txt");
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
		}
	}   
}    


function nextItem()
{
	
	let data = $("#PRICAT input").serializeArray();
	index ++;
	Articles_Array.push(data);
	console.log(Articles_Array[0][1]);
		let out = '"' + data[0].value + '"';
	
		for (let i = 1; i < data.length; i++) {
			out += ";" + '"' + data[i].value + '"';
		}
		console.log(out);
	Articles.push(out);
	clearFields();
}

function prevItem()
{
	index--;
	let tmp =  Articles_Array[index];
	let inputs = $("#PRICAT input");
	for(let i = 0; i <  $("#PRICAT input").length; i++){
		if(tmp[i].checked == true){
			inputs[i].checked = true;
		}else if(tmp[i].checked == false){
			inputs[i].checked = true;
		}else{
		inputs[i].value = tmp[i].value;
		}
	}
}

function clearFields()
{
	for(x of $("#PRICAT input")){
		 x.value = null;
		}
}