  export class Perman {
    /** 
     * @type {Object<string,bigint>}
     */
    _FLAGS;

    constructor(flags) {
      this._FLAGS = flags.reduce((all, key, index) => {
        const representation = BigInt(2 ** index);

        return {
          ...all,
          [key]: representation,
        };
      }, {});
    }

    static from = (flags)=>
      new Perman(flags);

    keys = () => Object.keys(this._FLAGS);
    values = () => Object.values(this._FLAGS);
    /** @param {string} flag */
    get = (flag) => this._FLAGS[flag] ?? -0b1n;

    /** @param {string[]} flags */
    serialize = (flags) => {
      if (!flags.length) return 0n;

      /** @type {bigint} */
      let res = 0n;
      // @ts-ignore
      for (const flag of flags) res |= this.get(flag);
      return res;
    };

    /** @param {bigint} permissions */
    deserialize = (permissions) => {
      if (!permissions) return [];

      return Object.entries(this._FLAGS)
        .filter((f) => f[1] === (f[1] & permissions))
        .map((f) => f[0]);
    };

    match = (permission, flags) => {
      if (!flags.length) return true;

      if (
        flags.some(
          (match) => (permission & this.get(match)) != this.get(match),
        )
      )
        return false;
      return true;
    };

    matchAll = this.match;
    hasAll = this.match;

    some = (permission, flags) => {
      if (!flags.length) return true;

      if (
        flags.some(
          (match) => (permission & this.get(match)) == this.get(match),
        )
      )
        return true;
      return false;
    };

    hasSome = this.some;

    hasNone = (permission, flags) => {
      if (!flags.length) return true;

      if (
        flags.some(
          (match) => (permission & this.get(match)) == this.get(match),
        )
      )
        return false;
      return true;
    };

    none = this.hasNone;

    /** 
     * @param {bigint} permissions
     * @param {bigint} flag
     */
    has = (permissions, flag) => {
      flag = typeof flag == "bigint" ? flag : this.get(flag);
      return (permissions & flag) == flag;
    };

    test = this.has;

    add = (permission, flag) => {
      const oldFlags = this.deserialize(permission);
      const newFlags = [...oldFlags, flag];
      return this.serialize(newFlags);
    };

    remove = (permission, flag) => {
      const oldFlags = this.deserialize(permission);
      const newFlags = oldFlags.filter((f) => f !== flag);
      return this.serialize(newFlags);
    };

    full = () => {
      const allFlags = this.keys();
      const permissions = this.serialize(allFlags);
      return permissions;
    };
  }
