(function () {
  'use strict';

  function calculateAdminModuleChecksum(xml) {
    const modules = xml.substring(xml.indexOf('</meta>') + 7, xml.indexOf('</CBXAdminConfigurations>'));

    const encoder = new TextEncoder();
    const data = encoder.encode(modules);

    return crypto.subtle.digest('SHA-256', data).then((hash) =>
      Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(''),
    );
  }

  function handleCheckSum() {
    const fileInputEl = document.getElementById('fileInput');
    const file = fileInputEl.files[0];
    const checksumEl = document.getElementById('checksum');

    if (!file) {
      checksumEl.innerHTML = 'Please select a valid XML file.';
      return;
    }

    const reader = new FileReader();

    reader.onload = async function (e) {
      const xmlContent = e.target.result;

      const checksum = await calculateAdminModuleChecksum(xmlContent);
      checksumEl.innerHTML = `<pre>${checksum}</pre>`;
    };

    reader.onerror = function () {
      checksumEl.innerHTML = 'Something went wrong while reading the file.';
    };

    reader.readAsText(file);
  }

  document.getElementById('checkSumButton').addEventListener('click', handleCheckSum);
})();
