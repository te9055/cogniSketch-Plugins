/**
 * @file The client-side capabilities of the 'example' palette function.
 * @author Dave Braines
 * @status In-progress
 **/

import {registerNodeExecuteCallback} from "/javascripts/interface/callbackFunction.js";
import {
    getProject,
    setSessionValue
} from "/javascripts/interface/data.js";
import {switchToPane} from "/javascripts/interface/ui.js";
import {httpGet} from "/javascripts/interface/http.js";
import {getPalette} from "/javascripts/private/state.js";
import {showToast} from "/javascripts/interface/log.js";
import {getPosFromNode} from "/javascripts/interface/graphics.js";
import {computeNewNodePosFrom} from "/javascripts/private/util/coords.js";
import {createNewEmptyNode} from "/javascripts/private/core/create.js";
import {putText} from "/javascripts/interface/graphics.js"



const TYPE_NAME = 'nerFunction';
const URL_EXAMPLE = '/ner/';

registerNodeExecuteCallback(TYPE_NAME, runExample);

//async function runExample(context) {
//    if (context.node.getTypeName() === 'text') {
//        let labelText = context.node.getLabel();
//        let textProperty = context.node.getPropertyNamed('text');
//        let pos = getPosFromNode(context.node.getPos(),9,10);
//        let data = await getNerForText(textProperty);



//        callbackRunExample(pos,data)
//        //setSessionValue('exampleNode', data);

//    } else {
//        showToast('Needs to be dropped on a text node');
//    }
//}

async function runExample(context) {
    let textProperty = context.node.getPropertyNamed('text');
    let pos = getPosFromNode(context.node.getPos(),9,10);
    await fetch("http://127.0.0.1:5000/ner", {
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
            let tableres = convToHTML(result)
            console.log(result)
            //let strresult = JSON.stringify(result);
            let nodeType = getPalette().getItemById('text');
            console.log(nodeType)
            createNewEmptyNode(nodeType, tableres.outerHTML, pos)
            })
}

function convToHTML(jsonData) {
    let table =  document.createElement("table");
    let cols = Object.keys(jsonData[0]);
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");

    cols.forEach((item) => {
        let th = document.createElement("th");
        th.innerText = item; // Set the column name as the text of the header cell
        tr.appendChild(th); // Append the header cell to the header row

    });

    thead.appendChild(tr); // Append the header row to the header
    table.append(tr) // Append the header to the table
    jsonData.forEach((item) => {
        let tr = document.createElement("tr");

        // Get the values of the current object in the JSON data
        let vals = Object.values(item);
        vals.forEach((elem) => {
            let td = document.createElement("td");
            td.innerText = elem; // Set the value as the text of the table cell
            tr.appendChild(td);

        });
        table.appendChild(tr)

    });
    return table;

}


function getNerForText(text) {
    fetch("http://127.0.0.1:5000/ner", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'page': text})
    }).then(response => response.text())
        .then((dataStr) => {
                let data = JSON.parse(dataStr);
                console.log(data.output)
                return data.output;
            }
        )
    return "No Result Found";
}



function callbackRunExample(pos,res) {

    //let pos = getPosFromMousePos();
    let strresult = JSON.stringify(res);
    let nodeType = getPalette().getItemById('text');
    createNewEmptyNode(nodeType, strresult, pos)

    //setSessionValue('exampleNode', res);

}

