const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('https://corestack.app/mmcp/api/v1/ecommerce/products/list', {
      params: {
        storeCode: 'STO4122',
        entityCode: 'FTD',
        name: '',
        category: '',
        tag: '',
        pageNumber: 1,
        pageSize: 50
      },
      headers: {
        'x-source-code': 'FORTITUDE',
        'x-client-id': 'TST03054745785188010772',
        'x-client-secret': 'TST03722175625334233555707073458615741827171811840881'
      }
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
test();
