require("dotenv").config()

const auth =
  "Basic " +
  Buffer.from(process.env.projectId + ":" + process.env.projectSecret).toString(
    "base64"
  )

exports.handler = async function (event, context) {
  try {
    const { create } = await import("ipfs-http-client")
    const binaryData = Buffer.from(event.body, "base64")

    const client = await create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    })

    try {
      const result = await client.add(binaryData)
      return {
        statusCode: 200,
        body: JSON.stringify({ hash: result.path }),
      }
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Error while creating IPFS client" }),
      }
    }
  } catch (clientError) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error while creating IPFS client" }),
    }
  }
}
