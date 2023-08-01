import { NextApiRequest, NextApiResponse } from "next";
import { NextRestApiRoute } from "lib/NextRestApiRoute";
import SiteData, { DbSiteData } from "lib/types/SiteData";
import { Database } from "lib/firebaseRtdbCrud";

const api = new NextRestApiRoute("/calendar");

api.get = async (req, res) => {
    try {
        const token = await Database.getIdToken(process.env.FB_EMAIL, process.env.FB_PASSWORD);
        const rawData: DbSiteData = await Database.get("/", token);
        const obscureData = SiteData.obscureDbData(rawData);
        res.json(obscureData);
    } catch (e: any) {
        console.error(e.message);
    }
};

export default (req: NextApiRequest, res: NextApiResponse) => api.handle(req, res);
