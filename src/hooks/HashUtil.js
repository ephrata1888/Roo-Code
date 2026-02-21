import { createHash } from "crypto";
export class HashUtil {
    static sha256(content) {
        return createHash("sha256").update(content).digest("hex");
    }
}
