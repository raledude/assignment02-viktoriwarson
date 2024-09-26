import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { APIHelper } from './APIhelpers';
import { generateRandomClientPayload, generateRandomRoomPayload } from './testData';

const BASE_URL = 'http://localhost:3000/api';

test.describe('Test suite backend V1', () => {
  let apiHelper: APIHelper;

  test.beforeAll(async ({request}) => {
    apiHelper = new APIHelper(BASE_URL);
    const login = await apiHelper.loginRequest(request);
    expect(login.status()).toBe(200);

  })
  test('Test case 01 - Get all clients', async ({ request }) => {

    const getAllClients = await apiHelper.getAllClients(request);
    expect(getAllClients.ok()).toBeTruthy();
  });
  test('Test case 02 - Get all rooms', async ({ request }) => {
    const getAllRooms = await apiHelper.getAllRooms(request);
    expect(getAllRooms.ok()).toBeTruthy();

    
  });
  test('Test case 03 - create post client', async ({ request }) => {
    const payload = generateRandomClientPayload();
    const createPostResponse = await apiHelper.createClient(request, payload);
    expect(createPostResponse.ok()).toBeTruthy();

  })
  test('Test case 04 - create post room', async ({ request }) => {
    const payload = generateRandomRoomPayload();
    const createPostResponse = await apiHelper.createRoom(request, payload);
    expect(createPostResponse.ok()).toBeTruthy();

    expect(await createPostResponse.json()).toMatchObject(
      expect.objectContaining({
        available: payload.available,
        category: payload.category,
        features: payload.features,
        floor: payload.floor,
        number: payload.number,
        price: payload.price
      })
    );
    const getRoomsResponse = await apiHelper.getAllRooms(request)
    expect (getRoomsResponse.ok()).toBeTruthy();
    
    const allRooms = await getRoomsResponse.json();
    expect(allRooms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          available: payload.available,
          category: payload.category,
          features: payload.features,
          floor: payload.floor,
          number: payload.number,
          price: payload.price
        })
      ])
    )
  });
});