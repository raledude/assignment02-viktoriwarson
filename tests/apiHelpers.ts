import { APIRequestContext } from "playwright";

export class APIHelper {
    private baseUrl: string;
    private username: string;
    private token: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;

    }

    async loginRequest(request: APIRequestContext) {
        const loginPost = await request.post(`${this.baseUrl}/login`,
            {
                data: {
                    "username": (`${process.env.TEST_USERNAME}`),
                    "password": (`${process.env.TEST_PASSWORD}`)
                },
            }
        )

        const loginRequest = await loginPost.json();
        this.username = loginRequest.username;
        this.token = loginRequest.token;
        return loginPost
    }


    async getAllClients(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/clients`, {
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
        const response = await request.get(`${this.baseUrl}/rooms`, {
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

    async createRoom(request: APIRequestContext, payload: object) {
        const response = await request.post(`${this.baseUrl}/room/new`, {
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

    async deleteRoom(request: APIRequestContext, roomID: string) {
        const response = await request.delete(`${this.baseUrl}/room/${roomID}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify(
                    {
                        "username": this.username,
                        "token": this.token
                    })
            },

        })
        return response;
    }

    async getRoomByID(request: APIRequestContext, id: string) {
        const response = await request.get(`${this.baseUrl}/room/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify(
                    {
                        "username": this.username,
                        "token": this.token
                    })
            },
        })
        return response;
    }

    async editRoom(request: APIRequestContext, payload: object, id: string) {
        const response = await request.put(`${this.baseUrl}/room/${id}`, {
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

    async deleteClient(request: APIRequestContext, roomID: string){
        const response = await request.delete(`${this.baseUrl}/client/${roomID}`, {
            headers: {
                'Content-Type': 'application/json',
                'x-user-auth': JSON.stringify(
                    {
                        "username": this.username,
                        "token": this.token
                    })
            },
            
        })
        return response;
    }

}
