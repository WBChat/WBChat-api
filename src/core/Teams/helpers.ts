import { Team } from "./schemas/team.schema";
import { TeamViewData } from "./types";

export const getTeamViewData = (channel: Team): TeamViewData => ({
    _id: String(channel._id),
    name: channel.name,
  })