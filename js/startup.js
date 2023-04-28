window.onload = async function () {
  await fetch("http://127.0.0.1:9000/")
    .then(() => {
      document.getElementById("spin-api").hidden = true;
      document.getElementById("top").hidden = false;
      document.getElementById("state").className = "online";
      document.getElementById("state_tag").innerHTML = "ONLINE";

      chrome.storage.session
        .get(["key"])
        .then((result) => {
          if (result.key) {
            document.getElementById("top").hidden = true;
            document.getElementById("answerButton").hidden = false;
            document.getElementById("api-key-reset").hidden = false;
            document.getElementById("mode").hidden = false;
          }
        })
        .catch((e) => {
          console.log(e);
        });
      -chrome.storage.session.get(["mode"]).then((result) => {
        if (result.mode == "normal") {
          document.getElementById("mode-normal").style =
            "background-color: #4CAF50";
        }
        if (result.mode == "knowledge") {
          document.getElementById("mode-knowledge").style =
            "background-color: #4CAF50";
        }
      });
    })
    .catch((e) => {
      console.log(e);
      document.getElementById("spin-api").hidden = true;
      return;
    });

  document.getElementById("api-key-submit").onclick = async () => {
    const apiKey = document.getElementById("key").value;
    if (apiKey.length == 0) {
      alert("API Key cannot be empty");
      return;
    }
    chrome.storage.session.set({ key: apiKey }).then(() => {
      document.getElementById("top").hidden = true;
      document.getElementById("api-key-reset").hidden = false;
      document.getElementById("mode").hidden = false;
      document.getElementById("answerButton").hidden = false;
    });
  };
  document.getElementById("mode-normal").onclick = async () => {
    chrome.storage.session.set({ mode: "normal" }).then(() => {
      document.getElementById("mode-normal").style =
        "background-color: #4CAF50";
      document.getElementById("mode-knowledge").style = "";
    });
  };
  document.getElementById("mode-knowledge").onclick = async () => {
    chrome.storage.session.set({ mode: "knowledge" }).then(() => {
      document.getElementById("mode-knowledge").style =
        "background-color: #4CAF50";
      document.getElementById("mode-normal").style = "";
    });
  };

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  let result;
  try {
    [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        return getSelection().toString();
      },
    });
    if (result.length > 0) document.getElementById("output").innerHTML = result;
    else document.getElementById("output").innerHTML = "No text selected";
  } catch (e) {
    console.log(e);
  }

  document.getElementById("api-key-reset").onclick = async () => {
    chrome.storage.session.set({ key: "", mode: "" }).then(() => {
      document.getElementById("top").hidden = false;
      document.getElementById("api-key-reset").hidden = true;
      document.getElementById("mode").hidden = true;
      document.getElementById("mode-normal").style = "";
      document.getElementById("mode-knowledge").style = "";
      document.getElementById("answerButton").hidden = true;
    });
  };
};
