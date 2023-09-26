// Load existing API key from storage
document.addEventListener("DOMContentLoaded", function() {
    browser.storage.local.get("API_KEY", function(result) {
      document.getElementById("apiKey").value = result.API_KEY || "";
    });
  });

  // Save API key to storage
  document.getElementById("saveButton").addEventListener("click", function() {
    const apiKey = document.getElementById("apiKey").value;
    browser.storage.local.set({ "API_KEY": apiKey }, function() {
      alert("API Key saved.");
    });
  });
