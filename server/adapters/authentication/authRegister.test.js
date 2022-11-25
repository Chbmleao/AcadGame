jest.mock('../../infrastructure/db');

const AUTH_DOMAIN = require('../../domains/authentication/authDomain');
const USER = require('../../infrastructure/models/user');

const jwt = require('jsonwebtoken');

const TOKEN_VALIDATOR = (TOKEN) => {
    let isValid = true;

    if(!TOKEN)
        return !isValid;

    jwt.verify(TOKEN, process.env.TEST_JWT_SECRET, (err, decoded) => {
        if(err)
            return !isValid;
    });

    return isValid;
};

describe('User creation tests', () => {

    beforeAll(async () => {
        await USER.sync({
            force: true
        });
    });

    test('Should create user (POST /api/auth/register)', async () => {
        const TOKEN = await AUTH_DOMAIN.registerUser({
            nickname: "pedro123",
            email: "pedro123@p.com",
            password: "123123"
        });

        const SUCCESS = TOKEN_VALIDATOR(TOKEN);

        expect(SUCCESS).toBeTruthy();
    });
});