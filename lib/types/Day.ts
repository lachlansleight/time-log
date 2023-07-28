import Activity, { ClientActivity, DbActivity } from "./Activity";
import { ClientActivityType } from "./ActivityType";

export interface DbDay {
    d: string;
    a: Record<string, DbActivity>;
}

export interface ClientDay {
    date: string;
    activities: ClientActivity[];
}

class Day {
    static clientToDb(client: ClientDay): DbDay {
        const activities: Record<string, DbActivity> = {};
        client.activities.forEach(
            activity => (activities[activity.id] = Activity.clientToDb(activity))
        );
        return {
            d: client.date,
            a: activities,
        };
    }

    static dbToClient(db: DbDay, types: ClientActivityType[]): ClientDay {
        return {
            date: db.d,
            activities: Object.values(db.a).map(activity => Activity.dbToClient(activity, types)),
        };
    }
}

export default Day;
