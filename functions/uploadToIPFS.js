require("dotenv").config()

const auth =
  "Basic " +
  Buffer.from(process.env.projectId + ":" + process.env.projectSecret).toString(
    "base64"
  )

exports.handler = async function (event, context) {
  const { create } = await import("ipfs-http-client")

  const client = await create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  })

  client
    .add("Hello World")
    .then((res) => {
      console.log("working")
      console.log(res)
    })
    .catch((err) => {
      console.log("error", err)
    })
}
