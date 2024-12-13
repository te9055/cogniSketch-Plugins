import {registerNodeExecuteCallback} from "/javascripts/interface/callbackFunction.js";
import {getPalette} from "/javascripts/private/state.js";
import {getPosFromNode} from "/javascripts/interface/graphics.js";
import {createNewEmptyNode, createNewLink} from "/javascripts/private/core/create.js";
import {registerEvents,createButton,registerClickEvent} from "/javascripts/private/util/dom.js";
//import * as events from "node:events";



const TYPE_NAME = 'neroverallFunction';

registerNodeExecuteCallback(TYPE_NAME, runNERoverall);


async function runNERoverall(context) {
    //let textProperty = context.node.getPropertyNamed('text');
    let textProperty = 'boo';
    let pos = getPosFromNode(context.node.getPos(),9,10);
    await fetch("http://127.0.0.1:5000/neroverall", {
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
            let title = document.createElement("p").innerText = "NER";
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
    let cols = ["Doc Id", "NER", "Frequency","Action"];

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
            //let btn = document.createElement("BUTTON"); // Create a <button> element
            //btn.innerHTML = "CLICK ME"; // Insert text
            let td = document.createElement("td");
            td.innerText = elem; // Set the value as the text of the table cell
            //td.appendChild(btn);

            tr.appendChild(td);

        });

        table.appendChild(tr)



    });
    //console.log(table)
    let tablerows = table.rows
    for (var i = 1; i < tablerows.length; i++) {
        let row = tablerows[i]
        var x = row.insertCell(-1)

       // x.innerHTML = "<button onclick="+show();+">HERE</button>"
       // x.innerHTML = "<button>HERE</button>"
        x.innerHTML = "<button class='btn btn-primary'  onClick='{() => {console.log(x))})}>HERE</button>"

        //console.log(x)
        //var button = document.getElementById('1');
        //console.log(button)
        //button.addEventListener("click", () => {
        //    alert('clicked');
        //});


    }


    return table;

}


