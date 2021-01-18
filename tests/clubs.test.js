import 'cross-fetch';
import ApolloBoost, {gql} from 'apollo-boost';
import seedDatabase from './utils/seedDatabase';

const client = new ApolloBoost({
    uri: "http://localhost:400"
});

beforeEach(seedDatabase);

test('should expose clubs', async ()=>{
    const getClubs = gql`
        query{
            clubs{
                id
                title
                body
                published
            }
        }
    `;

    const response = await client.query({query: getClubs});

    expect(response.data.clubs.length).toBe(1);
});
