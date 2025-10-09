import {readdirSync, statSync} from "fs";
import {join} from "path";
import type {H3Event} from 'h3'

function getNames(dir: string): any {
    return readdirSync(dir).map((entry) => {
        const full = join(dir, entry);
        const stat = statSync(full);

        if (stat.isDirectory()) {
            return {[entry]: getNames(full)};
        } else {
            return entry;
        }
    });
}

export default cachedEventHandler((event) => {
    const baseDir = join(process.cwd(), "data");
    return getNames(baseDir);
}, {
    maxAge: 60 * 60, // 1 hour
    getKey: (event: H3Event) => event.path
})