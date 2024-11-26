import {registerNodeExecuteCallback} from "/javascripts/interface/callbackFunction.js";
import {getPalette} from "/javascripts/private/state.js";
import {getPosFromNode} from "/javascripts/interface/graphics.js";
import {createNewEmptyNode, createNewLink} from "/javascripts/private/core/create.js";



const TYPE_NAME = 'concordanceFunction';

registerNodeExecuteCallback(TYPE_NAME, runConcrodance);


async function runConcrodance(context) {
    let textProperty = context.node.getPropertyNamed('text');
    let pos = getPosFromNode(context.node.getPos(),9,10);
    await fetch("http://127.0.0.1:5000/concordance", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'page': textProperty})
    }).then(response => response.text())
        .then((dataStr) => {
                let data = JSON.parse(dataStr);
                return data.output;
            }
        ).then(result => {
            let title = document.createElement("p").innerText = "Concordance";
            let tableres = convToHTML(result)
            tableres.prepend(title)
            let nodeType = getPalette().getItemById('text');
            let desNode = createNewEmptyNode(nodeType, tableres.outerHTML, {
                x: pos.x + 250,
                y: pos.y - 50
            })
            let srcNode = context.node
            createNewLink(srcNode, desNode)
        })
}

function convToHTML(jsonData) {

    let table =  document.createElement("table");
    //let cols = Object.keys(jsonData[0]);
    let cols = ["Preceded By", "Term", "Followed By"];

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

        let tr = document.createElement("tr");

        console.log(item);
        // Get the values of the current object in the JSON data
        let vals = Object.values(item);
        console.log(vals);
        vals.forEach((elem) => {
            let td = document.createElement("td");
            td.innerText = elem; // Set the value as the text of the table cell
            tr.appendChild(td);

        });
        table.appendChild(tr)

    });
    return table;

}