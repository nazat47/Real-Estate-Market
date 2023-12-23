const { Unauthenticated } = require("../errors");

const checkPermission = (requestUser, resourceId) => {
  if (requestUser.id === resourceId.toString()) {
    return;
  }
  throw new Unauthenticated("you dont have permission");
};
module.exports = checkPermission;
