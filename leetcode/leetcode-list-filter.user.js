// ==UserScript==
// @name         LeetCode Problem List Status Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Click on the status pie/legend to filter the problem list
// @author       mchaitanya
// @match        https://leetcode.com/list*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // CSS
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.appendChild(document.createTextNode(`
    ._cmf {
      margin-left: 8px;
    }
    ._cmf__clear,
    .progress-status .col-xs-4,
    .highcharts-point {
      cursor: pointer;
    }
  `));
    document.head.appendChild(style);


    const SOLVED = 'Solved', ATTEMPTED = 'Attempted', TODO = 'Todo', ALL = 'All';
    function isMatched(e, status) {
        switch (status) {
            case SOLVED:
                return e.querySelector('.fa-check') != null;
            case ATTEMPTED:
                return e.querySelector('.fa-question') != null;
            case TODO:
                return e.querySelector('.fa-check, .fa-question') == null;
            default:
                return true;
        }
    }


    // handle 'filter' event on the document - hide problems that don't match the filter
    document.addEventListener('_cm-filter', function onFilter(ev) {
        const status = ev.detail.status;
        const header = document.querySelector('.list-header-left-pane');
        const oldInfo = header.querySelector('._cmf');
        if (oldInfo) {
            oldInfo.remove();
        }

        if (status !== ALL) {
            const newInfo = document.createElement('h3');
            newInfo.className = 'panel-title _cmf'
            newInfo.innerHTML = `Filter: '${status}' <span class="fa fa-times _cmf__clear"></span>`;
            header.append(newInfo);
        }

        const problems = document.querySelectorAll('.question');
        for (let p of problems) {
            p.hidden = false;
            if (!isMatched(p, status)) {
                p.hidden = true;
            }
        }
    });


    const _classToStatusMap = new Map([
        ['highcharts-color-0', SOLVED],
        ['highcharts-color-1', ATTEMPTED],
        ['highcharts-color-2', TODO]
    ]);


    // emit 'filter' event when a legend item/pie slice is clicked
    document.addEventListener('click', function onClick(ev) {
        let status;
        if (ev.target.classList.contains('_cmf__clear')) {
            status = ALL;
        }

        if (ev.target.matches('.progress-status *')) {
            let item = ev.target.closest('.col-xs-4');
            status = item.lastElementChild.textContent;
        }

        if (ev.target.classList.contains('highcharts-point')) {
            for (let [c, s] of _classToStatusMap.entries()) {
                if (ev.target.classList.contains(c)) {
                    status = s;
                    break;
                }
            }
        }

        if (status != null) {
            document.dispatchEvent(new CustomEvent('_cm-filter', { detail: { status } }));
        }

    });

})();
