const demoUser = {
    id: "demo-user-1",
    name: "Productor Demo",
    phone: "70000000",
    zone: "Montero",
    user_type: "pequeño productor",
    created_at: new Date().toISOString()
};

export class userModel {
    static getUsersModel = async () => {
        return { demoUser };
    };

    static getDemoUserModel = async () => {
        return { demoUser };
    };
}

