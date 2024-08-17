class ApiFeatures {
  constructor(query, filters) {
    this.query = query;
    this.filters = filters;
  }

  sort(fieldStr) {
    if (fieldStr) {
      this.query = this.query.sort(fieldStr.replaceAll(",", " "));
    }
    return this;
  }

  paginate(page = 1, limit = 10, total) {
    this.query = this.query.skip((page - 1) * limit).limit(limit);
    this.next = total > page * limit ? +page + 1 : null;
    this.previous = this.next
      ? page == 1
        ? null
        : page - 1
      : total > (page - 1) * limit
      ? page - 1
      : null;

    return this;
  }

  contains(field, string) {
    const regexp = new RegExp(`${string}`, "i");
    const containsFilter = string ? { [field]: { $regex: regexp } } : {};
    this.filters = { ...this.filters, ...containsFilter };
    this.query = this.query.find(containsFilter);
    return this;
  }

  async getCount(Model) {
    return await Model.countDocuments(this.filters);
  }
}

module.exports = ApiFeatures;
