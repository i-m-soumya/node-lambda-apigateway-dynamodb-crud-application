const AWS = require('aws-sdk')


AWS.config.region = 'ap-south-1'
const SQS = new AWS.SQS({})

var params = {
    QueueUrl: 'https://sqs.ap-south-1.amazonaws.com/813823995644/hello-world-sqs',
    ReceiptHandle: 'AQEBtKCpB6MNfvOFaZLTcfMrSrsxdLSmHrfKJd7NARkUSNoe81pSb2AjNiOAgTv5xyTrVMF/kY6cbsEZarbzwwKdD+LeL0B+I7nMn42fASVIlA/mk3KCQY5vlpMkEsBfs4wm8AluDFIX8PAPOCS78kN2094A0HjxUfzZLZ8wOFhPqohXdl/60t7JPNvUSK84F7/sHA9RDFyTRIkqT0Qlm+R1tdVqjbHp3IS7SyqYzNsw62FHX7TAjp/8E3yJVUaK6suZduJv2K1DC4gxq3hZh3mzox4lfdhOVLyTOHMDV00yyVQbGgX46JcX1Qan72tHSN+coLwtJNOnC8nW+yHT6In62RjD5WN4PyJ3GH86F74JkBdO4b/WtIU0esOPOl932x6AsdnY5UsV9hi/RYBazpUqAA=='
}
SQS.deleteMessage(params, function (error, response) {
    if (error) {
        console.log("SUCCESS: ", error)
    } else {
        console.log("SUCCESS: ", response)
    }
})