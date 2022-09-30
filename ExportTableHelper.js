/**
Released under MIT and CC (https://creativecommons.org/licenses/by/4.0/) licenses
Copyright 2022 Carroll Bradford Inc. [https://dogood.carrollbradford.io/]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/* 
	Vue mixing to export html data tables to CSV
 */

import { installMixin } from './InstallMixin';

/**
 * Export Helper Functions
 * @mixin ExportTableHelper
 *
 */
const ExportTableHelper = {};

// -----------------------------
// METHODS

/**
 * Export current table on view
 * @function $__downloadTable
 * @memberof ExportTableHelper
 * @param {String} table Table ID or class
 * @param {String} filename Name of the file to download
 * @return {Void}
 */
ExportTableHelper.$__downloadTable = function (table, filename) {
    let csv = [];

    if (table) {
        let grid = document.querySelectorAll(table)[0];
        let thead = grid.querySelectorAll('thead tr');
        let tbody = grid.querySelectorAll('tbody tr');

        for (let i = 0; i < thead.length; i++) {
            let row = [];
            let cols = thead[i].querySelectorAll('th');
            if (cols.length > 0) {
                for (let j = 0; j < cols.length; j++) {
                    if (
                        !cols[j].classList.contains('tablesorter-ignoreRow') ||
                        !cols[j].classList.contains('export-ignore-column')
                    ) {
                        row.push(cols[j].textContent.trim());
                    }
                }
                if (row.length > 0) {
                    csv.push(row.join(','));
                }
            }
        }

        for (let i = 0; i < tbody.length; i++) {
            let row = [];
            let cols = tbody[i].querySelectorAll('td');
            for (let j = 0; j < cols.length; j++) {
                if (!cols[j].classList.contains('export-ignore-column')) {
                    var text = '"' + cols[j].textContent + '"';
                    row.push(text);
                }
            }
            if (row.length > 0) {
                csv.push(row.join(','));
            }
        }
    } else {
        Toast.error('No data available for this section');
        return;
    }

    var data = csv.join('\n');
    var csvFile = new Blob([data], { type: 'text/csv' });
    var downloadLink = document.createElement('a');

    downloadLink.download = filename + '.csv';
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    setTimeout(function () {
        window.URL.revokeObjectURL(downloadLink);
    }, 100);

    return;
};

/**
 * Export all the results from this table API point
 * @function $__exportTableData
 * @memberof ExportTableHelper
 * @param {String} route API route to get all results
 * @param {String} filename Name of the file to download
 * @return {Void}
 */
ExportTableHelper.$__exportTableData = function (route, filename) {
    axios.get(route).then((response) => {
        var csvFile = new Blob([response.data], { type: 'text/csv' });
        var downloadLink = document.createElement('a');

        downloadLink.download = filename + '.csv';
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(function () {
            window.URL.revokeObjectURL(downloadLink);
        }, 200);

        return;
    });

    return;
};

/**
 * Export
 */
export default installMixin(ExportTableHelper, 'ExportTableHelper');
