import { GdbPacket } from "./gdbPacket";

/**
 * Lite Consumer event interface
 */
interface ILiteConsumerEvent<T> {
    on(handler: { (data: T): boolean }): void;
    off(handler: { (data: T): boolean }): void;
}


/**
 * Class managing events listeners.
 * When an Event is consumed, the handler is removed and the trigger is stopped.
 */
class LiteConsumerEvent<T> implements ILiteConsumerEvent<T> {
    private defaultHandler?: { (data: T): boolean; };
    private handlers: { (data: T): boolean; }[] = [];

    constructor(defaultHandler?: { (data: T): boolean; }) {
        this.defaultHandler = defaultHandler;
    }

    public on(handler: { (data: T): boolean }): void {
        this.handlers.push(handler);
    }

    public off(handler: { (data: T): boolean }): void {
        this.handlers = this.handlers.filter(h => h !== handler);
    }

    public trigger(data: T) {
        let consumer: { (data: T): boolean } | undefined;
        for (let h of this.handlers) {
            if (h(data)) {
                consumer = h;
                break;
            }
        }
        if (consumer) {
            this.off(consumer);
        } else if (this.defaultHandler) {
            this.defaultHandler(data);
        }
    }

    public expose(): ILiteConsumerEvent<T> {
        return this;
    }
}

interface ILiteHandler<T> {
    handle(data: T): boolean;
}

export interface GdbPacketHandler extends ILiteHandler<GdbPacket> {
}

/**
 * Class to manage the Gdb data received.
 * The data is consumed by the first handler added tha consumes it.
 */
export class GdbReceivedDataManager {
    private readonly onData: LiteConsumerEvent<GdbPacket>;

    constructor(defaultHandler?: { (data: GdbPacket): boolean; }) {
        this.onData = new LiteConsumerEvent<GdbPacket>(defaultHandler);
    }

    public get OnData() { return this.onData.expose(); }
    public trigger(data: GdbPacket) {
        this.onData.trigger(data);
    }

    public waitData(handler: GdbPacketHandler): Promise<GdbPacket> {
        return new Promise((resolve, reject) => {
            this.onData.on((packet): boolean => {
                if (handler.handle(packet)) {
                    resolve(packet);
                    return true;
                }
                return false;
            });
        });
    }
}