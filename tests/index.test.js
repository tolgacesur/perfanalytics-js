import Perfanalytics from '../src/index';

require('jest-fetch-mock').enableMocks();

let metrics;
let consoleSpy;

describe('Should validate library initialization', () => {

    beforeEach(() => {
        consoleSpy = jest.spyOn(global.console, 'error');
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    test.each([
        ['if configuration object is none', undefined, "Configuration parameter is required. Example : {token : 'XXXXXX'}"],
        ['if configuration object is empty', {token: ''}, "Token property of configuration object is required"]
    ])('Should throw console error %s', (text, config, error) => {
        Perfanalytics(config);
        expect(console.error).toBeCalled();
        expect(console.error.mock.calls[0])
            .toEqual(expect.arrayContaining(["Perfanalytics : ", error]));
    });
});

describe('Should measure some performance metrics', () => {

    beforeEach(() => {
        jest.spyOn(global, 'window', 'get').mockImplementation(() => ({
            addEventListener: jest.fn(),
            location : {
                href : 'test.com'
            },
            performance: {
                getEntriesByType : (type) => {
                    const entries = {
                        navigation : [{
                                requestStart : 0,
                                responseStart : 10,
                                loadEventStart : 10,
                                loadEventEnd : 15,
                                domComplete : 20,
                        }],
                        paint : [{startTime : 20}],
                        resource : [{
                            name : 'trendyol.com/test.png',
                            initiatorType : 'png',
                            duration : 20,
                            transferSize: 200
                        }]
                    }
    
                    return entries[type];
                }
            }
        }));

        metrics = Perfanalytics({token: 'test-token'}).getMetrics();
    });

    test('Should measure TTFB', () => {
        expect(metrics.ttfb).toBe(10);
    });

    test('Should measure FCP', () => {
        expect(metrics.fcp).toBe(20);
    });

    test('Should measure DOM load', () => {
        expect(metrics.domComplete).toBe(20);
    });

    test('Should measure Window load event', () => {
        expect(metrics.windowLoadEvent).toBe(5);
    });

    test('Should measure Resources', () => {
        expect(metrics.resources)
            .toEqual(expect.arrayContaining([{
                url : 'trendyol.com/test.png',
                type : 'png',
                duration : 20,
                transferSize: 200
            }]));
    });

});

describe('Should make API call', () => {

    beforeEach(function() {
        fetch.resetMocks();
    });

    test('Should correctly send metrics to API', () => {
        Perfanalytics({token: 'test-token'}).postMetrics({});
        expect(fetch.mock.calls.length).toEqual(1);
    });
});


