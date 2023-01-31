import chalk from "chalk";
import pjson from "pjson";

const formatDate = (timestamp) => timestamp.toISOString()
                                .replace("T", " ")
                                .replace("Z", "");


function shortMsg({origin = pjson.name, level, description, err = null,
                      timestamp, logger, ...content}) {
    const src = origin ? `[${origin}]`: "";
    let msg = `[${formatDate(timestamp)}] ${src}${level}: ${description}`;
    if (Object.keys(content).length > 0) msg += JSON.stringify(content);
    if (err) {
        if (err.stack) msg += `\n${err.stack}`;
        if (err.errors) msg += `\nErrors: ${JSON.stringify(err.errors, null, 4)}`;
        if (!err.stack && !err.errors) msg += `\n${JSON.stringify(err, null, 4)}`;
    }
    return msg;
}

function longMsg({origin = "", level, description, err = null,
                     timestamp, logger, ...content}) {

}

function register(params) {
    params.timestamp = new Date();
    const {logger, level}  = params;

    let color;
    if (level === "ERROR") color = chalk.redBright;
    else if (level === "INFO") color = chalk.yellowBright;
    else color = chalk.white;
    console.error(color(shortMsg(params)));
    if (logger) logger(longMsg(params));
    return false;
}

export function runAndLog(promise, {origin='Async', onSuccess=info, onError=error} = {}) {
    return promise.then(r => {
            const log = {origin, description: 'Success'};
            if (r) log.result = JSON.stringify(r);
            onSuccess(log);
        }).catch(err => onError({origin, description:'Failure', err}))
}

export const debug = (params) => register({level: "DEBUG", ...params});
export const info = (params) => register({level: "INFO", ...params});
export const error = (params) => register({level: "ERROR", ...params});
