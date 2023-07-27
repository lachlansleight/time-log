import Category, { ClientCategory } from "./Category";

export interface DbActivityType {
    i: string;
    n: string;
    c: string;
}

export interface ClientActivityType {
    id: string;
    name: string;
    category: ClientCategory;
}

class ActivityType {
    static clientToDb(client: ClientActivityType): DbActivityType {
        return {
            i: client.id,
            n: client.name,
            c: client.category.id,
        };
    }

    static dbToClient(db: DbActivityType, categories: ClientCategory[]): ClientActivityType {
        return {
            id: db.i,
            name: db.n,
            category: categories.find(c => c.id === db.c) || {
                id: db.c,
                name: "Unknown",
                class: "",
                previewClass: "",
            },
        };
    }

    static getDefault(): ClientActivityType {
        return {
            id: "uncategorized",
            name: "Uncategorized",
            category: Category.getDefault(),
        };
    }
}

export default ActivityType;
