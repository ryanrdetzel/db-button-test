exports.up = (pgm) => {
  pgm.createTable("clicks", {
    id: "id",
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("clicks");
};
