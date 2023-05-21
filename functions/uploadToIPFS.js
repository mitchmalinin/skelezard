const ipfsClient = require("ipfs-http-client")

const authorization =
  "Basic " +
  Buffer.from(
    process.env.projectId + ":" + proccess.env.projectSecret
  ).toString("base64")

exports.handler = async function (event, context) {
  const ipfs = ipfsClient({
    url: "https://ipfs.infura.io:5001",
    headers: {
      authorization,
    },
  })

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE",
      },
      body: "Method Not Allowed",
    }
  }

  const file = Buffer.from(JSON.parse(event.body).image, "base64")

  let result
  try {
    result = await ipfs.pin.add(file)
  } catch (error) {
    console.error("Error while uploading to IPFS:", error)
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE",
      },
      body: JSON.stringify({ error: "Error while uploading to IPFS" }),
    }
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE",
    },
    body: JSON.stringify({ hash: result.path }),
  }
}
