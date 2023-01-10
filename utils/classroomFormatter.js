// * desc    Format a user MongoDB object
// * access  Private
// * Testing: Passed ✔ (19-05-2022)

const classroomFormatter = (
  classroom,
  isTeacher = false,
  optionalArg = {},
  defaultArgs = ["_id", "students", "__v","classTeacher","teachers"]
) => {
  let JSONClassroom = classroom.toObject();
  const JSONclassroomKeys = Object.keys(JSONClassroom);
  defaultArgs.forEach((arg) => {
    if (
      JSONclassroomKeys.includes(arg) &&
      !(optionalArg?.toInclude && optionalArg.toInclude.includes(arg))
    )
      if ((arg !== "students" && arg!== "teachers") || !isTeacher) delete JSONClassroom[arg];
  });
  if (optionalArg.delete)
    optionalArg.delete.forEach((arg) => {
      delete JSONClassroom[arg];
    });
  if (optionalArg.toInclude)
    for (let key in JSONClassroom) {
      if (!optionalArg.toInclude.includes(key)) delete JSONClassroom[key];
    }
  return JSONClassroom;
};

module.exports = classroomFormatter;
