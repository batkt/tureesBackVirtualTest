const asyncHandler = require("express-async-handler");
const https = require("https");
const fs = require("fs");


exports.tdbcer = asyncHandler(async (req, res, next) => {
    try {
        var xml = `<?xml version="1.0" encoding="UTF-8"?>
            < Document >
            <GrpHdr>
                <MsgId>87fbf20130425/1</MsgId>
                <CreDtTm>2014-10-21T11:16:58</CreDtTm>
                <TxsCd>5003</TxsCd>
                <InitgPty>
                    <Id>
                        <OrgId>
                            <AnyBIC>10</AnyBIC>
                        </OrgId>
                    </Id>
                </InitgPty>
                <Crdtl>
                    <Lang>0</Lang>
                    <LoginID>TDB_TEST</LoginID>
                    <RoleID>3</RoleID>
                    <Pwds>
                        <PwdType>1</PwdType>
                        <Pwd>Test#123</Pwd>
                    </Pwds>
                </Crdtl>
            </GrpHdr>
            <EnqInf>
                <IBAN>400011626</IBAN>
                <Ccy>MNT</Ccy>
            </EnqInf>
        </Document >
            `;
        const options = {
            hostname: '192.168.190.189',
            port: 8080,
            path: '/api/trusted',
            method: 'POST',
            key: fs.readFileSync("./kholbolt/corptdb.key"),
            cert: fs.readFileSync("./kholbolt/corptdb.cer"),
            passphrase: "1234",
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'Content-Length': Buffer.byteLength(xml)
            }
        };
        const req1 = https.request(options, (res1) => {
            console.log('statusCode:', res1.statusCode);
            console.log('headers:', res1.headers);

            res1.on('data', (d) => {
                process.stdout.write(d);
            });
            res.sendStatus(200);
        });

        req1.on('error', (e) => {
            console.error(e);
            throw new Error(e);
        });
        req1.end();
    } catch (error) {
        console.log(error);
        if (next)
            next(error);
    }
});
