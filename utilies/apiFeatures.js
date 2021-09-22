exports.checkFields = async (req, res, next) => {
    req.query.fields =
      "name,price,images,colors,company,description,category,shipping";
  
    next();
  };

class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    limitedFields() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.query.select("-__v");
      }
      return this;
    }

    filter() {
        const queryObj = {...this.queryString};
        const excludedFields = ['page','sort','limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        this.query = this.query.find(queryObj)
        return this;
    }

    paginate() {
      const page = this.queryString.page * 1 || 1;
      let limit;

      limit = this.queryString.limit * 20;
      const skip = (page - 1) * limit;

      this.query = this.query.skip(skip).limit(limit);
    }

  }