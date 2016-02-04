'use strict';

require('dotenv').load();

/**
 * Define browsers to test against on Sauce.
 * For possible configurations supported by Sauce, see:
 * https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
 *
 * For more information about selenium's desired capabilities:
 * https://code.google.com/p/selenium/wiki/DesiredCapabilities
 *
 * All configurations must have at least the following properties:
 *
 * browserConfiguration = {
 *     name: name of the browser,
 *     latest: {
 *         version: latest version of the browser,
 *         platforms: array of platforms to tests the browser against
 *     }
 * }
 *
 * Each configuration can also include an `earliest` property, similar in format to `latest`, to
 * specify the earliest version of the browser to test.
 *
 * For mobile devices, the configuration should look like the following:
 *
 * mobileConfiguration = {
 *     name: name of the mobile device,
 *     deviceOrientation: orientation to tests against (currently sauce only seems to support 'portrait'),
 *     deviceType: type of the device (currently only necessary for android, as 'phone'),
 *     latest: {
 *         version: latest version of the OS,
 *         platforms: array of platforms of the OS, usually just a single 'Linux' or 'OS X' value,
 *         deviceNames: array of devices to test against
 *     }
 * }
 *
 * To find more about the configuration values, use the Platform Configurator from Sauce:
 * https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
 *
 * For the most part, you can just take the values listed from the Platform Configurator and put
 * them into the config format here. All values should be strings.
 *
 * Finally, if you add a new browser to the list, make sure to add it to the BROWSER_LIST as well.
 */
const chrome = {
    name: 'chrome',
    earliest: {
        version: '31.0', // OSX does not have Chrome 30 for some reason
        platforms: ['Windows 7', 'Linux', 'OS X 10.8']
    },
    latest: {
        version: '47.0',
        platforms: ['Windows 10', 'Linux', 'OS X 10.11']
    }
};

const ie = {
    name: 'internet explorer',
    earliest: {
        version: '10.0',
        platforms: ['Windows 8']
    },
    latest: {
        version: '11.0',
        platforms: ['Windows 10']
    }
};

const edge = {
    name: 'edge',
    latest: {
        version: '20.10240',
        platforms: ['Windows 10']
    }
};

const firefox = {
    name: 'firefox',
    earliest: {
        version: '35.0',
        platforms: ['Windows 7', 'Linux', 'OS X 10.8']
    },
    latest: {
        version: '43.0',
        platforms: ['Windows 10', 'Linux', 'OS X 10.11']
    }
};

const safari = {
    name: 'safari',
    earliest: {
        version: '7.0',
        platforms: ['OS X 10.9']
    },
    latest: {
        version: '9.0',
        platforms: ['OS X 10.11']
    }
};

const android = {
    name: 'android',
    deviceOrientation: 'portrait',
    deviceType: 'phone',
    earliest: {
        version: '4.4',
        platforms: ['Linux'],
        deviceNames: ['Android Emulator']
    },
    latest: {
        version: '5.1',
        platforms: ['Linux'],
        deviceNames: ['Android Emulator']
    }
};

const ios = {
    name: 'iphone',
    deviceName: 'iPhone 6 Plus',
    deviceOrientation: 'portrait',
    earliest: {
        version: '8.4',
        platforms: ['OS X 10.10'],
        deviceNames: ['iPhone 5']
    },
    latest: {
        version: '9.2',
        platforms: ['OS X 10.10'],
        deviceNames: ['iPhone 6 Plus']
    }
};

const BROWSER_LIST = [chrome, ie, edge, firefox, safari, android, ios];


/**
 * Generate the complete list of browsers from the configuration specfication above.
 *
 * @param  {object|object[]} browserConfig Browser configurations to expand
 * @return {object[]}                      List of browsers in Selenium's desired capabilities format
 */
function generateBrowsersFromConfig(browserConfigs) {
    if (browserConfigs == null) {
        throw new Error('No browser configurations given, check your test/integration/config.js');
    }

    if (!Array.isArray(browserConfigs)) {
        // If only a single config is given, wrap an array around it
        browserConfigs = [browserConfigs];
    }

    const browserList = browserConfigs.reduce((browserList, browserConfig) => {
        if (!(browserConfig.name && typeof browserConfig.name === 'string')) {
            throw new Error(`Browser configurations must include a name property as a string, instead got '${browserConfig.name}'.`);
        }

        return browserList
                    .concat(explodeBrowserVersions(browserConfig.earliest, browserConfig))
                    .concat(explodeBrowserVersions(browserConfig.latest, browserConfig));
    }, []);

    return browserList;
}

/**
 * Explodes the given version configuration into the matching list of desired capabilities
 *
 * @param  {object} browserVersionConfig Browser version configuration
 *                                       (ie. `latest` and `earliest` from the full browser configuration)
 * @param  {object} browserConfig        Full browser configuration
 * @return {object[]}                    List of browers in Selenium's desired capabilities format
*/
function explodeBrowserVersions(browserVersionConfig, browserConfig) {
    let browserListForVersion = [];

    if (browserVersionConfig && browserConfig) {
        const browserName = browserConfig.name;
        const browserVersion = browserVersionConfig.version;

        if (!(browserVersion && typeof browserVersion === 'string')) {
            throw new Error(`Configurations for '${browserName}' must include a version property as a string, instead got '${browserVersion}'.`);
        }

        if (!browserVersionConfig.platforms || !browserVersionConfig.platforms.length) {
            console.warn(`'${browserName} ${browserVersion}' configuration does not have any platforms listed. Skipping...`);
        } else {
            browserListForVersion = browserVersionConfig.platforms.reduce((browserVersions, platform) => {
                let browsersForPlatform;

                if (browserVersionConfig.deviceNames && browserVersionConfig.deviceNames.length) {
                    // Explode over the listed device names too
                    browsersForPlatform = browserVersionConfig.deviceNames.reduce((browserVersions, deviceName) => {
                        const { deviceOrientation, deviceType } = browserConfig;

                        return browserVersions.concat({
                            browserName,
                            deviceName,
                            deviceOrientation,
                            deviceType,
                            platform,
                            version: browserVersion
                        });
                    }, []);
                } else {
                    browsersForPlatform = {
                        browserName,
                        platform,
                        version: browserVersion
                    };
                }

                return browserVersions.concat(browsersForPlatform);
            }, []);
        }
    }

    return browserListForVersion;
}

module.exports = {
    BROWSERS: generateBrowsersFromConfig(BROWSER_LIST),
    APP_URL: process.env.SAUCE_DEFAULT_URL || 'http://localhost.com:3000'
};
