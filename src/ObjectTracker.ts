type Getter<T> = (proxy: T) => unknown;

export default class ObjectTracker<T extends object> {
  private source: T;

  private proxy: T;

  private accessed: { [accessed: string]: null } | null = null;

  private children: ObjectTracker<object>[] = [];

  private key: string | null;

  public constructor(source: T, key?: string) {
    this.key = key || null;
    this.source = source;
    this.proxy = this.createProxy(source);
  }

  private getKeyPath(key: string): string {
    if (Array.isArray(this.source)) {
      return `[${key}]`;
    }
    if (this.key) {
      return `.${key}`;
    }
    return key;
  }

  private createProxy(source: T): T {
    const proxy = {};

    Object.entries(source).forEach(([key, value]) => {
      const keyPath = this.getKeyPath(key);
      const childTracker =
        value != null && typeof value === 'object' ? new ObjectTracker(value, keyPath) : null;

      if (childTracker) {
        this.children.push(childTracker);
      }

      Object.defineProperty(proxy, key, {
        get: () => {
          if (this.accessed) {
            this.accessed[keyPath] = null;
          } else {
            throw new Error('Properties may only be accessed during tracking!');
          }

          if (childTracker) {
            return childTracker.proxy;
          }

          return value;
        },
      });
    });

    return proxy as T;
  }

  private callGetter(getter: Getter<T>, accessed: NonNullable<ObjectTracker<T>['accessed']>): void {
    /* eslint-disable no-param-reassign */
    this.children.reduce(
      (prevFn, child) => (proxy: T) => {
        const childAccessed = child.track(() => prevFn(proxy));

        if (child.key && childAccessed.length > 0) {
          delete accessed[child.key];
          childAccessed.forEach(key => {
            accessed[child.key + key] = null;
          });
        }
      },
      getter,
    )(this.proxy);
  }

  public track(func: Getter<T>): string[] {
    try {
      this.accessed = {};
      this.callGetter(func, this.accessed);
      return Object.keys(this.accessed);
    } finally {
      this.accessed = null;
    }
  }
}
