import { Request, Response, NextFunction } from "express";

interface Metrics {
    totalRequests: number;
    routes: Record<string, { count: number; totalLatency: number }>;
}

const metrics: Metrics = {
    totalRequests: 0,
    routes: {}
};

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
    const start = process.hrtime();
    metrics.totalRequests++;

    res.on("finish", () => {
        const diff = process.hrtime(start);
        const latencyMs = (diff[0] * 1e9 + diff[1]) / 1e6;

        // Normalize path to avoid high cardinality (remove IDs)
        // Simple heuristic: replace segments that look like UUIDs or methods
        // For this scope, just taking the route path if available, or baseUrl + path
        const routePath = req.route ? req.route.path : req.path;
        const method = req.method;
        const key = `${method} ${routePath}`;

        if (!metrics.routes[key]) {
            metrics.routes[key] = { count: 0, totalLatency: 0 };
        }
        metrics.routes[key].count++;
        metrics.routes[key].totalLatency += latencyMs;
    });

    next();
}

export function metricsHandler(req: Request, res: Response) {
    const summary: any = {
        totalRequests: metrics.totalRequests,
        latency: {}
    };

    for (const [key, data] of Object.entries(metrics.routes)) {
        summary.latency[key] = {
            count: data.count,
            avgMs: Math.round((data.totalLatency / data.count) * 100) / 100
        };
    }

    res.json(summary);
}
