import { createCountHandler } from "./CountHandler";

export const handler = createCountHandler((service, token, user) =>
    service.getFolloweeCount(token, user)
);
