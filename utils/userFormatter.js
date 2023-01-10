// * desc    Format a user MongoDB object
// * access  Private
// * Testing: Passed ✔ (19-05-2022)

const userFormatter = (
  user,
  optionalArg = {},
  defaultArgs = ["password", "__v", "date", "_id"]
) => {
  let JSONUser = user.toObject();
  defaultArgs.forEach((arg) => {
    delete JSONUser[arg];
  });
  if (optionalArg.delete)
    optionalArg.delete.forEach((arg) => {
      delete JSONUser[arg];
    });
  if (optionalArg.toInclude)
    for (let key in JSONUser) {
      if (!optionalArg.toInclude.includes(key)) delete JSONUser[key];
    }
  return JSONUser;
};

module.exports = userFormatter;
