import * as Rx from "rxjs/Rx";
var ajax = Rx.Observable.ajax;
import { ChitChatFactory } from "../ChitChatFactory";
import { apiHeaders } from "./chitchatServiceUtils";
var getConfig = function () { return ChitChatFactory.getInstance().config; };
var authReducer = function () { return ChitChatFactory.getInstance().authStore; };
export function getTeamProfile(token, team_id) {
    return Rx.Observable.ajax({
        url: getConfig().api.user + "/teamProfile?team_id=" + team_id,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    });
}
export function setOrgChartId(token, user, team_id, orgChartId) {
    return Rx.Observable.ajax({
        method: "POST",
        url: getConfig().api.user + "/setOrgChartId",
        body: JSON.stringify({
            user_id: user._id,
            username: user.username,
            team_id: team_id,
            org_chart_id: orgChartId
        }),
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token
        }
    });
}
export function updateTeamProfile(user_id, team_id, profile) {
    return Rx.Observable.ajax({
        method: "POST",
        url: getConfig().api.user + "/teamProfile/" + team_id + "/" + user_id,
        body: JSON.stringify({
            profile: profile
        }),
        headers: apiHeaders()
    });
}
export function fetchUser(username) {
    return ajax({
        method: "GET",
        url: getConfig().api.user + "/?username=" + username,
        headers: apiHeaders()
    });
}
export function suggestUser(username, team_id) {
    return ajax({
        method: "GET",
        url: getConfig().api.user + "/suggest/?username=" + username + "&team_id=" + team_id,
        headers: apiHeaders()
    });
}
