(function () {
  console.log("loading pupup url.");

  const dstId = "__dst_extension__";

  const defaultConfig = {
    status: "enable",
    url: "https://cn.bing.com/dict/search?q=????",
    closeTimeout: "5000",
    height: "500px",
    width: "500px",
    top: "20px",
    right: "10px",
    "border-style": "solid",
    "border-width": "2px 0px 0px 2px",
    "border-color": "#cecece",
    "border-radius": "5px",
    "css-overwrite-div": "",
    "css-overwrite-iframe": "",
    "css-overwrite": "",
  };
  const config = {};

  // Load css style once is enough.
  let loadedCss = false;
  // Register event only once after loaded config.
  let registered = false;
  let lastSelectedStr = "";
  let timeoutHandle;

  browser.storage.onChanged.addListener((change, areaName) => {
    for (let key of Object.keys(change.config.newValue)) {
      config[key] = change.config.newValue[key];
    }
    console.log("Loaded changed popup url config.");
    console.log(config);
    registerEvent();

    // Refresh popup.
    try {
      removeInsertedElem();
      displayResult(lastSelectedStr, true);
    } catch (e) {
      console.log(e);
    }
  });

  retriveConfig();

  function retriveConfig() {
    console.log("Loading popup url config.");

    function onError(error) {
      console.log(`Error: ${error}`);
    }
    function onGot(result) {
      if (
        result &&
        result.config &&
        Object.keys(result.config).length === Object.keys(defaultConfig).length
      ) {
        for (let key of Object.keys(result.config)) {
          config[key] = result.config[key];
        }
        console.log("Loaded popup url config.");
        console.log(config);
        registerEvent();
      } else {
        // Config stored is missing or borken, reintialize config.

        console.log("Config stored is missing or borken, reintialize config.");

        browser.storage.sync.set({ config: defaultConfig });

        return;
      }
    }

    let getting = browser.storage.sync.get("config");
    getting.then(onGot, onError);
  }

  function registerEvent() {
    if (registered === true) return;
    registered = true;

    document.addEventListener("click", triggerPopup);
    document.addEventListener("mousedown", removeInsertedElem);
  }

  function triggerPopup(e) {
    if (config.status === "disable") return;

    console.log("popup url received click event.");

    // Insert the __dst_extension node if we got a text selection.
    var selectedObj = window.getSelection();
    var selectedStr = selectedObj.toString();

    try {
      displayResult(selectedStr, false);

      if (config.closeTimeout !== "0") {
        // Clear previouly setted setTimeout() if there has, clearTimeout() won't throw a error even if timeoutHandle is invalid.
        clearTimeout(timeoutHandle);

        timeoutHandle = setTimeout(removeInsertedElem, parseInt(config.closeTimeout));
      }
    } catch (e) {
      console.log(e);
    }
  }

  function removeInsertedElem() {
    // Deleted the __dst_extension__ node, if inserted previously.
    var insertedElem = document.getElementById(dstId);
    if (insertedElem) {
      insertedElem.remove();
    }
  }

  function displayResult(selectedStr, refreshCss) {
    selectedStr = selectedStr ? selectedStr.trim() : "";
    if (!selectedStr) return;
    lastSelectedStr = selectedStr;

    if (!loadedCss || refreshCss) {
      var newCss = document.createElement("style");
      newCss.textContent = getCss();
      document.head.appendChild(newCss);
      loadedCss = true;
    }

    let computedUrl = config.url.replace("????", selectedStr);

    var newDivElem = document.createElement("div");
    newDivElem.id = dstId;

    var newIframeElem = document.createElement("iframe");
    newIframeElem.src = computedUrl;
    newIframeElem.textContent = "This browse have no iframe support.";

    newDivElem.appendChild(newIframeElem);

    document.body.appendChild(newDivElem);
  }

  function getCss() {
    const dstCss = `

#${dstId} {
  position: fixed;
  height: ${config.height};
  width: ${config.width};
  top: ${config.top};
  right: ${config.right};
  background-color: white;
  z-index: 9999;
  ${config["css-overwrite-div"]}
}

#${dstId} iframe {
  overflow-x: scroll;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  border-style: ${config["border-style"]};
  border-width: ${config["border-width"]};
  border-color: ${config["border-color"]};
  border-radius: ${config["border-radius"]};
  ${config["css-overwrite-iframe"]}
}

${config["css-overwrite"]}

`;

    return dstCss;
  }

  console.log("Loaded popup url.");
})();
