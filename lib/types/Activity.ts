import { ClientActivityType } from "./ActivityType";

export interface DbActivity {
    i: string;
    t: string;
    s: number;
    d: number;
}

export interface ClientActivity {
    id: string;
    type: ClientActivityType;
    start: number;
    duration: number;
}

class Activity {
    static clientToDb(client: ClientActivity): DbActivity {
        return {
            i: client.id,
            t: client.type.id,
            s: client.start,
            d: client.duration,
        };
    }

    static dbToClient(db: DbActivity, types: ClientActivityType[]): ClientActivity {
        const type = types.find(t => t.id === db.t);
        return {
            id: db.i,
            type: type || {
                id: "unknown",
                name: "Unknown",
                category: {
                    id: "unknown",
                    name: "Unknown",
                    class: "",
                    previewClass: "",
                },
            },
            start: db.s,
            duration: db.d,
        };
    }
}

export default Activity;
