const AWS = require('aws-sdk')

AWS.config.update({
    region: 'ap-south-1'
})

const dynamoDb = AWS.DynamoDB.DocumentClient()
const dynamoDbTableName = 'products'
const healthPath = '/health'
const productPath = '/product'
const productsPath = '/products'

exports.handler = async (event) => {
    console.log('Request Event : ', event)
    let response
    switch (true) {
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = buildResponse(200)
            break;
        case event.httpMethod === 'GET' && event.path === productsPath:
            response = await getAllProducts()
            break;
        case event.httpMethod === 'GET' && event.path === productPath:
            response = await getProduct(event.queryStringParameters.productId)
            break;
        case event.httpMethod === 'POST' && event.path === productPath:
            response = await saveProduct(JSON.parse(event.body))
            break;
        case event.httpMethod === 'PATCH' && event.path === productPath:
            const requestBody = JSON.parse(event.body)
            response = await modifyProduct(requestBody.productId, requestBody.updateKey, requestBody.updateValue)
            break;
        case event.httpMethod === 'DELETE' && event.path === productPath:
            response = await deleteProduct(JSON.parse(event.body).productId)
            break;
        default:
            break;
    }
    return response
}

async function getProduct(productId) {
    const params = {
        TableName: dynamoDbTableName,
        Key: {
            'productId': productId
        }
    }
    return await dynamoDb.get(params).promise().then((response) => {
        return buildResponse(200, response.Item)
    }, (error) => {
        console.error('Error: ', error)
    });
}

async function getAllProducts() {
    const params = {
        TableName: dynamoDbTableName
    }
    const allProducts = await scanDynamoRecords(params, []);
    const body = {
        products: allProducts
    }
    return buildResponse(200, body)
}

async function scanDynamoRecords(scanParams, itemArray) {
    try {
        const dynamoData = await dynamoDb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        if (dynamoData.LastEvaluatedKey) {
            scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
            return await scanDynamoRecords(scanParams, itemArray);
        }
        return itemArray;
    } catch (error) {
        console.error('ERROR: ', error)
    }
}

async function saveProduct(requestBody) {
    const params = {
        TableName: dynamoDbTableName,
        Item: requestBody
    }
    return await dynamoDb.put(params).promise().then(() => {
        const body = {
            Operation: 'SAVE',
            Message: 'SUCCESS',
            Item: requestBody
        }
        return buildResponse(200, body);
    }, (error) => {
        console.error('ERROR: ', error)
    })
}

async function modifyProduct(productId, updateKey, updateValue) {
    const params = {
        TableName: dynamoDbTableName,
        Key: {
            'productId': productId
        },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: {
            ':value': updateValue
        },
        ReturnValues: 'UPDATED_NEW'
    }
    return await dynamoDb.update(params).promise().then((response) => {
        const body = {
            Operation: 'UPDATE',
            Message: 'SUCCESS',
            UpdatedAttributes: response
        }
        return buildResponse(200, body)
    }, (error) => {
        console.error('ERROR: ', error)
    })
}

async function deleteProduct(productId) {
    const params = {
        TableName: dynamoDbTableName,
        Key: {
            'productId': productId
        },
        ReturnValues: 'ALL_OLD'
    }
    return await dynamoDb.delete(params).promise().then((response) => {
        const body = {
            Operation: 'DELETE',
            Message: 'SUCCESS',
            Item: response
        }
        return buildResponse(200, body)
    }, (error) => {
        console.error('ERROR: ', error)
    })
}

function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}