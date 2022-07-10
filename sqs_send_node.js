const AWS = require('aws-sdk')


AWS.config.region = 'ap-south-1'
const SQS = new AWS.SQS({})


function sendMessage() {
    const params = {
        DelaySeconds: 10,
        MessageAttributes: {
            "Title": {
                DataType: "String",
                StringValue: "AWS SQS SEND MESSAGE USING NODE"
            },
            "Author": {
                DataType: "String",
                StringValue: "Soumya Ghosh"
            },
        },
            MessageBody: "This is a piece of important information!",
            QueueUrl: "https://sqs.ap-south-1.amazonaws.com/813823995644/hello-world-sqs"
    }

    SQS.sendMessage(params, (error, response) => {
        if (error) {
            console.log("ERROR: ", error)
        } else {
            console.log("SUCCESS: ", response)
        }
    })
}
sendMessage()