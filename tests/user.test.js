import 'cross-fetch/polyfill';
import ApolloBoost, {gql} from 'apollo-boost';
import prisma from '../src/prisma';
import seedDatabase from '../tests/utils/seedDatabase';

const client = new ApolloBoost({
    uri: "http://localhost:400"
});

// beforeEach runs processes that help set up before running tests
beforeEach(seedDatabase);

// afterEach runs processes that happen after each test case

test('should create new user', async ()=>{
    const createUser = gql`
        mutation{
            createUser(data:{
                name: "Dhruv",
                email: "dhruv@test.com",
                password: "Dhruv123",
                term: "2B",
                program: "CS"
            }){
                token
                user{
                    id
                    name
                }
            }
        }
    `;

    const response = await client.mutate({
        mutation: createUser
    });

    const exists = await prisma.exists({id: response.data.createUser.user.id});
    expect(exists).toBe(true);
});


test('should expose public author profiles', async () => {
    const getUsers = gql `
        query{
            users{
                id
                name
                email
            }
        }
    `;

    const response = await client.query({query: getUsers});

    expect(response.data.users.length).toBe(1);
    expect(response.data.users[0].email).toBe(null);
});


test('should not login with bad credentials', async() => {
    const login = gql`
        mutation {
            login(
                data: {
                    email: "dhruv@dhruv.com",
                    password: "password123"
                }
            ) {
                token
            }
        }
    `;

    await expect(
        client.mutate({mutation: login})
    ).rejects.toThrow();
});