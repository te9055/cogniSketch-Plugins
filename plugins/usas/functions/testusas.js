import {getPalette} from "/javascripts/private/state.js";
import {createNewFullNode, createNewLink} from "/javascripts/private/core/create.js";
import {getPosFromNode} from "/javascripts/interface/graphics.js";

export async function testfunusas(rowData,datasetId,nodesrc) {
    console.log('nodesrc usas: ',nodesrc);
    console.log('rowdata usas: ',rowData['0 Tag']);
    let datatopass = rowData['0 Tag']+'__'+datasetId
    let response = await fetch("http://127.0.0.1:5000/usasFine", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'page':datatopass})
    });

    let dataStr = await response.text();
    let data = JSON.parse(dataStr);
    let result = data.output;
    console.log("result usas: ",result);

    let title = document.createElement("p");
    title.innerText = "\"Words tagged with Discourse field "+rowData['0 Tag'];

    //window.jsonData = result;
    let table = convToHTML(result);
    document.body.appendChild(title);
    document.body.appendChild(table);
    //console.log(table);
    let tmp = { value: table.outerHTML, type: "normal" };
    let nodeType = getPalette().getItemById('table');

    let pos = getPosFromNode(nodesrc.getPos(), 9, 10);
    let newnode = createNewFullNode(nodeType, title.outerHTML, {
        x: pos.x + 250,
        y: pos.y - 50

    }, null, {"table": tmp, "dataset_id": { value: nodesrc.getPropertyNamed('dataset_id'), type: "normal" }});

    createNewLink(nodesrc, newnode);
}

function convToHTML(jsonData) {

    let table =  document.createElement("table");


    let cols = ["Word", "Discourse field", "Definition", "Frequency"];

    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    cols.forEach((item) => {
        let th = document.createElement("th");
        th.innerText = item; // Set the column name as the text of the header cell

        tr.appendChild(th); // Append the header cell to the header row

    });

    thead.appendChild(tr); // Append the header row to the header

    table.append(tr); // Append the header to the table
    jsonData.forEach((item) => {
        // Insert text
        let tr = document.createElement("tr");

        // Get the values of the current object in the JSON data
        let vals = Object.values(item);
        vals.forEach((elem) => {
            let td = document.createElement("td");
            td.innerText = elem; // Set the value as the text of the table cell


            tr.appendChild(td);

        });


        table.appendChild(tr);



    });


    return table;

}
