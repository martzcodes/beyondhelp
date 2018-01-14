import C from "../Constants";
import MessageService from "./MessageService";
import MonsterData from "../data/MonsterData";
import PlayerData from "../data/PlayerData";

/* global chrome */

class NotificationService {
    static notifyNewMonster(name: string, monster: MonsterData) {
        MessageService.send(C.AddMonsterMessage, {
            notificationid: monster.storageId,
            notification: {
                type: "basic",
                iconUrl: "icon-grey-128.png",
                title: "Beyond Help",
                message: `${name} #${monster.number} added with ${monster.hp}HP`
            }
        });
    }

    static notifyPlayerRoll(name: string, player: PlayerData) {
        MessageService.send(C.PlayerRollMessage, {
            notificationid: monster.storageId,
            notification: {
                type: "basic",
                iconUrl: "icon-grey-128.png",
                title: "Beyond Help",
                message: `${name} #${monster.number} added with ${monster.hp}HP`
            }
        });
    }

    static createNotification(newNotificationId: string, newNotification) {
        chrome.notifications.getAll((notifications) => {
            const notificationIds = Object.keys(notifications);
            if (notificationIds.length >= 3) {
                notificationIds.pop();
                notificationIds.pop();
                notificationIds.forEach(id => chrome.notifications.clear(id, () => { }));
            }
            chrome.notifications.create(newNotificationId, newNotification);
        });
    }

    static clearAll() {
        chrome.notifications.getAll((notifications) => {
            Object.keys(notifications).forEach((id) => {
                if (id && id.startsWith("bh-")) chrome.notifications.clear(id, () => { });
            });
        });
    }
}

export default NotificationService;