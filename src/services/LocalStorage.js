import  AsyncStorage  from '@react-native-community/async-storage';

let APP_NAME = '@Default:';

export default LocalStorage = {
    setAppName: appName => {
        APP_NAME = `@${appName.replace(' ', '_')}:`;
    },
    setValue: function(key, value) {
        return new Promise(async (resolve, reject) => {
            try {
                const valToSave = value !== null ? value.toString() : '';
                await AsyncStorage.setItem(APP_NAME + key, valToSave);
                return resolve({ value });
            } catch (error) {
                return reject(error);
            }
        });
    },
    getValue: function(key) {
        return new Promise(async (resolve, reject) => {
            try {
                const value = await AsyncStorage.getItem(APP_NAME + key);
                return resolve(parseVal(value));
            } catch (error) {
                return reject(error);
            }
        });
    },
    setObject: function(key, value) {
        return new Promise(async (resolve, reject) => {
            try {
                const props = Object.keys(value);
                for (let i = 0; i < props.length; i++) {
                    const propName = props[i];
                    const propVal = value[propName] !== null ? value[propName].toString() : '';
                    await AsyncStorage.setItem(APP_NAME + key + '_' + propName, propVal);
                }

                return resolve({ value });
            } catch (error) {
                return reject(error);
            }
        });
    },
    getObject: function(key) {
        return new Promise(async (resolve, reject) => {
            try {
                let returnObj = {};
                const savedKeys = await AsyncStorage.getAllKeys();
                for (let i = 0; i < savedKeys.length; i++) {
                    const propName = savedKeys[i];

                    if (propName.indexOf(APP_NAME + key + '_') !== -1) {
                        const retKeyName = propName.replace(APP_NAME + key + '_', '');
                        returnObj[retKeyName] = await AsyncStorage.getItem(propName);
                        returnObj[retKeyName] = parseVal(returnObj[retKeyName]);
                    }
                }
                if (Object.keys(returnObj).length) return resolve(returnObj);
                else return resolve(null);
            } catch (error) {
                return reject(error);
            }
        });
    },
    removeAll: function() {
        return new Promise(async (resolve, reject) => {
            try {
                const keys = await this.getAllKeys();
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    await AsyncStorage.removeItem(key);
                }
                return resolve({ success: true });
            } catch (error) {
                return reject(error);
            }
        });
    },
    remove: function(key) {
        return new Promise(async (resolve, reject) => {
            try {
                await AsyncStorage.removeItem(APP_NAME + key);
                return resolve({ success: true });
            } catch (error) {
                return reject(error);
            }
        });
    },
    getAllKeys: function() {
        return new Promise(async (resolve, reject) => {
            try {
                const keys = await AsyncStorage.getAllKeys();
                const appKeys = [];
                keys.forEach(key => {
                    if (key.indexOf(APP_NAME) !== -1) {
                        appKeys.push(key);
                    }
                });

                return resolve(appKeys);
            } catch (error) {
                return reject(error);
            }
        });
    }
};

parseVal = val => {
    if (val === null) return null;
    if (val.toLowerCase() === 'true') return true;
    if (val.toLowerCase() === 'false') return false;
    if (!isNaN(val)) return Number(val);

    return val;
};
