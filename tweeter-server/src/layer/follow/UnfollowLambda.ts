import { createFollowActionHandler } from "./FollowActionHandler";

export const handler = createFollowActionHandler((service, token, user) =>
    service.unfollow(token, user)
);
