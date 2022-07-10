const AWS = require('aws-sdk')


AWS.config.region = 'ap-south-1'
const SQS = new AWS.SQS({})

const params = {
    MaxNumberOfMessages: 10,
    QueueUrl: "QUEUE_URL"
}

SQS.receiveMessage(params, (error, response) => {
    if (error) {
        console.log("ERROR: ", error)
    } else if (response) {
        console.log("SUCCESS: ", response)
    }
})