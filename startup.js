window.onload = async function () {
  await fetch("http://localhost:5000/").catch(() => {
    document.getElementById("state").className = "offline";
    document.getElementById("state_tag").innerHTML = "OFFLINE";
  });

  chrome.storage.session.get(["key"]).then((result) => {
    if (result.key) {
      document.getElementById("top").hidden = true;
      document.getElementById("api-key-reset").hidden = false;
    }
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
    chrome.storage.session.set({ key: "" }).then(() => {
      document.getElementById("top").hidden = false;
      document.getElementById("api-key-reset").hidden = true;
    });
  };
};
