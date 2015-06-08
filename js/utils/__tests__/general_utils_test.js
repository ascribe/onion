jest.dontMock('../general_utils.js');


let GeneralUtils = require('../general_utils')

let sanitize = GeneralUtils.sanitize;
let sumNumList = GeneralUtils.sumNumList;
let formatText = GeneralUtils.formatText;
let mergeOptions = GeneralUtils.mergeOptions;

describe('GeneralUtils', () =>  {
    it('should sanitize object (delete all empty strings, null and undefined values)', () => {
        let obj = {
            definedValue: 1,
            undefinedValue: undefined,
            nullValue: null,
            emptyString: '',
            notEmptyString: 'Something else'
        };

        let sanitizedObj = sanitize(obj);
        expect(sanitizedObj.definedValue).toBeDefined();
        expect(sanitizedObj.notEmptyString).toBeDefined();
        expect(sanitizedObj.undefinedValue).toBeUndefined();
        expect(sanitizedObj.nullValue).toBeUndefined();
        expect(sanitizedObj.emptyString).toBeUndefined();
    });

    it('should sum up all values of a list', () => {
        expect(sumNumList([1,2,3])).toBe(6);
        expect(sumNumList([1,-2,3])).toBe(2);
        expect(sumNumList(['string',2,3])).toBe(5);
        expect(sumNumList([0,0,0])).toBe(0);
        expect(sumNumList([() => 'asdasd',2,3])).toBe(5);
    });

    it('should format a string with inline variables to a plain string using an arbitrary number of arguments', () => {
        expect(formatText('Number %d', 1)).toBe('Number 1');
        expect(formatText('Number %s', 1)).toBe('Number 1');
        expect(formatText('Number %d %s', '1', 2)).toBe('Number 1 2');
        expect(formatText('Number %d %d %d %s %d %d %d', 1, 2, 3, 4, 5, 6, 7)).toBe('Number 1 2 3 4 5 6 7');
    });

    it('should merge n objects keys and values and throw an error on matching-keys-overwrite', () => {
        let obj1 = {
            name: 'Obj1',
            someValue: 'hello'
        };
        let obj2 = {
            othername: 'Obj2',
            someValue: 'world'
        };
        let obj3 = {
            othername: 'Obj3',
            someFn: () => parseFloat(0.9),
            numberValue: 2
        };

        expect(() => mergeOptions(obj1, obj2)).toThrow();

        // jasmine actually does a deep comparison for functions as well
        expect(mergeOptions(obj1, obj3)).toEqual({
            name: obj1.name,
            someValue: obj1.someValue,
            othername: obj3.othername,
            someFn: obj3.someFn,
            numberValue: obj3.numberValue
        });
    });
});