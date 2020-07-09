(function () {
  console.log("loading pupup url.");

  const dstUrl = "https://www.bing.com";
  const dstId = "__dst_extension__";

  const defaultConfig = {
    status: "enable",
    url: "aaa",
    url2: "aaa"
  };
  const config = {};

  const dstCss = `
#__dst_extension__ {
  position: fixed;
  height: 500px;
  width: 500px;
  top: 20px;
  right: 10px;
  border-style:solid;
  border-width:5px;
  border-color: #cecece;
  background-color: white;
  z-index: 9999;
}

#__dst_extension__ iframe {
  overflow-x: scroll;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  transform: scale(1, 1);
`;

  // Load css style once is enough.
  let loadedCss = false;
  // Register event only once after loaded config.
  let registered = false;

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
  // This line not working.
  // document.addEventListener("load", retriveConfig);

  browser.storage.onChanged.addListener((change, areaName) => {
    for (let key of Object.keys(change.config.newValue)) {
      config[key] = change.config.newValue[key];
    }
    console.log("Loaded changed popup url config.");
    console.log(config);
    registerEvent();
  });
  retriveConfig();

  function registerEvent () {
    if (registered === true) return
    registered = true

    document.onclick = function (e) {
      if(config.status === "disable") return

      console.log("popup url received click event.");

      // Deleted the __dst_extension__ node, if inserted previously.
      var insertedElem = document.getElementById(dstId);
      if (insertedElem) {
        insertedElem.remove();
      }

      // Insert the __dst_extension node if we got a text selection.
      var selectedObj = window.getSelection();
      var selectedStr = selectedObj.toString();
      selectedStr = selectedStr.trim();
      if (!selectedStr) return;

      queryDict(selectedStr);
    };
  }

  function queryDict(word) {
    fetch(dstUrl, {
      method: "GET",
    })
      .then((response) => response.body)
      .then((stream) => fetchStream(stream))
      .then((result) => displayResult(result))
      .catch((error) => console.error(error));
  }

  function displayResult(result) {
    if (!loadedCss) {
      var newCss = document.createElement("style");
      newCss.innerHTML = dstCss;
      document.head.appendChild(newCss);
      loadedCss = true;
    }

    var newElem = document.createElement("div");
    newElem.innerHTML =
      "<div id='" +
      dstId +
      "'>" +
      "<iframe src='" +
      dstUrl +
      "'" +
      ">" +
      "<p>This browser have no iframe support.<p>";
    "</iframe>" + "</div>";

    document.body.appendChild(newElem);
  }

  console.log("Loaded popup url.");

  // obsolated
  function fetchStream(stream) {
    let chunk = new Uint8Array();
    const reader = stream.getReader();
    return reader.read().then(function processText({ done, value }) {
      if (done) {
        return new TextDecoder("utf-8").decode(chunk);
      }

      chunk = new Uint8Array([...chunk, ...value]);

      return reader.read().then(processText);
    });
  }
})();
