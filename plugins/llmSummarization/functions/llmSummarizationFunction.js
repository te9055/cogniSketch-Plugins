import {registerNodeExecuteCallback} from "/javascripts/interface/callbackFunction.js";
import {getPalette} from "/javascripts/private/state.js";
import {getPosFromNode} from "/javascripts/interface/graphics.js";
import {createNewFullNode, createNewLink} from "/javascripts/private/core/create.js";


const TYPE_NAME = 'llmSummarizationFunction';

registerNodeExecuteCallback(TYPE_NAME, runLLMSummarization);


async function runLLMSummarization(context) {
    try {
        let pos = getPosFromNode(context.node.getPos(), 9, 10);
        let datasetId = context.node.getPropertyNamed('dataset_id');

        let response = await fetch("http://127.0.0.1:5000/llmSummarization", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'dataset_id': datasetId })
        });

        let dataStr = await response.text();
        let data = JSON.parse(dataStr);
        let result = data.output;

        let title = document.createElement("p");
        title.innerText = "Summaries";

        let table = convToHTML(result);

        let tmp = { value: table.outerHTML, type: "normal" };
        let nodeType = getPalette().getItemById('table');

        let desNode = createNewFullNode(nodeType, title.outerHTML, {
            x: pos.x + 250,
            y: pos.y - 50
        }, null, {"table": tmp, "dataset_id": { value: datasetId, type: "normal" }});

        let srcNode = context.node;
        createNewLink(srcNode, desNode);
    } catch (err) {
        console.error("Error during LLM Summarization:", err);
    }
}

function convToHTML(jsonData) {
    let table =  document.createElement("table");
    //let cols = Object.keys(jsonData[0]);
    let cols = ["Title", "Summary"];
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

        let keys = Object.keys(item);
        keys.sort();
        keys.forEach((elem) => {
            let td = document.createElement("td");
            td.innerText = item[elem];
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;

}

