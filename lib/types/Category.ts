export interface DbCategory {
    i: string;
    n: string;
    p: string;
    c: string;
}

export interface ClientCategory {
    id: string;
    name: string;
    previewClass: string;
    class: string;
}

class Category {
    static clientToDb(client: ClientCategory): DbCategory {
        return {
            i: client.id,
            n: client.name,
            p: client.previewClass,
            c: client.class,
        };
    }

    static dbToClient(db: DbCategory): ClientCategory {
        return {
            id: db.i,
            name: db.n,
            previewClass: db.p,
            class: db.c,
        };
    }

    static getDefault() {
        return {
            id: "uncategorized",
            name: "Uncategorized",
            previewClass: "bg-neutral-700",
            class: "bg-neutral-700",
        };
    }
}

export default Category;
