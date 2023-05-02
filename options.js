const manifestData = chrome.runtime.getManifest();
const buttonConf = manifestData.background.autoClickButtonConf;
const urlsConf = manifestData.background.autoCloseUrlsConf;

function createCheckboxes() {
  const checkboxList = document.getElementById('checkboxList');
  Object.entries(buttonConf).forEach(([label, value]) => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = value;
    input.name = value;

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', value);
    labelElement.textContent = label;

    checkboxList.appendChild(input);
    checkboxList.appendChild(labelElement);
    checkboxList.appendChild(document.createElement('br'));
  });

  const urlCheckboxList = document.getElementById('urlCheckboxList');
  Object.entries(urlsConf).forEach(([label, value]) => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = value;
    input.name = value;

    const labelElement = document.createElement('label');
    labelElement.setAttribute('for', value);
    labelElement.textContent = label;

    urlCheckboxList.appendChild(input);
    urlCheckboxList.appendChild(labelElement);
    urlCheckboxList.appendChild(document.createElement('br'));
  });
}

function saveOptions() {
  const predefinedSelectors = Object.values(buttonConf).reduce((acc, value) => {
    if (document.getElementById(value).checked) {
      acc.push(value);
    }
    return acc;
  }, []);

  const customSelectors = document.getElementById('customSelectors').value;
  const autoButtonClickSelectors = customSelectors
    ? predefinedSelectors.concat(customSelectors.split(','))
    : predefinedSelectors;

  const predefinedUrls = Object.values(urlsConf).reduce((acc, value) => {
    if (document.getElementById(value).checked) {
      acc.push(value);
    }
    return acc;
  }, []);

  const customUrls = document.getElementById('customUrls').value;
  const autoCloseUrls = customUrls
    ? predefinedUrls.concat(customUrls.split(','))
    : predefinedUrls;

  const opts = { predefinedSelectors, customSelectors, autoButtonClickSelectors, predefinedUrls, customUrls, autoCloseUrls };
  chrome.storage.sync.set(opts, () => {
    alert('Options saved.')
    console.log('Autoclick Buttons: ' + autoButtonClickSelectors);
    console.log('Autoclose Urls: ' + autoCloseUrls);
  });
}

function loadOptions() {
  chrome.storage.sync.get(['predefinedSelectors', 'customSelectors', 'predefinedUrls', 'customUrls'], ({ predefinedSelectors, customSelectors, predefinedUrls, customUrls }) => {
    if (predefinedSelectors) {
      predefinedSelectors.forEach((value) => {
        document.getElementById(value).checked = true;
      });
    }

    if (predefinedUrls) {
      predefinedUrls.forEach((value) => {
        document.getElementById(value).checked = true;
      });
    }

    document.getElementById('customSelectors').value = customSelectors || '';
    document.getElementById('customUrls').value = customUrls || '';
  });
}

createCheckboxes();
document.getElementById('saveButton').addEventListener('click', saveOptions);
loadOptions();

