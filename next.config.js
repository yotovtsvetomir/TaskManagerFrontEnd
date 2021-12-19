var client_id = "3aAnb4IPrTExKVDR3eypDZQekdIFFxoJCfRy1aMI"
var api = ""
var google_id = "440434576240-3n8r44e5jsgagem9u4jgrpknnfhs7h5k.apps.googleusercontent.com"

if (process.env.NODE_ENV == "production") {
  api = "https://api.mallyotov.com"
}
else {
  api = "http://localhost:8000"
}

module.exports = {
  reactStrictMode: true,
  env: {
    api: api,
    client_id: client_id,
    google_id: google_id
  },
}
