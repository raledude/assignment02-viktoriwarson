import { faker } from "@faker-js/faker";

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