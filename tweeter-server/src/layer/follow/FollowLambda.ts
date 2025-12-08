import { createFollowActionHandler } from "./FollowActionHandler";

export const handler = createFollowActionHandler((service, token, user) =>
    service.follow(token, user)
);
