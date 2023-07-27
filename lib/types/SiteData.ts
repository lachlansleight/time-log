import ActivityType, { ClientActivityType, DbActivityType } from "./ActivityType";
import Category, { DbCategory, ClientCategory } from "./Category";
import Day, { DbDay, ClientDay } from "./Day";

export interface DbSiteData {
    activityTypes: Record<string, DbActivityType>;
    categories: Record<string, DbCategory>;
    days: Record<string, DbDay>;
}

export interface ClientSiteData {
    activityTypes: ClientActivityType[];
    categories: ClientCategory[];
    days: ClientDay[];
}

class SiteData {
    static clientToDb(client: ClientSiteData): DbSiteData {
        const activityTypes: Record<string, DbActivityType> = {};
        client.activityTypes.forEach(
            type => (activityTypes[type.id] = ActivityType.clientToDb(type))
        );
        const categories: Record<string, DbCategory> = {};
        client.categories.forEach(
            category => (categories[category.id] = Category.clientToDb(category))
        );
        const days: Record<string, DbDay> = {};
        client.days.forEach(day => (days[day.date] = Day.clientToDb(day)));

        return {
            activityTypes,
            categories,
            days,
        };
    }

    static dbToClient(db: DbSiteData): ClientSiteData {
        if (!db)
            return {
                activityTypes: [],
                categories: [],
                days: [],
            };

        const categories = db.categories
            ? Object.values(db.categories).map(category => Category.dbToClient(category))
            : [];
        const activityTypes = db.activityTypes
            ? Object.values(db.activityTypes).map(activity =>
                  ActivityType.dbToClient(activity, categories)
              )
            : [];
        const days = db.days
            ? Object.values(db.days).map(day => Day.dbToClient(day, activityTypes))
            : [];
        return {
            activityTypes,
            categories,
            days,
        };
    }
}

export default SiteData;
