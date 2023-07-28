import axios from "axios";
import ActivityType, { ClientActivityType } from "./types/ActivityType";
import SiteData, { ClientSiteData, DbSiteData } from "./types/SiteData";
import Category, { ClientCategory } from "./types/Category";
import Activity, { ClientActivity } from "./types/Activity";
import Day from "./types/Day";

class Calendar {
    private data: ClientSiteData;

    public onDataUpdated: ((data: ClientSiteData) => void) | null = null;
    public onInfo: ((info: string) => void) | null = null;
    public onError: ((error: string) => void) | null = null;

    private dbUrl: string;

    constructor() {
        this.data = {
            activityTypes: [],
            categories: [],
            days: [],
        };
        this.dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE || "";
    }

    public setFromDb(data: DbSiteData): void {
        this.data = SiteData.dbToClient(data);
        if (this.onDataUpdated) this.onDataUpdated(this.data);
    }

    public async updateCategory(category: ClientCategory): Promise<void> {
        const cache = JSON.stringify(this.data);

        const index = this.data.categories.findIndex(c => c.id === category.id);
        if (index === -1) {
            this.data.categories.push(category);
            if (this.onDataUpdated) this.onDataUpdated(this.data);
            try {
                await axios.put(
                    `${this.dbUrl}/categories/${category.id}.json`,
                    Category.clientToDb(category)
                );
                if (this.onInfo) this.onInfo("New activity category " + category.name + " created");
            } catch (e: any) {
                console.error(e);
                if (this.onError) this.onError("Failed to create new activity category");

                this.data = JSON.parse(cache);
                if (this.onDataUpdated) this.onDataUpdated(this.data);
            }
        } else {
            if (JSON.stringify(this.data.categories[index]) === JSON.stringify(category)) return;

            this.data.activityTypes.forEach(type => {
                if (type.category.id === category.id) type.category = category;
            });
            this.data.days.forEach(day => {
                day.activities.forEach(activity => {
                    if (activity.type.category.id === category.id)
                        activity.type.category = category;
                });
            });
            this.data.categories[index] = category;
            if (this.onDataUpdated) this.onDataUpdated(this.data);
            try {
                await axios.put(
                    `${this.dbUrl}/categories/${category.id}.json`,
                    Category.clientToDb(category)
                );
                if (this.onInfo) this.onInfo("Activity category " + category.name + " updated");
            } catch (e: any) {
                console.error(e);
                if (this.onError) this.onError("Failed to update activity category");

                this.data = JSON.parse(cache);
                if (this.onDataUpdated) this.onDataUpdated(this.data);
            }
        }
    }

    public async updateActivityType(type: ClientActivityType): Promise<void> {
        const cache = JSON.stringify(this.data);

        const index = this.data.activityTypes.findIndex(at => at.id === type.id);
        if (index === -1) {
            this.data.activityTypes.push(type);
            if (this.onDataUpdated) this.onDataUpdated(this.data);
            try {
                await this.updateCategory(type.category);
                await axios.put(
                    `${this.dbUrl}/activityTypes/${type.id}.json`,
                    ActivityType.clientToDb(type)
                );
                if (this.onInfo) this.onInfo("New activity type " + type.name + " created");
            } catch (e: any) {
                console.error(e);
                if (this.onError) this.onError("Failed to create new activity type");

                this.data = JSON.parse(cache);
                if (this.onDataUpdated) this.onDataUpdated(this.data);
            }
        } else {
            if (JSON.stringify(this.data.activityTypes[index]) === JSON.stringify(type)) return;

            this.data.days.forEach(day => {
                day.activities.forEach(activity => {
                    if (activity.type.id === type.id) activity.type = type;
                });
            });
            this.data.activityTypes[index] = type;
            if (this.onDataUpdated) this.onDataUpdated(this.data);
            try {
                await this.updateCategory(type.category);
                await axios.put(
                    `${this.dbUrl}/activityTypes/${type.id}.json`,
                    ActivityType.clientToDb(type)
                );
                if (this.onInfo) this.onInfo("Activity type " + type.name + " updated");
            } catch (e: any) {
                console.error(e);
                if (this.onError) this.onError("Failed to update activity type");

                this.data = JSON.parse(cache);
                if (this.onDataUpdated) this.onDataUpdated(this.data);
            }
        }
    }

    public async updateActivity(date: string, activity: ClientActivity): Promise<void> {
        const cache = JSON.stringify(this.data);

        const dayIndex = this.data.days.findIndex(d => d.date === date);
        if (dayIndex === -1) {
            this.data.days.push({
                date,
                activities: [activity],
            });
            if (this.onDataUpdated) this.onDataUpdated(this.data);
            try {
                await this.updateActivityType(activity.type);
                await axios.put(
                    `${this.dbUrl}/days/${date}.json`,
                    Day.clientToDb({
                        date,
                        activities: [activity],
                    })
                );
                if (this.onInfo) this.onInfo("New day added containing new activity");
            } catch (e: any) {
                console.error(e);
                if (this.onError) this.onError("Failed to create new day containing new activity");

                this.data = JSON.parse(cache);
                if (this.onDataUpdated) this.onDataUpdated(this.data);
            }
        } else {
            const activityIndex = this.data.days[dayIndex].activities.findIndex(
                a => a.id === activity.id
            );

            if (activityIndex === -1) {
                this.data.days[dayIndex].activities.push(activity);
                if (this.onDataUpdated) this.onDataUpdated(this.data);
                try {
                    await this.updateActivityType(activity.type);
                    await axios.put(
                        `${this.dbUrl}/days/${date}/a/${activity.id}.json`,
                        Activity.clientToDb(activity)
                    );
                    if (this.onInfo) this.onInfo("New activity created");
                } catch (e: any) {
                    console.error(e);
                    if (this.onError) this.onError("Failed to create new activity");

                    this.data = JSON.parse(cache);
                    if (this.onDataUpdated) this.onDataUpdated(this.data);
                }
            } else {
                if (
                    JSON.stringify(this.data.days[dayIndex].activities[activityIndex]) ===
                    JSON.stringify(activity)
                )
                    return;

                this.data.days[dayIndex].activities[activityIndex] = activity;
                if (this.onDataUpdated) this.onDataUpdated(this.data);
                try {
                    await this.updateActivityType(activity.type);
                    await axios.put(
                        `${this.dbUrl}/days/${date}/a/${activity.id}.json`,
                        Activity.clientToDb(activity)
                    );
                    if (this.onInfo) this.onInfo("Activity updated");
                } catch (e: any) {
                    console.error(e);
                    if (this.onError) this.onError("Failed to update activity");

                    this.data = JSON.parse(cache);
                    if (this.onDataUpdated) this.onDataUpdated(this.data);
                }
            }
        }
    }

    public async deleteActivity(date: string, activity: ClientActivity): Promise<void> {
        const cache = JSON.stringify(this.data);

        const day = this.data.days.find(d => d.date === date);
        if (!day) {
            if (this.onError) this.onError("Failed to delete activity - day not found");
            return;
        }

        const index = day.activities.findIndex(a => a.id === activity.id);
        if (index === -1) {
            if (this.onError) this.onError("Failed to delete activity - activity not found");
            return;
        }

        day.activities = day.activities.filter(d => d.id !== activity.id);
        if (this.onDataUpdated) this.onDataUpdated(this.data);
        try {
            if(day.activities.length === 0) {
                await axios.delete(`${this.dbUrl}/days/${date}.json`);
            } else {
                await axios.delete(`${this.dbUrl}/days/${date}/a/${activity.id}.json`);
            }
            if (this.onInfo) this.onInfo("Activity deleted");
        } catch (e: any) {
            console.error(e);
            if (this.onError) this.onError("Failed to delete activity");

            this.data = JSON.parse(cache);
            if (this.onDataUpdated) this.onDataUpdated(this.data);
        }
    }
}

export default Calendar;
