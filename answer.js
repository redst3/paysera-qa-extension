window.onload = async function () {
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

  document.getElementById("answer").onclick = async () => {
    const question = document.getElementById("output").innerHTML;
    if (question == "No text selected" || question.length == 0)
      document.getElementById("answerField").innerHTML = "No text selected";

    chrome.storage.session.get(["key"]).then((result) => {
      const key = result.key;
      if (key) {
        var requestOptions = {
          method: "POST",
          redirect: "follow",
        };
        fetch(
          `http://localhost:5000/custom?key=${key}&question=${question}`,
          requestOptions
        )
          .then((response) => response.text())
          .then(
            (result) =>
              (document.getElementById("answerField").innerHTML = result)
          )
          .catch((error) => console.log("error", error));
      } else alert("Please enter an API Key");
    });
  };
  document.getElementById("api-key-reset").onclick = async () => {
    chrome.storage.session.set({ key: "" }).then(() => {
      document.getElementById("top").hidden = false;
      document.getElementById("api-key-reset").hidden = true;
    });
  };
};
