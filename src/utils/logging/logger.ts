import winston from "winston";

const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYYMMDD HH:mm:ss"
        }),
        winston.format.json(),
        winston.format.printf((info: any) => {
            const { timestamp, level, message, module } = info;
            return JSON.stringify({ 
            date: timestamp.split(' ')[0],
            time: timestamp.split(' ')[1],
            level,
            module,
            message });
        })
    ),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
        new winston.transports.Console(),
    ],
});

export default logger;