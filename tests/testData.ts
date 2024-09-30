import { faker } from "@faker-js/faker";
import { APIHelper } from './APIhelpers';
import { APIRequestContext } from 'playwright';


const BASE_URL = 'http://localhost:3000/api';
let apiHelper: APIHelper;

apiHelper = new APIHelper(BASE_URL);


export const generateRandomClientPayload = () => {
    return {
        name: faker.person.fullName(),
        email: faker.internet.exampleEmail(),
        telephone: faker.phone.number()
    }
}

export const generateRandomRoomPayload = () => {
    let category = ['single', 'double', 'twin']
    let features = ['ensuite', 'sea_view', 'penthouse', 'balcony']

    return {
        available: faker.datatype.boolean(),
        category: faker.helpers.arrayElement(category),
        features: faker.helpers.arrayElements(features),
        floor: faker.number.int({ min: 1, max: 20}),
        number: faker.number.int({ min: 1, max: 300}),
        price: faker.number.int({ min: 1000, max: 10000})
    }
}

export const generateRandomRoomPayloadID = (id: string, created: string) => {
    let category = ['single', 'double', 'twin']
    let features = ['ensuite', 'sea_view', 'penthouse', 'balcony']

    return {
        id: id,
        created: created,
        available: faker.datatype.boolean(),
        category: faker.helpers.arrayElement(category),
        features: faker.helpers.arrayElements(features),
        floor: faker.number.int({ min: 1, max: 20}),
        number: faker.number.int({ min: 1, max: 300}),
        price: faker.number.int({ min: 1000, max: 10000})
    }
}

export const generateRandomBillPayload = () => {
    return {
        value: faker.number.int({ min: 1000, max: 10000}),
        paid: faker.datatype.boolean()
    }
}

export const generateRandomReservationPayload = async (request: APIRequestContext) => {
    const reservationsData = await apiHelper.getDataForReservationsPayload(request);
    console.log(reservationsData)
    
    return {
        client: faker.number.int({min: 0, max: reservationsData.nrOfClients}),
        room: faker.number.int({min: 0, max: reservationsData.nrOfRooms}),
        bill: faker.number.int({min: 0, max: reservationsData.nrOfBills}),
        start: faker.date.recent({ days: 20, refDate: '2024-05-15' }).toLocaleDateString(),
        end: faker.date.recent({ refDate: '2024-05-18' }).toLocaleDateString()
    }
}