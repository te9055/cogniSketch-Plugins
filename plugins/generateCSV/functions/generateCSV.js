import {registerNodeExecuteCallback} from "/javascripts/interface/callbackFunction.js";
import {getPalette} from "/javascripts/private/state.js";
import {getPosFromNode} from "/javascripts/interface/graphics.js";
import {createNewFullNode, createNewLink} from "/javascripts/private/core/create.js";
import {registerEvents} from "/javascripts/private/util/dom.js";
import {eventSetProperty} from "/javascripts/private/core/core_panes/canvas/events/triggered.js";



const TYPE_NAME = 'generateCSV';

registerNodeExecuteCallback(TYPE_NAME, generateCSV);

async function generateCSV(context) {

    const tableString = context.node.getData().properties['table'].value;
    const datasetId = context.node.getData().properties['dataset_id'].value;

    console.log('table string: ',tableString);
    console.log('dataset id: ',datasetId);

    const labelString = context.node.getData().label;


    // Parse the string into a DOM structure
    const parser = new DOMParser();
    const doc = parser.parseFromString(tableString, 'text/html');



    // Find the table within the parsed DOM
    const table = doc.querySelector('table'); // Assuming there's only one table, or refine query using the table's ID if needed

    if (!table) {
        console.error('No table found in the provided string.');
        return;
    }

    const labelDoc = parser.parseFromString(labelString, 'text/html');
    const labelElement = labelDoc.querySelector('p');
    const tableTitle = labelElement ? labelElement.textContent.trim() : 'table_data'; // Default title if parsing fails

    // Format the filename as "datasetId__tableTitle"
    const fileName = `${datasetId}__${tableTitle.replace(/[\s:/\\?%*"<>|]+/g, '_')}`; // Remove invalid characters for a filename


    /*
    // Extract rows and columns from the table
    const rows = Array.from(table.querySelectorAll('tr'));
    const csvData = rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td, th')); // Handle both header (th) and data (td) cells
        return cells.map(cell => `"${cell.textContent.trim()}"`).join(','); // Escape each cell with quotes and join with commas
    }).join('\n'); // Join all rows with new lines

     */

    // Exclude "Expand" column (if it exists):
    // Identify the index of the "Expand" column from the header
    const headerCells = Array.from(table.querySelectorAll('thead th'));
    const expandColumnIndex = headerCells.findIndex(th => th.textContent.trim().toLowerCase() === "expand");

    // Extract rows and columns from the table while excluding the "Expand" column
    const rows = Array.from(table.querySelectorAll('tr'));
    const csvData = rows.map(row => {
        const cells = Array.from(row.querySelectorAll('td, th'));

        // Exclude the "Expand" column by skipping its index
        const filteredCells = cells.filter((_, index) => index !== expandColumnIndex);

        // Escape each cell with quotes and join with commas
        return filteredCells.map(cell => `"${cell.textContent.trim()}"`).join(',');
    }).join('\n'); // Join all rows with new lines

    console.log('csv data: ', csvData);


    // Generate and download the CSV file
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link element to trigger download
    const a = document.createElement('a');
    a.href = url;
    //a.download = 'table_data.csv'; // Provide a filename for the CSV
    a.download = `${fileName}.csv`; // Use the extracted fileName as csv title

    document.body.appendChild(a);
    a.click(); // Trigger the file download
    document.body.removeChild(a); // Clean up the temporary link


}