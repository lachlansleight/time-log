import Activity, { ClientActivity, DbActivity } from "./Activity";
import { ClientActivityType } from "./ActivityType";

export interface DbDay {
    d: string;
    a: DbActivity[];
}

export interface ClientDay {
    date: string;
    activities: ClientActivity[];
}

class Day {
    static clientToDb(client: ClientDay): DbDay {
        return {
            d: client.date,
            a: client.activities.map(activity => Activity.clientToDb(activity)),
        };
    }

    static dbToClient(db: DbDay, types: ClientActivityType[]): ClientDay {
        return {
            date: db.d,
            activities: db.a.map(activity => Activity.dbToClient(activity, types)),
        };
    }
}

export default Day;
