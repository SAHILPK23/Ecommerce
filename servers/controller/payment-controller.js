import paytmchecksum from '../paytm/PaytmChecksum.js';
import { paytmParams, paytmMerchantkey } from '../index.js';
import formidable from 'formidable';
import https from 'https';



export const addPaymentGateway = async (request, response) => {
     try {
        const paytmCheckSum = await paytmchecksum.generateSignature(paytmParams, paytmMerchantkey);
       
        const params = {
            ...paytmParams, 'CHECKSUMHASH': paytmCheckSum
        }
        response.status(200).json(params)
    } catch (error) {
        response.status(500).json({error: error.message})
    }
}

export const paymentResponse = (request, response) => {

    const form = new formidable.IncomingForm();
    const paytmCheckSum = request.body.CHECKSUMHASH;
    delete request.body.CHECKSUMHASH;

    const isVerifySignature = paytmchecksum.verifySignature(request.body, paytmMerchantkey, paytmCheckSum);
    if (isVerifySignature) {
        const paytmParams = {};
        paytmParams['MID'] = request.body.MID;
        paytmParams['ORDER_ID'] = request.body.ORDER_ID;

        paytmchecksum.generateSignature(paytmParams, paytmMerchantkey).then(function (checksum) {

            paytmParams['CHECKSUMHASH'] = checksum;

            let post_data = JSON.stringify(paytmParams);

            let options = {
                hostname: 'securegw-stage.paytm.in',
                port:  8443,
                path: '/order/status',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            }

            let res = "";
            const post_req = https.request(options, function (post_res) {
                post_res.on('data', function (chunk) {
                    res += chunk;
                });

                post_res.on('end', function () {
                    let result = JSON.parse(res);
                    console.log(result);
                    response.redirect(`http://localhost:3000/`)
                })
            });
            post_req.write(post_data);
            post_req.end();
        })
    } else {
        console.log("Checksum Mismatched");
    }
}