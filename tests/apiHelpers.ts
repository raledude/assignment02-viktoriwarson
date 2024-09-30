import { APIRequestContext } from "playwright";

export interface Reservation {
    id: number;
    created: string;
    client: number;
    room: number;
    bill: number;
    start: string;
    end: string;
}

export class APIHelper {
    private baseUrl: string;
    private username: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;

    }

    async loginRequest(request: APIRequestContext) {
        const loginPost = await request.post(`${this.baseUrl}/login`, {
            data: {
                "username": `${process.env.TEST_USERNAME}`,
                "password": `${process.env.TEST_PASSWORD}`
            }
        });

        const loginData = await loginPost.json();
        this.username = loginData.username;
        this.token = loginData.token;
        return loginPost;
    }

    // Method to get authorization headers with token
    private getAuthHeaders() {
        if (!this.token) {
            throw new Error('Token is not available. Please log in.');
        }

        return {
            'Content-Type': 'application/json',
            'x-user-auth': JSON.stringify(
                {
                    "username": this.username,
                    "token": this.token
                })
        };
    }


    async getAllClients(request: APIRequestContext) {
        const headers = this.getAuthHeaders();
        return await request.get(`${this.baseUrl}/clients`, { headers });
    }


    async createClient(request: APIRequestContext, payload: object) {
        const response = await request.post(`${this.baseUrl}/client/new`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify(
                    {
                        "username": this.username,
                        "token": this.token
                    })
            },
            data: JSON.stringify(payload)
        })
        return response;
    }

    async getAllRooms(request: APIRequestContext) {
        const headers = this.getAuthHeaders();
        return await request.get(`${this.baseUrl}/rooms`, { headers } );
    }

    async createRoom(request: APIRequestContext, payload: object) {
        const headers = this.getAuthHeaders();
        const response = await request.post(`${this.baseUrl}/room/new`, { 
            headers, 
            data: JSON.stringify(payload) }); 
        return response;
    }

    async deleteRoom(request: APIRequestContext, roomID: string) {
        const headers = this.getAuthHeaders();
        const response = await request.delete(`${this.baseUrl}/room/${roomID}`, { headers })
        return response;
    }

    async getRoomByID(request: APIRequestContext, id: string) {
        const headers = this.getAuthHeaders();
        const response = await request.get(`${this.baseUrl}/room/${id}`, { headers })
        return response;
    }

    async editRoom(request: APIRequestContext, payload: object, id: string) {
        const headers = this.getAuthHeaders();
        const response = await request.put(`${this.baseUrl}/room/${id}`, {
            headers, 
            data: JSON.stringify(payload) });
        return response;
    }

    async deleteClient(request: APIRequestContext, roomID: string) {
        const headers = this.getAuthHeaders();
        const response = await request.delete(`${this.baseUrl}/client/${roomID}`, { headers })
        return response;
    }

    async getAllBills(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/bills`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify(
                    {
                        "username": this.username,
                        "token": this.token
                    })
            }
        }
        )
        return response;
    }

    async createBill(request: APIRequestContext, payload: object) {
        const response = await request.post(`${this.baseUrl}/bill/new`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify(
                    {
                        "username": this.username,
                        "token": this.token
                    })
            },
            data: JSON.stringify(payload)
        })
        return response;
    }

    async getAllReservations(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/reservations`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify(
                    {
                        "username": this.username,
                        "token": this.token
                    })
            }
        }
        )
        return response;
    }

    async createReservation(request: APIRequestContext, payload: object) {
        const login = await this.loginRequest(request);
        const response = await request.post(`${this.baseUrl}/reservation/new`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify(
                    {
                        "username": this.username,
                        "token": this.token
                    })
            },
            data: JSON.stringify(payload)
        })
        return response;
    }

    async getDataForReservationsPayload(request: APIRequestContext) {
        // getting the number of rooms, clients and bills and returning it to be used for my payload
        const login = await this.loginRequest(request);

        const getRoomsResponse = await this.getAllRooms(request);
        const allRooms = await getRoomsResponse.json();
        const nrOfRooms = allRooms.length;

        const getClientsResponse = await this.getAllClients(request);
        const allClients = await getClientsResponse.json();
        const nrOfClients = allClients.length;

        const getBillsResponse = await this.getAllBills(request);
        const allBills = await getBillsResponse.json();
        const nrOfBills = allBills.length;

        return {
            nrOfRooms,
            nrOfClients,
            nrOfBills
        }
    }
}


