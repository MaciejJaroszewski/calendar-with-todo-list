import _keys from "lodash.keys";
import _pickBy from "lodash.pickby";

export const classNames = (...args) => {
  return args
    .reduce((acc, curr) => {
      const names = typeof curr === "string" ? [curr] : _keys(_pickBy(curr));
      return [...acc, ...names];
    }, [])
    .join(" ");
};
