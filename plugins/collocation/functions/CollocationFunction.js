import {registerNodeExecuteCallback} from "/javascripts/interface/callbackFunction.js";
import {getPalette} from "/javascripts/private/state.js";
import {getPosFromNode} from "/javascripts/interface/graphics.js";
import {createNewFullNode, createNewLink} from "/javascripts/private/core/create.js";
//import {testfuncollocation} from "/plugins/collocation/functions/testFcollocation.js";



const TYPE_NAME = 'collocationFunction';

registerNodeExecuteCallback(TYPE_NAME, runCollocation);


async function runCollocation(context) {
    try {
        //let textProperty = 'boo';
        let datasetId = context.node.getData().properties['table'].value;
        let pos = getPosFromNode(context.node.getPos(), 9, 10);

        let response = await fetch("http://127.0.0.1:5000/collocation", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'page': datasetId})
        });

        let dataStr = await response.text();
        let data = JSON.parse(dataStr);
        let result = data.output;

        let title = document.createElement("p");
        title.innerText = "Collocations for the word '部' (department)";

        window.jsonData = result;
        let table = convToHTML(result);

        document.body.appendChild(title);
        document.body.appendChild(table);


        let tmp = { value: table.outerHTML, type: "normal" };
        let nodeType = getPalette().getItemById('table');

        let desNode = createNewFullNode(nodeType, title.outerHTML, {
            x: pos.x + 250,
            y: pos.y - 50
        }, null, { "table": tmp });

        let srcNode = context.node;
        createNewLink(srcNode, desNode);

        window.desNode = desNode;

        //console.log("Node and link created");

    } catch (err) {
        console.error("Error during runCollocation:", err);
    }
}

function convToHTML(jsonData) {

    let table =  document.createElement("table");
    let cols = ["Collocate", "LogRatio","Frequency"];

    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    cols.forEach((item) => {
        let th = document.createElement("th");
        th.innerText = item;
        tr.appendChild(th);
    });

    thead.appendChild(tr);
    table.appendChild(thead);

    let tbody = document.createElement("tbody");

    jsonData.forEach((item, index) => {
        let tr = document.createElement("tr");

        let vals = Object.values(item);
        vals.forEach((elem) => {
            let td = document.createElement("td");
            td.innerText = elem;
            tr.appendChild(td);
        });

        // Add button using innerHTML with globally accessible onclick function
        //let td = document.createElement("td");
        //td.innerHTML = `<button class="cs-allow-clicks" onclick="window.handleButtonClickColloc(${index})">Expand</button>`;
        //tr.appendChild(td);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;


}

/*
window.handleButtonClickColloc = function (index) {
    if (window.jsonData) {
        let rowData = window.jsonData[index];
        console.log("Row data:", rowData);


        if (window.desNode) {
            console.log("DesNode:", window.desNode);
            testfuncollocation(rowData, window.desNode); // Pass desNode to testfun
        } else {
            console.log("desNode is not available yet.");
        }
    }
};
*/