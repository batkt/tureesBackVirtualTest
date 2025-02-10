const asyncHandler = require("express-async-handler");
const got = require('got');
const { URL } = require('url');
const xml2js = require('xml2js')
const instance = got.extend({
    hooks: {
        beforeRequest: [
            options => {
                options.headers['Content-Type'] = "application/json"
                if (options.context && options.context.token) {
                    options.headers['Authorization'] = options.context.token;
                }
            }
        ]
    }
});

exports.tdbcer = asyncHandler(async (req, res, next) => {
    try {
        var xmlObject = req.body
        var builder = new xml2js.Builder({ standalone: false, rootName: "Document" });
        var xmlObject = builder.buildObject(xmlObject);
        console.log("xmlObject", xmlObject);
        var xml = {
            xml: xmlObject
        }
        const objectString = JSON.stringify(xml);
        var url = new URL(process.env.ZEV_TEST_SERVER + ":5000/")
        const response = await instance.post(url, { body: objectString }).catch((err) => {
            console.log("tdbcer error " + err.message);
            throw err;
        });
        console.log("response.body", response.body);
        var parseString = xml2js.parseString;
        parseString(response.body, function (err, result) {
            khariu = JSON.stringify(result);
            res.send(khariu);
        });
    } catch (error) {
        console.log("aldaatai!!");
        console.log(error);
        if (next)
            next(error);
    }
});
