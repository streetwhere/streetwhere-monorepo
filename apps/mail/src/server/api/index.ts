import { Router } from "express";
import { imap } from "../main.ts";

export const api = Router();

api.get("/imap/connected", (req, res) => {
	res.jsonp(imap.isConnected());
});
