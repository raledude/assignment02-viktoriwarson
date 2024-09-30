import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { APIHelper, Reservation } from './APIhelpers';
import { generateRandomClientPayload, generateRandomRoomPayload, generateRandomRoomPayloadID, generateRandomBillPayload, generateRandomReservationPayload } from './testData';

const BASE_URL = 'http://localhost:3000/api';

test.describe('Test suite backend V1', () => {
  let apiHelper: APIHelper;

  test.beforeAll(async ({ request }) => {
    apiHelper = new APIHelper(BASE_URL);
    const login = await apiHelper.loginRequest(request);
    expect(login.ok()).toBeTruthy();

  })
  test('Test case 01 - Get all clients, GET', async ({ request }) => {

    const getAllClients = await apiHelper.getAllClients(request);
    expect(getAllClients.ok()).toBeTruthy();

  });
  test('Test case 02 - Get all rooms, GET', async ({ request }) => {
    const getAllRooms = await apiHelper.getAllRooms(request);
    expect(getAllRooms.ok()).toBeTruthy();

  });
  test('Test case 03 - create client, POST', async ({ request }) => {
    const payload = generateRandomClientPayload();
    const createPostResponse = await apiHelper.createClient(request, payload);
    expect(createPostResponse.ok()).toBeTruthy();

  });
  test('Test case 04 - create room, POST', async ({ request }) => {
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
    expect(getRoomsResponse.ok()).toBeTruthy();

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
    );

  });
  test('Test case 05 - delete room, DELETE', async ({ request }) => {
    const getRoomsResponse = await apiHelper.getAllRooms(request);
    const allRooms = await getRoomsResponse.json();

    const lastRoomButOneId = allRooms[allRooms.length - 2].id;

    const deleteRoomResponse = await apiHelper.deleteRoom(request, lastRoomButOneId)
    expect(deleteRoomResponse.ok()).toBeTruthy();

    const getRoom = await apiHelper.getRoomByID(request, lastRoomButOneId)
    expect(getRoom.status()).toBe(401);

    // const deletedElementsResponse = await apiHelper.deleteRoom(request, lastRoomButOneId)
    // expect(deletedElementsResponse.status()).toBe(401);

  });
  test('Test case 06 - edit room, PUT', async ({ request }) => {
    const getRoomsResponse = await apiHelper.getAllRooms(request);
    const allRooms = await getRoomsResponse.json();
    
    const lastRoomButOneId = allRooms[allRooms.length -2].id;
    const lastRoomButOneCreated = allRooms[allRooms.length -2].created;
    
    let payload = generateRandomRoomPayloadID(lastRoomButOneId, lastRoomButOneCreated);

    const createPutResponse = await apiHelper.editRoom(request, payload, lastRoomButOneId);
    expect(createPutResponse.ok()).toBeTruthy();

    const getEditedRoomResponse = await apiHelper.getRoomByID(request, lastRoomButOneId);
    expect(getEditedRoomResponse.ok()).toBeTruthy();
    
    const editedRoom = await getEditedRoomResponse.json();
    expect(editedRoom).toMatchObject(payload);

  });

  test('Test case 07 - delete client, DELETE', async ({ request }) => {
    const getClientsResponse = await apiHelper.getAllClients(request);
    const allClients = await getClientsResponse.json();
    const nrOfClients = allClients.length

    const lastClientButOneId = allClients[allClients.length - 2].id;

    const deleteRoomResponse = await apiHelper.deleteClient(request, lastClientButOneId)
    expect(deleteRoomResponse.status()).toBe(200);

    const getClientsResponseAfterDelete = await apiHelper.getAllClients(request);
    expect(getClientsResponseAfterDelete.ok()).toBeTruthy();
    const allClientsAfterDelete = await getClientsResponseAfterDelete.json();
    const nrOfClientsAfterDelete = allClientsAfterDelete.length

    expect(nrOfClients).toBe(nrOfClientsAfterDelete + 1)

  });

  test('Test case 08 - create bill, POST', async ({ request }) => {
    const getBillsResponseBeforeCreate = await apiHelper.getAllBills(request);
    const allBills = await getBillsResponseBeforeCreate.json();
    const nrofBillsBeforeCreate = allBills.length;
    
    
    const payload = generateRandomBillPayload();
    const createPostResponse = await apiHelper.createBill(request, payload);
    expect(createPostResponse.ok()).toBeTruthy();

    const getBillsResponseAfterCreate = await apiHelper.getAllBills(request);
    const allBillsAfterCreate = await getBillsResponseAfterCreate.json();
    const nrofBillsAfterCreate = allBillsAfterCreate.length;

    expect(nrofBillsBeforeCreate).toBe(nrofBillsAfterCreate - 1);


  })

  test('Test case 09 - create reservation, POST', async ({request}) => {
    const getReservationsBeforeCreate = await apiHelper.getAllReservations(request);
    const allReservationsBeforeCreate = await getReservationsBeforeCreate.json();
    const nrOfReservationsBeforeCreate = allReservationsBeforeCreate.length;

    const payload = await generateRandomReservationPayload(request);
    const createPostResponse = await apiHelper.createReservation(request, payload);

    expect(createPostResponse.ok()).toBeTruthy();

    const createdReservation = await createPostResponse.json();
    console.log(createdReservation);

    expect(createdReservation.id).toBeDefined();
    expect(createdReservation).toMatchObject(payload)

    const getReservationsAfterCreate = await apiHelper.getAllReservations(request);
    const allReservationsAfterCreate = await getReservationsAfterCreate.json();
    const nrOfReservationsAfterCreate = allReservationsAfterCreate.length;

    expect(nrOfReservationsBeforeCreate).toBe(nrOfReservationsAfterCreate - 1);

    const newlyCreatedReservationInList = allReservationsAfterCreate.find((reservation: Reservation) => reservation.id === createdReservation.id);
    console.log(newlyCreatedReservationInList)
    expect(newlyCreatedReservationInList).toBeDefined();
    expect(newlyCreatedReservationInList).toMatchObject(payload)



  })
});