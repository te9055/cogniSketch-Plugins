import {registerNodeExecuteCallback} from "/javascripts/interface/callbackFunction.js";
import {getPalette} from "/javascripts/private/state.js";
import {getPosFromNode} from "/javascripts/interface/graphics.js";
import {createNewFullNode, createNewLink} from "/javascripts/private/core/create.js";
import {registerEvents} from "/javascripts/private/util/dom.js";
import {testfun} from '/plugins/neroverall/functions/testF.js';
import {eventSetProperty} from "/javascripts/private/core/core_panes/canvas/events/triggered.js";
import {runNER} from "/plugins/ner/functions/NerFunction.js";


const TYPE_NAME = 'neroverallFunction';

registerNodeExecuteCallback(TYPE_NAME, runNERoverall);

async function runNERoverall(context) {
    try {
        //let nodeElement = document.querySelector(`#${context.node.id}`);
        console.log('runNERoverall context node:',context.node.getData().properties['table'].value);
        let datasetId = context.node.getData().properties['table'].value;
        let pos = getPosFromNode(context.node.getPos(), 9, 10);

        let response = await fetch("http://127.0.0.1:5000/neroverall", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'page': datasetId })
        });

        let dataStr = await response.text();
        let data = JSON.parse(dataStr);
        let result = data.output;

        let title = document.createElement("p");
        title.innerText = "NER";

        window.jsonData = result;
        let table = convToHTML(result);

        document.body.appendChild(title);
        document.body.appendChild(table);

        let tmp = { value: table.outerHTML, type: "normal" };
        let nodeType = getPalette().getItemById('table');

        let desNode = createNewFullNode(nodeType, title.outerHTML, {
            x: pos.x + 250,
            y: pos.y - 50
        }, null, {"table": tmp, "dataset_id": { value: context.node.getPropertyNamed('dataset_id'), type: "normal" }});

        let srcNode = context.node;
        createNewLink(srcNode, desNode);
        window.desNode = desNode;
        window.datasetId = datasetId;

    } catch (err) {
        console.error("Error during runNERoverall:", err);
    }
}



function convToHTML(jsonData) {
    let table = document.createElement("table");
    let cols = ["NER", "Frequency", "Expand"];

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
        let td = document.createElement("td");
        td.innerHTML = `<button class="cs-allow-clicks" onclick="window.handleButtonClick(${index})">Expand</button>`;
        tr.appendChild(td);

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;
}

window.handleButtonClick = function (index) {
    if (window.jsonData) {
        let rowData = window.jsonData[index];
        console.log("Row data:", rowData);


        if (window.desNode) {
            console.log("DesNode:", window.desNode);
            testfun(rowData,datasetId, window.desNode); // Pass desNode to testfun
        } else {
            console.log("desNode is not available yet.");
        }
    }
};















