import getterToString, { ToString } from './index';

describe('getterToString(source)(getter)', () => {
  let source: {
    name: string;
    patients: {
      name: string;
      age: number;
      medications: {
        type: string;
      }[];
    }[];
    address: {
      street: string;
      city: string;
      stage: string;
      zip: string;
    };
  };
  let toString: ToString<typeof source>;

  beforeEach(() => {
    source = {
      name: 'Steve Brule',
      patients: [
        { name: 'Josh', age: 27, medications: [] },
        { name: 'Dan', age: 51, medications: [{ type: 'ibuprofen' }] },
        { name: 'Louan', age: 53, medications: [{ type: 'probiotic' }] },
      ],
      address: {
        street: '25 West 27th Street',
        city: 'New York',
        stage: 'NY',
        zip: '10001',
      },
    };
    toString = getterToString(source);
  });

  it('returns the path accessed by the getter', () => {
    expect(toString(s => s.name)).toBe('name');
    expect(toString(s => s.address)).toBe('address');
    expect(toString(s => s.address.street)).toBe('address.street');
    expect(toString(s => s.patients[1].medications[0].type)).toBe(
      'patients[1].medications[0].type',
    );
  });

  it('throws an error if more than one property is accessed', () => {
    expect(() =>
      toString(s => {
        return [s.name, s.patients];
      }),
    ).toThrow('Only one property may be accessed!');
    expect(() =>
      toString(s => {
        const { patients } = s;
        return [patients[0], patients[1]];
      }),
    ).toThrow('Only one property may be accessed!');
    expect(() =>
      toString(s => {
        const { patients } = s;
        return [s.name, patients, patients[0], s.address.city];
      }),
    ).toThrow('Only one property may be accessed!');
  });

  it('returns undefined if no properties are accessed', () => {
    expect(toString(() => {})).toBeUndefined();
  });
});
