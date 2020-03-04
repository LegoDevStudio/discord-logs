import { Client, GuildMember, Guild} from 'discord.js';

/**
 * @handler Guild Member Leave Events
 * @related guildMemberRemove
 */
 export async function handleGuildMemberRemoveEvent(client: Client, member: GuildMember, guild: Guild) {
    let emitted = false;
    
    
    /**
     * @event guildMemberKicked
     * @description Emitted when a member was kicked.
     * @param {DJS:GuildMember} member The member who was kicked.
     * @example
     * client.on("guildMemberKicked", (member) => {
     *   console.log(member.user.tag+" has been kicked from "+member.guild.name+"...");
     * });
     */
    guild.fetchAuditLogs({"limit":1,"user":member.user,"type":20}).then(logs => { // 20 = KICK
        if(logs.entires.size >= 1) {
            let auditLog = logs.entries.first();
            if((Date.now() - auditLog.createdTimestamp) < 1000) { // To prevent false positives.
                client.emit("guildMemberKicked", member, guild, auditLog.reason, auditLog.executor.username);
                emitted = true;
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
