import ObjectTracker from './ObjectTracker';

export type ToString<T extends object> = (getter: (source: T) => unknown) => string;

export default function getterToString<T extends object>(source: T): ToString<T> {
  const tracker = new ObjectTracker(source);

  return getter => {
    const accessed = tracker.track(getter);

    if (accessed.length > 1) {
      throw new Error('Only one property may be accessed!');
    }

    return accessed[0];
  };
}
