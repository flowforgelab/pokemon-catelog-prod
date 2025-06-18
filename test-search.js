const axios = require('axios');

async function testSearch() {
  const query = `
    query SearchCards($input: SearchInput!) {
      searchCards(input: $input) {
        total
        cards {
          id
          name
        }
      }
    }
  `;

  const variables = {
    input: {
      query: "Pikachu",
      page: 1,
      limit: 5
    }
  };

  try {
    console.log('Sending request with variables:', JSON.stringify(variables, null, 2));
    
    const response = await axios.post('http://localhost:3001/graphql', {
      query,
      variables
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testSearch();