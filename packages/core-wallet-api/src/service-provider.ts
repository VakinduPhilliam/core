import { Contracts, Providers } from "@arkecosystem/core-kernel";
import { isWhitelisted } from "@arkecosystem/core-utils";
import ip from "ip";
import { startServer } from "./server";

export class ServiceProvider extends Providers.AbstractServiceProvider {
    public async register(): Promise<void> {
        if (!isWhitelisted(this.ioc.get<any>("api.options").whitelist, ip.address())) {
            this.ioc.get<Contracts.Kernel.Log.ILogger>("log").info("Wallet API is disabled");
            return;
        }

        return startServer(this.config().get("server"));
    }

    public async dispose(): Promise<void> {
        try {
            this.ioc.get<Contracts.Kernel.Log.ILogger>("log").info("Stopping Wallet API");

            await this.ioc.get<any>("wallet-api").stop();
        } catch (error) {
            // do nothing...
        }
    }
}