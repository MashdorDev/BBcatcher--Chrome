// // Put all the javascript code here, that you want to execute in background.
// console.log("Hello from your Chrome extension! - Background script");


// let redirectURL = identity.getRedirectURL()
// console.log(redirectURL);

// browser.identity.launchWebAuthFlow({
//     url: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=' + encodeURIComponent(redirectURL) + '&response_type=token&scope=https://www.googleapis.com/auth/calendar',
//     interactive: true
// }).then(function(redirectURL) {
//     let params = new URLSearchParams(new URL(redirectURL).hash.substr(1))
//     let accessToken = params.get('access_token')
//     let tokenType = params.get('token_type')
//     let expiresIn = params.get('expires_in')
//     let idToken = params.get('id_token')
//     let refreshToken = params.get('refresh_token')
//     let scope = params.get('scope')
//     let error = params.get('error')
//     let errorDescription = params.get('error_description')
//     // Use the access token to access the Google API.
//     // ...
//     // You can also pass the token to the browser.tabs.executeScript() API
//     // to make it available to the content scripts.
//     // ...
// }).catch(function(error) {
//     // The user closed the sign-in flow without completing it.
//     // ...
// });





//     // Path: manifest.json
// // Path: content_script.js
// // Put all the javascript code here, that you want to execute after page load.
// // console.log("Hello from your Chrome extension! - Content script");

// // console.log(document.documentElement.outerHTML);
