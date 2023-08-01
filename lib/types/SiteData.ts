import { DbActivity } from "./Activity";
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

    /** Removes all human-readable data from the calendar (activity type names, category names, activity notes) */
    static obscureDbData(data: DbSiteData, showCategoryNames = false): DbSiteData {
        const newData: DbSiteData = {
            activityTypes: {},
            categories: {},
            days: {},
        };
        if (!data) return newData;
        const clientData = SiteData.dbToClient(data);
        Object.keys(data.categories).forEach(
            categoryId =>
                (newData.categories[categoryId] = { ...data.categories[categoryId], n: "" })
        );
        Object.keys(data.activityTypes).forEach(
            typeId =>
                (newData.activityTypes[typeId] = {
                    ...data.activityTypes[typeId],
                    n: !showCategoryNames
                        ? ""
                        : clientData.categories.find(c => c.id === data.activityTypes[typeId].c)
                              ?.name || "",
                })
        );
        Object.keys(data.days).forEach(date => {
            const activities: Record<string, DbActivity> = {};
            Object.keys(data.days[date].a).forEach(
                activityId => (activities[activityId] = { ...data.days[date].a[activityId], n: "" })
            );
            newData.days[date] = { ...data.days[date], a: activities };
        });
        return newData;
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
