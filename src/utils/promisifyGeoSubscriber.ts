const locator: Geolocation | undefined = navigator && navigator.geolocation;

export class PromisifyGeoSubscriber {
    private onSuccess: ((position: Position) => void)[] = [];
    private onError: ((error: PositionError) => void)[] = [];
    private options: PositionOptions = {};
    constructor(options: PositionOptions) {
        this.options = options;
    }

    public subscribe = () => {
        if (this.onSuccess.length === 0 && locator) {
            locator.watchPosition(position => {
                this.onSuccess.forEach(resolve => resolve(position));
                this.onSuccess = [];
            }, error => {
                this.onError.forEach(reject => reject(error));
                this.onError = [];
            }, this.options);
        }
        return new Promise<Position>((resolve, reject) => {
            this.onSuccess.push(resolve);
            this.onError.push(reject);
        });
    }

    public hasLocator = () => !!locator;
}
