import { Router } from "express";
import { eventQueryRepo } from "./query";

const router = Router();

router.get("/v1/events", (req, res) => {
    try {
        const {
            edgeId,
            kind,
            hash,
            outboxId,
            fromReceivedAt,
            toReceivedAt,
            limit,
            offset
        } = req.query;

        const filters = {
            edgeId: edgeId ? String(edgeId) : undefined,
            kind: kind ? String(kind) : undefined,
            hash: hash ? String(hash) : undefined,
            outboxId: outboxId ? String(outboxId) : undefined,
            fromReceivedAt: fromReceivedAt ? String(fromReceivedAt) : undefined,
            toReceivedAt: toReceivedAt ? String(toReceivedAt) : undefined,
            limit: limit ? Number(limit) : 50,
            offset: offset ? Number(offset) : 0
        };

        const data = eventQueryRepo.find(filters);
        const count = eventQueryRepo.count(filters);

        res.json({
            data,
            meta: {
                total: count,
                limit: filters.limit,
                offset: filters.offset
            }
        });
    } catch (err: any) {
        console.error("Query Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/v1/events/:outboxId", (req, res) => {
    try {
        const row = eventQueryRepo.getByOutboxId(req.params.outboxId);
        if (!row) {
            return res.status(404).json({ error: "Not Found" });
        }
        res.json(row);
    } catch (err: any) {
        console.error("Query Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/v1/events/hash/:hash", (req, res) => {
    try {
        const row = eventQueryRepo.getByHash(req.params.hash);
        if (!row) {
            return res.status(404).json({ error: "Not Found" });
        }
        res.json(row);
    } catch (err: any) {
        console.error("Query Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export const eventRoutes = router;
