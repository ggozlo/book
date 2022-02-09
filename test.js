
var request = require('request');

var url = 'http://openapi.price.go.kr/openApiImpl/ProductPriceInfoService/getProductInfoSvc.do';
var queryParams = '?' + encodeURIComponent('serviceKey') + '=서비스키'; /* Service Key*/
queryParams += '&' + encodeURIComponent('goodId') + '=' + encodeURIComponent('335'); /* */

request({
    url: url + queryParams,
    method: 'GET'
}, function (error, response, body) {
    console.log('Status', response.statusCode);
    console.log('Headers', JSON.stringify(response.headers));
    console.log('Reponse received', body);
});