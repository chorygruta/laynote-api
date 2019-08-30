const dbConnections = [];

module.exports = async req => {
  return global.masterDB;

  // Uncomment if multi-tenancy is supported
  /* 
  // check if user is authenticated
  if (!req.decoded.isAuth) {
    return global.masterDB;
  }
  
  // check if the user belongs to any organization
  const organizationUser = await global.masterDB.organization_user.findOne({
    where: {
      userId: req.decoded.userId
    }
  });

  if (!organizationUser) {
    // user doesn't belong to any organization
    console.log("user doesn't belong to any organization");
    return global.masterDB;
  }

  const organization = await global.masterDB.organization.findByPk(
    organizationUser.organizationId
  );

  if (!organization) {
    console.log("user doesn't belong to a valid organization");
    return global.masterDB;
  }

  // add organization id to req.decoded
  req.decoded.organizationId = organization.id;

  let newConnection = {
    db: null,
    name: organization.name
  };

  // find if connection already exist
  const foundConnection = dbConnections.find(connection => {
    return connection.name === newConnection.name;
  });

  if (foundConnection) {
    console.log("connection already exists!");
    return {
      ...foundConnection.db,
      ...global.masterDB
    };
  } else {
    console.log("connection doesnt exist yet. Creating...");
    // console.log(organization.database_uri);
    newConnection.db = await require("../models/tenant")(
      organization.database_uri
    );

    dbConnections.push(newConnection);

    return {
      ...newConnection.db,
      ...global.masterDB
    };
  } */
};
