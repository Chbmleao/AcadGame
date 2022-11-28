jest.mock('../../../infrastructure/db');

const DAILY_SCORE_DOMAIN = require('../../../domains/dayScore/dayScoreDomain');
const USER_DOMAIN = require('../../../domains/user/userDomain');

const DAILY_SCORE = require('../../../infrastructure/models/dayScore');
const USER = require('../../../infrastructure/models/user');

describe('User updation', () => {

    const USER_COLLECTION = [{
        nickname: "testUser",
        email: "test@test.com.test",
        password: "test123"
    }, {
        nickname: "testUser1",
        email: "test1@test.com.test",
        password: "test123"
    }, {
        nickname: "testUser2",
        email: "test2@test.com.test",
        password: "test123"
    }, {
        nickname: "testUser3",
        email: "test3@test.com.test",
        password: "test123"
    }];

    const EXERCISE_INFO = {
        numRepetitions: 10,
        numSets: 100,
        isLoad: true
    };

    beforeAll(async () => {
        let id = 1;
        for (const USER_INFO of USER_COLLECTION) {
            await USER_DOMAIN.createUser(USER_INFO);
            for (let exerciseAmount = 0; exerciseAmount < id; exerciseAmount++) {
                await DAILY_SCORE_DOMAIN.createDailyScore(id, [EXERCISE_INFO]);
            }
            id += 1;
        }
    });

    test('Should get all user\'s exercises of the day (GET /api/dailyScores)', async () => {
        const CURR_SCORE = await DAILY_SCORE_DOMAIN.getUserDayScores(4);

        expect(CURR_SCORE.length).toBeGreaterThanOrEqual(4);
    });

    test('Should get every exercise the user made in the week (GET /api/dailyScores/user/last7Days)', async () =>{
        const USER_WEEK_EXERCISES = await DAILY_SCORE_DOMAIN.getLast7DaysScores(3);

        // This is wrong and should be changed. We could start by changing the date column data type to DATEONLY, instead of DATE.
        expect(USER_WEEK_EXERCISES.length).toBe(8);
        for (let weekDay = 0; weekDay < USER_WEEK_EXERCISES.length - 1; weekDay++) {
            expect(USER_WEEK_EXERCISES[weekDay].score).toBe(0);
        }
        expect(USER_WEEK_EXERCISES[7].score).toBe(3000);
    });

    test('Should get the users ordered by their weekly score (GET /api/dailyScores/weekPodium)', async () => {
        const WEEK_PODIUM = await DAILY_SCORE_DOMAIN.getWeekPodium();

        expect(WEEK_PODIUM[0].userId).toBe(4);
        expect(WEEK_PODIUM[0].score).toBe(4000);

        expect(WEEK_PODIUM[WEEK_PODIUM.length - 1].userId).toBe(1);
        expect(WEEK_PODIUM[WEEK_PODIUM.length - 1].score).toBe(1000);
    });

    afterAll(async () => {
        await USER.sync({
            force: true
        });

        await DAILY_SCORE.sync({
            force: true
        });
   });
});