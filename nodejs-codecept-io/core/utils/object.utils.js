class ObjectUtils {
  static freezeObject(item) {
    Object.freeze(item);
    Object.keys(item).forEach((key) => {
      Object.freeze(item[key]);
      if (item[key] instanceof Object) ObjectUtils.freezeObject(item[key]);
    });
  }
}

exports.ObjectUtils = ObjectUtils;
