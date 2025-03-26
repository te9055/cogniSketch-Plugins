import {registerNodeExecuteCallback} from "/javascripts/interface/callbackFunction.js";
import {getPalette} from "/javascripts/private/state.js";
import {getPosFromNode} from "/javascripts/interface/graphics.js";
import {createNewFullNode, createNewLink} from "/javascripts/private/core/create.js";


const TYPE_NAME = 'topicExtractionFunction';

registerNodeExecuteCallback(TYPE_NAME, runTopicExtraction);


async function runTopicExtraction(context) {
    try {
        let pos = getPosFromNode(context.node.getPos(), 9, 10);

        let response = await fetch("http://127.0.0.1:5000/topicExtraction", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'summaries_table': context.node.getPropertyNamed('table') })
        });

        let dataStr = await response.text();
        let data = JSON.parse(dataStr);
        let result = data.output;

        let title = document.createElement("p");
        title.innerText = "Topics";

        let table = convToHTML(result);

        let tmp = { value: table.outerHTML, type: "normal" };
        let nodeType = getPalette().getItemById('table');

        let desNode = createNewFullNode(nodeType, title.outerHTML, {
            x: pos.x + 250,
            y: pos.y - 50
        }, null, {"table": tmp, "dataset_id": { value: context.node.getPropertyNamed('dataset_id'), type: "normal" }});

        let srcNode = context.node;
        createNewLink(srcNode, desNode);
    } catch (err) {
        console.error("Error during Topic Extraction:", err);
    }
}

function convToHTML(jsonData) {
    let table =  document.createElement("table");
    //let cols = Object.keys(jsonData[0]);
    let cols = ["Key Words", "# Documents"];
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

        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    return table;

}
