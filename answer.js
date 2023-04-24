document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("answerButton")
    .addEventListener("click", generateSuggestions);
  async function generateSuggestions() {
    document.getElementById("top").hidden = true;
    document.getElementById("api-key-reset").hidden = true;
    document.getElementById("input_field").hidden = true;
    document.getElementById("answer_field").hidden = false;
    document.getElementById("spin").hidden = false;
    document.getElementById("answerButton").hidden = true;
    document.getElementById("mode").hidden = true;
    const question = document.getElementById("output").value;
    if (question == "No text selected" || question.length == 0) {
      document.getElementById("answerField").innerHTML = "No text selected";
      return;
    }
    const mode = await chrome.storage.session.get("mode");
    if (mode.mode == undefined || mode.mode == "") {
      document.getElementById("answerField").innerHTML = "No mode selected";
      return;
    }

    var urlRegex =
      /(https?:\/\/)?[\w\-~]+(\.[\w\-~]+)+(\/[\w\-~@:%]*)*(#[\w\-]*)?(\?[^\s]*)?/gi;
    chrome.storage.session.get(["key"]).then((result) => {
      const key = result.key;
      if (key) {
        var requestOptions = {
          method: "POST",
          redirect: "follow",
        };
        fetch(
          `http://127.0.0.1:5000/question?key=${key}&question=${question}&model=gpt-4&mode=${mode.mode}`,
          requestOptions
        )
          .then((response) => response.text())
          .catch(
            (e) =>
              (document.getElementById("answerField").innerHTML =
                e + ", server is down or is on a heavy load.")
          )
          .then((result) => {
            document.getElementById("spin").hidden = true;
            if (result == "Bad API Key")
              document.getElementById("answerField").innerHTML =
                "Something went wrong. Please try again later or check your API Key.";
            else {
              answerJson = JSON.parse(result);
              answer = answerJson["response"];
              language = answerJson["language"];
              console.log(answerJson);
              try {
                var urls = answer.match(urlRegex);
                if (urls) {
                  urls.forEach((element) => {
                    console.log(element);
                    if (isNaN(element)) {
                      answer = answer.replace(
                        element,
                        `<a href="${element} target=_blank">${element}</a>`
                      );
                    }
                  });
                }
              } finally {
                document.getElementById("answerField").innerHTML = answer;
                if (language == undefined) {
                  document.getElementById("lang").hidden = true;
                } else {
                  document.getElementById("language").innerHTML = language;
                }
              }
            }
          })
          .catch((error) => console.log("error", error));
      } else {
        document.getElementById("answerField").innerHTML =
          "Please enter an API Key";
        document.getElementById("spin").hidden = true;
      }
    });
  }
});
