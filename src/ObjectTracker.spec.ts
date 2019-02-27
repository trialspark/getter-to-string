import ObjectTracker from './ObjectTracker';

describe('ObjectTracker', () => {
  let tracker: ObjectTracker<{
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
      state: string;
      zip: string;
    };
  }>;

  beforeEach(() => {
    tracker = new ObjectTracker({
      name: 'Steve Brule',
      patients: [
        { name: 'Josh', age: 27, medications: [] },
        { name: 'Dan', age: 51, medications: [{ type: 'ibuprofen' }] },
        { name: 'Louan', age: 53, medications: [{ type: 'probiotic' }] },
      ],
      address: {
        street: '25 West 27th Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
      },
    });
  });

  it('exists', () => {
    expect(tracker).toEqual(expect.any(ObjectTracker));
  });

  it('tracks the properties called', () => {
    expect(
      new Set(
        tracker.track(obj => {
          return [obj.name, obj.address];
        }),
      ),
    ).toEqual(new Set(['name', 'address']));
    expect(
      new Set(
        tracker.track(obj => {
          const { name, address, patients } = obj;
          return [name, address.state, patients];
        }),
      ),
    ).toEqual(new Set(['name', 'address.state', 'patients']));
    expect(
      new Set(
        tracker.track(obj => {
          const { name, address, patients } = obj;
          return [name, address.state, patients[1].medications[0].type];
        }),
      ),
    ).toEqual(new Set(['name', 'address.state', 'patients[1].medications[0].type']));
  });

  it('returns an empty Array if no properties are accessed', () => {
    expect(tracker.track(() => {})).toEqual([]);
  });
});
