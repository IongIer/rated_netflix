let key = browser.storage.local.get("apikey");
key.then((result) => {
  if ("apikey" in result) {
    document.getElementById("indicator").style.color = "green";
  } else {
    document.getElementById("indicator").style.color = "red";
  }
});

function storeKey() {
  let apikey = document.getElementById("apikey").value;
  if (apikey !== "") {
    browser.storage.local.set({ apikey: apikey + "&t=" });
    document.getElementById("apikey").value = "";
    document.getElementById("indicator").style.color = "green";
  }
}

document.getElementById("update").addEventListener("click", () => {
  storeKey();
});

document.getElementById("apikey").addEventListener("keypress", (k) => {
  if (k.key === "Enter") {
    storeKey();
  }
});
