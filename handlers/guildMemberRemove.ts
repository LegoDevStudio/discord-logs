import { Client, GuildMember} from 'discord.js';

/**
 * @handler Guild Member Leave Events
 * @related guildMemberRemove
 */
 export async function handleGuildMemberRemoveEvent(client: Client, member: GuildMember) {
    let emitted = false;
    
    
    /**
     * @event guildMemberKicked
     * @description Emitted when a member was kicked.
     * @param {DJS:GuildMember} member The member who was kicked.
     * @param {String} reason The reason for the kick.
     * @param {DJS:User} moderator The moderator who kicked the member.
     * @example
     * client.on("guildMemberKicked", (member, reason, moderator) => {
     *   console.log(member.user.tag+" has been kicked from "+member.guild.name+"...");
     * });
     */
    member.guild.fetchAuditLogs({"limit":1,"type":20}).then(logs => { // 20 = KICK
        console.log(logs.entries.array());
        if(logs.entries.size >= 1) {
            let auditLog = logs.entries.first();
            console.log(auditLog);
            if(auditLog.target.id == member.user.id) { // To prevent false positives.
                Client.emit("guildMemberKicked", member, auditLog.reason, auditLog.executor);
            }
        }
    });
    
    /**
     * @event unhandledGuildMemberRemove
     * @description Emitted when the guildMemberRemove event is triggered but discord-logs didn't trigger any custom event.
     * @param {DJS:Guild} oldMember The member class of the user who left.
     * @param {DJS:Guild} guild The guild the member belonged to.
     * @example
     * client.on("unhandledGuildMemberRemove", (oldMember, newMember) => {
     *   console.log("Member '"+oldMember.id+"' left but discord-logs couldn't find what caused the user to leave...");
     * });
     */
    if (!emitted) {
        client.emit('unhandledGuildMemberRemove', oldMember, guild);
    }
 }
