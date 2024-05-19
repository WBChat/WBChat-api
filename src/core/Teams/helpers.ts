import { Team } from "./schemas/team.schema";
import { TeamViewData } from "./types";

export const getTeamViewData = (team: Team): TeamViewData => ({
    _id: String(team._id),
    name: team.name,
    owner: String(team.owner_id)
})