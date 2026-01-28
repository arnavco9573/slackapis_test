
import { config } from "dotenv";
config(); // Load environment variables from .env

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { SocketModeClient } from "@slack/socket-mode";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3011;

// Slack Socket Mode Setup
const slackAppToken = process.env.SLACK_APP_TOKEN;
if (!slackAppToken) {
    console.error("SLACK_APP_TOKEN is not defined in .env. Real-time Slack updates will not work.");
}

const socketModeClient = slackAppToken ? new SocketModeClient({ appToken: slackAppToken }) : null;

app.prepare().then(async () => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true);
        if (parsedUrl.pathname?.startsWith("/api/")) {
            handle(req, res, parsedUrl);
            return;
        }
        handle(req, res, parsedUrl);
    });

    const io = new Server(server, {
        path: "/api/socket/io", // Custom path to avoid conflicts
        addTrailingSlash: false,
    });

    io.on("connection", (socket: any) => {
        // console.log("Frontend client connected:", socket.id);

        socket.on("join-channel", (channelId: string) => {
            socket.join(channelId);
            // console.log(`Client ${socket.id} joined channel ${channelId}`);
        });

        socket.on("disconnect", () => {
            // console.log("Client disconnected:", socket.id);
        });
    });

    // Handle Slack Events
    if (socketModeClient) {
        // Listen to ALL events from Slack
        // Slack sends different event types based on where the message is posted

        // Handle all message events (channels, DMs, groups, etc.)
        const messageEventTypes = [
            'message',           // Generic message event
            'message.channels',  // Public channel messages
            'message.groups',    // Private channel messages
            'message.im',        // Direct messages
            'message.mpim'       // Multi-person direct messages
        ];

        messageEventTypes.forEach(eventType => {
            socketModeClient.on(eventType, async ({ event, ack }: { event: any, ack: any }) => {
                try {
                    await ack(); // Acknowledge immediately

                    console.log(`📨 [Server] Received Slack Event [${eventType}]:`, event);

                    // Broadcast to all clients
                    if (event.type === "message" && event.channel) {
                        console.log(`📤 [Server] Emitting message event to clients (from ${eventType})`);
                        io.emit("message", event);
                    }
                } catch (error) {
                    console.error(`Error handling Slack event [${eventType}]:`, error);
                }
            });
        });

        // Handle reaction events
        socketModeClient.on('reaction_added', async ({ event, ack }: { event: any, ack: any }) => {
            try {
                await ack();
                console.log("� [Server] Received reaction_added:", event);
                if (event.item?.channel) {
                    io.emit("reaction_added", event);
                }
            } catch (error) {
                console.error("Error handling reaction_added:", error);
            }
        });

        socketModeClient.on('reaction_removed', async ({ event, ack }: { event: any, ack: any }) => {
            try {
                await ack();
                console.log("📨 [Server] Received reaction_removed:", event);
                if (event.item?.channel) {
                    io.emit("reaction_removed", event);
                }
            } catch (error) {
                console.error("Error handling reaction_removed:", error);
            }
        });

        // Handle channel events
        socketModeClient.on('channel_created', async ({ event, ack }: { event: any, ack: any }) => {
            try {
                await ack();
                console.log("📢 [Server] Channel created:", event.channel);
                io.emit("channel_created", event);
            } catch (error) {
                console.error("Error handling channel_created:", error);
            }
        });

        socketModeClient.on('member_joined_channel', async ({ event, ack }: { event: any, ack: any }) => {
            try {
                await ack();
                console.log("📢 [Server] Member joined channel:", event.channel);
                io.emit("member_joined_channel", event);
            } catch (error) {
                console.error("Error handling member_joined_channel:", error);
            }
        });

        socketModeClient.on('channel_rename', async ({ event, ack }: { event: any, ack: any }) => {
            try {
                await ack();
                console.log("📢 [Server] Channel renamed:", event.channel);
                io.emit("channel_rename", event);
            } catch (error) {
                console.error("Error handling channel_rename:", error);
            }
        });

        // Catch-all for any other events we might have missed
        socketModeClient.on('slack_event', async ({ event, ack }: { event: any, ack: any }) => {
            try {
                await ack();
                console.log("📨 [Server] Received generic slack_event:", event.type, event);

                // If it's a message event we haven't caught, emit it
                if (event.type === "message" && event.channel) {
                    console.log("📤 [Server] Emitting message from catch-all");
                    io.emit("message", event);
                }
            } catch (error) {
                console.error("Error handling slack_event:", error);
            }
        });

        await socketModeClient.start();
        console.log("✅ Slack Socket Mode Client started and listening for ALL events.");
        console.log("📡 Subscribed to: message.channels, message.groups, message.im, message.mpim, reactions, channel events");
    }

    server.listen(port, () => {
        console.log(`> Server listening on http://localhost:${port} as ${dev ? "development" : "production"}`);
    });
});
