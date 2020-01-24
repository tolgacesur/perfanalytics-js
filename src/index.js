// This is necessary to able to initialize library instance without new keyword
export default function Pefanalytics(config) {
    const instance = new PerfanalyticsInstance(config);
    instance.start();

    return instance;
}

class PerfanalyticsInstance {
    constructor(config){
        this.isValid = this.validate(config);

        Object.assign(this, config);
    }

    start(){
        if (!this.isValid){
            return;
        }

        // Exectues after everything is loaded and parsed
        window.addEventListener('load', () => {
            setTimeout(() => {
                const metrics = this.getMetrics();
                this.postMetrics(metrics);
            })
        }, false);
    }

    // DOCUMENTATION : https://developer.mozilla.org/en-US/docs/Web/API/Performance_API
    getMetrics(){
        const performance = window.performance;

        // Get all entries
        const resourceListEntries = performance.getEntriesByType("resource");

        // Returns an array of a single object by default so we're directly getting that out.
        const firstContentfulPaintEntry = performance.getEntriesByType("paint")[0];
        const navigationEntry = performance.getEntriesByType("navigation")[0]; 

        // Time To First Byte
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;

        // Dom load duration
        const domComplete = navigationEntry.domComplete;

        // Window load duration
        const windowLoadEvent = navigationEntry.loadEventEnd - navigationEntry.loadEventStart;

        // Get the timestamp when the paint ocurred
        const fcp = firstContentfulPaintEntry ? firstContentfulPaintEntry.startTime : null;

        // Get list of network timings
        const resources = [];
        resourceListEntries.forEach(resource => {
            resources.push({
                url : resource.name,
                type : resource.initiatorType,
                duration : resource.duration,
                transferSize : resource.transferSize // in octets
            });
        });

        return {ttfb, fcp, domComplete, windowLoadEvent, resources};
    }

    validate(config){
        try {
            if (!config) {
                throw("Configuration parameter is required. Example : {token : 'XXXXXX'}");
            } else if (!config.token){
                throw("Token property of configuration object is required");
            }

            return true;
        } catch (error) {
            console.error("Perfanalytics : ", error);
        }
    }

    // Post performance metrics with token and url address of current website
    postMetrics(metrics){
        fetch(`${process.env.API_BASE_URL}/api/metrics`, {
            method : 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({token: this.token, metrics, url: window.location.href})
        })
        .then(() => {})
        .catch(() => {});
    }
}