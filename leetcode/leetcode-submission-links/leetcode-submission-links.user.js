// ==UserScript==
// @name         LeetCode Submission Links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Rewrite the submission links.
// @author       mchaitanya
// @match        https://leetcode.com/submissions/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const observer = new MutationObserver(() => {
    if (document.querySelector("table")) {
      // The submission rows
      const rows = document.querySelectorAll("tr");
      // Skip the header row.
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const link = row.querySelector("a");
        const submissionId = link.href.split("detail/")[1];

        const problem = row.cells[1].innerText.replaceAll(/[()]/g, "");
        const problemSlug = problem.toLowerCase().split(" ").join("-");

        // Rewrite the link.
        link.target = "_blank";
        link.href = `https://leetcode.com/problems/${problemSlug}/submissions/${submissionId}`;
      }

      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
})();
