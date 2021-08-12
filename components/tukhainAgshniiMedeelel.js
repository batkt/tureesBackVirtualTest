const Zakhialga = require("../models/zakhialga");
async function toololt(io, baiguullagiinId, ajiltniiId) {
    let query = [
        {
            $match: {
                'baiguullagiinId': baiguullagiinId
            }
        }, {
            $project: {
                'ajiltniiId': 1,
                'tuluv': 1
            }
        }, {
            $group: {
                '_id': {
                    'tuluv': '$tuluv',
                    'ajiltniiId': '$ajiltniiId'
                },
                'count': {
                    $sum: 1
                }
            }
        }
    ]
    if (ajiltniiId)
        query[0]['$match']['ajiltniiId'] = { "ajiltniiId": ajiltniiId }
    try {
        Zakhialga.aggregate(query).then((result) => {
            io.emit("baiguullaga" + baiguullagiinId, result);
        }).catch((err) => {
            console.log(err)
        });
    } catch (error) {
        console.log(err)
    }
}
module.exports = { toololt }