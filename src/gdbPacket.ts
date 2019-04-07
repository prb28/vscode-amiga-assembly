/** Type of the message packet */
export enum GdbPacketType {
    ERROR,
    REGISTER,
    MEMORY,
    SEGMENT,
    END,
    STOP,
    UNKNOWN,
    OK,
    PLUS,
    FRAME,
    MINUS
}

/** Packet sent by the debugging server */
export class GdbPacket {
    private type: GdbPacketType;
    private message: string;
    private notification: boolean;

    constructor(type: GdbPacketType, message: string) {
        this.type = type;
        this.message = message;
        this.notification = false;
    }

    public setNotification(isNotification: boolean) {
        this.notification = isNotification;
    }

    public isNotification(): boolean {
        return this.notification;
    }

    public getType(): GdbPacketType {
        return this.type;
    }
    public getMessage(): string {
        return this.message;
    }

    /**
     * Parses the data recieved.
     * @param data Data to parse
     */
    public static parseData(data: any): GdbPacket[] {
        let parsedData = new Array<GdbPacket>();
        if (data) {
            let s = data.toString();
            if (s.startsWith('+')) {
                parsedData.push(new GdbPacket(GdbPacketType.PLUS, "+"));
                if (s.length > 1) {
                    s = s.substring(1);
                }
            }
            if (s.length > 0) {
                let messageRegexp = /\$([^$]*)\#[\da-f]{2}/gi;
                let match;
                if (s.startsWith('+')) {
                    s = s.substring(1);
                }
                while (match = messageRegexp.exec(s)) {
                    let message = GdbPacket.extractPacket(match[1]);
                    let isNotification = false;
                    if (message.startsWith("%Stop")) {
                        isNotification = true;
                        message = message.replace("%Stop:", "");
                    }
                    let packet = new GdbPacket(GdbPacket.parseType(message), message);
                    packet.setNotification(isNotification);
                    parsedData.push(packet);
                }
            }
            // TODO: check the checksum and ask to repeat the message if it is not verified
        }
        return parsedData;
    }


    /**
     * Extracts the contents of the packet
     * @param message Packet message to parse
     */
    protected static extractPacket(message: string): string {
        if (message.startsWith('$')) {
            let pos = message.indexOf('#');
            if (pos > 0) {
                return message.substring(1, pos);
            }
        }
        return message;
    }


    /**
     * Parses the type of the packet
     * @param message packet message to parse
     */
    public static parseType(message: string): GdbPacketType {
        if (message.startsWith("OK")) {
            return GdbPacketType.OK;
        } else if (message.startsWith("+")) {
            return GdbPacketType.PLUS;
        } else if (message.startsWith("AS")) {
            return GdbPacketType.SEGMENT;
        } else if (message.startsWith("E")) {
            return GdbPacketType.ERROR;
        } else if ((message.startsWith("S") || (message.startsWith("T")))) {
            return GdbPacketType.STOP;
        } else if (message.startsWith("W")) {
            return GdbPacketType.END;
        } else if (message.startsWith("F")) {
            return GdbPacketType.FRAME;
        } else if (message.startsWith("-")) {
            return GdbPacketType.MINUS;
        }
        return GdbPacketType.UNKNOWN;
    }
}