const AWS = require('aws-sdk')


AWS.config.region = 'ap-south-1'
const SQS = new AWS.SQS({})

const params = {
    MaxNumberOfMessages: 10,
    QueueUrl: "https://sqs.ap-south-1.amazonaws.com/813823995644/hello-world-sqs"
}

SQS.receiveMessage(params, (error, response) => {
    if (error) {
        console.log("ERROR: ", error)
    } else if (response) {
        console.log("SUCCESS: ", response)
    }
})