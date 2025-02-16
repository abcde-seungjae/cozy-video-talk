chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === "loginWithGoogle") {
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      console.log(token);
      return token;
    });
  }
});
